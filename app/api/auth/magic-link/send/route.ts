import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, role, acceptedPrivacy } = await request.json()

    if (!email || !role || !acceptedPrivacy) {
      return NextResponse.json(
        { error: 'Email, role och godkännande av integritetspolicy krävs' },
        { status: 400 }
      )
    }

    // Generera säker magic link token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Giltig i 1 timme

    // Skapa eller uppdatera användare
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        magicLinkToken: token,
        tokenExpiresAt: expiresAt,
        role: role, // Uppdatera roll om ändrad
      },
      create: {
        email,
        role,
        magicLinkToken: token,
        tokenExpiresAt: expiresAt,
        verified: false,
      }
    })

    // Skapa magic link URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const magicLink = `${baseUrl}/api/auth/magic-link/verify?token=${token}`

    // I produktion: skicka email via Resend/SendGrid
    // För nu: returnera länk för testning
    console.log(`Magic link for ${email}: ${magicLink}`)

    // TODO: Skicka email
    if (process.env.RESEND_API_KEY) {
      await sendMagicLinkEmail(email, magicLink, user.name || 'där')
    }

    return NextResponse.json({ 
      success: true,
      message: 'Magic link skickad! Kolla din inkorg.',
      // I dev: returnera länken så vi kan testa
      ...(process.env.NODE_ENV === 'development' && { magicLink })
    })

  } catch (error) {
    console.error('Magic link send error:', error)
    return NextResponse.json(
      { error: 'Kunde inte skicka magic link' },
      { status: 500 }
    )
  }
}

async function sendMagicLinkEmail(email: string, magicLink: string, name: string) {
  // Placeholder för email-integration
  // I produktion: använd Resend, SendGrid eller liknande
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'BOLAXO <noreply@bolaxo.se>',
        to: email,
        subject: 'Din inloggningslänk till BOLAXO',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">Välkommen till BOLAXO</h1>
            <p>Hej ${name},</p>
            <p>Klicka på länken nedan för att logga in på ditt konto:</p>
            <a href="${magicLink}" style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
              Logga in
            </a>
            <p style="color: #6b7280; font-size: 14px;">
              Länken är giltig i 1 timme. Om du inte begärt denna länk, ignorera detta mail.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px;">
              BOLAXO © 2025 | Sveriges moderna marknadsplats för företagsöverlåtelser
            </p>
          </div>
        `
      })
    })

    if (!response.ok) {
      console.error('Email send failed:', await response.text())
    }
  } catch (error) {
    console.error('Email send error:', error)
  }
}

