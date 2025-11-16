import { prisma } from '@/lib/prisma'

const DEFAULT_FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@bolaxo.com'
const DEFAULT_FROM_NAME = process.env.EMAIL_FROM_NAME || 'BOLAXO'

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
  fromName?: string
}

async function logEmailResult({
  to,
  subject,
  status,
  providerMessageId,
  error,
  payload
}: {
  to: string[]
  subject: string
  status: 'success' | 'failed'
  providerMessageId?: string
  error?: string
  payload?: Record<string, unknown>
}) {
  try {
    await prisma.emailLog.create({
      data: {
        to: to.join(', '),
        subject,
        status,
        providerMessageId,
        errorMessage: error,
        payload: payload ? JSON.parse(JSON.stringify(payload)) : null
      }
    })
  } catch (logError) {
    console.error('Email log error:', logError)
  }
}

/**
 * Send email via Sendinblue (Brevo) API
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!process.env.BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not configured, email will not be sent')
    console.log('Email would be sent to:', options.to)
    console.log('Subject:', options.subject)
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const recipients = Array.isArray(options.to) ? options.to : [options.to]
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: options.fromName || DEFAULT_FROM_NAME,
          email: options.from || DEFAULT_FROM_EMAIL,
        },
        to: recipients.map(email => ({ email })),
        subject: options.subject,
        htmlContent: options.html,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Sendinblue API error:', errorText)
      await logEmailResult({
        to: recipients,
        subject: options.subject,
        status: 'failed',
        error: `Sendinblue API error: ${response.status} ${errorText}`,
        payload: { preview: options.html.slice(0, 200) }
      })
      return { 
        success: false, 
        error: `Sendinblue API error: ${response.status} ${errorText}` 
      }
    }

    const data = await response.json()
    await logEmailResult({
      to: recipients,
      subject: options.subject,
      status: 'success',
      providerMessageId: data.messageId,
      payload: { preview: options.html.slice(0, 200) }
    })
    return { 
      success: true, 
      messageId: data.messageId 
    }
  } catch (error) {
    console.error('Email send error:', error)
    await logEmailResult({
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      payload: { preview: options.html.slice(0, 200) }
    })
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Send magic link email
 */
export async function sendMagicLinkEmail(
  email: string,
  magicLink: string,
  name: string = 'där'
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendEmail({
    to: email,
    subject: 'Din inloggningslänk till BOLAXO',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #1F3C58; padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                      BOLAXO
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1F3C58; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                      Välkommen till BOLAXO
                    </h2>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hej ${name},
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Klicka på knappen nedan för att logga in på ditt konto:
                    </p>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 0 0 30px 0;">
                          <a href="${magicLink}" style="display: inline-block; background-color: #1F3C58; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px;">
                            Logga in på BOLAXO
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Info -->
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                      <strong>Länken är giltig i 1 timme.</strong> Om du inte begärt denna länk, ignorera detta mail.
                    </p>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                      Om knappen inte fungerar, kopiera och klistra in denna länk i din webbläsare:
                    </p>
                    
                    <p style="color: #1F3C58; font-size: 12px; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px; margin: 0; font-family: monospace;">
                      ${magicLink}
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 5px 0;">
                      <strong style="color: #1F3C58;">BOLAXO</strong> © 2025 | Sveriges moderna marknadsplats för företagsöverlåtelser
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                      Verifierade uppgifter • NDA innan detaljer • Kvalificerade köpare
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    fromName: DEFAULT_FROM_NAME,
    from: DEFAULT_FROM_EMAIL
  })
}

/**
 * Send LOI notification email to seller
 */
export async function sendLOINotificationEmail(
  sellerEmail: string,
  sellerName: string,
  buyerName: string,
  listingTitle: string,
  loiId: string,
  baseUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const loiUrl = `${baseUrl}/loi/${loiId}`
  
  return sendEmail({
    to: sellerEmail,
    subject: `Ny indikativt bud (LOI) från ${buyerName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #1F3C58; padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                      BOLAXO
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1F3C58; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                      Ny LOI mottagen
                    </h2>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hej ${sellerName},
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Du har fått ett nytt indikativt bud (LOI) från <strong>${buyerName}</strong> för ditt objekt:
                    </p>
                    
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1F3C58;">
                      <p style="margin: 0; font-weight: 600; color: #1F3C58; font-size: 18px;">${listingTitle}</p>
                    </div>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 0 0 30px 0;">
                          <a href="${loiUrl}" style="display: inline-block; background-color: #1F3C58; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px;">
                            Se LOI och hantera
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                      Logga in på BOLAXO för att se detaljer och godkänna eller avslå budet.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 5px 0;">
                      <strong style="color: #1F3C58;">BOLAXO</strong> © 2025 | Sveriges moderna marknadsplats för företagsöverlåtelser
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    fromName: 'BOLAXO',
    from: 'noreply@bolaxo.com'
  })
}

/**
 * Send LOI approval email to buyer
 */
export async function sendLOIApprovalEmail(
  buyerEmail: string,
  buyerName: string,
  listingTitle: string,
  transactionId: string,
  baseUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const transactionUrl = `${baseUrl}/transaktion/${transactionId}`
  
  return sendEmail({
    to: buyerEmail,
    subject: `Din LOI har godkänts för ${listingTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #1F3C58; padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                      BOLAXO
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1F3C58; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                      LOI godkänd! 🎉
                    </h2>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hej ${buyerName},
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Vi har glada nyheter! Din LOI för <strong>${listingTitle}</strong> har godkänts av säljaren.
                    </p>
                    
                    <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
                      <p style="margin: 0; font-weight: 600; color: #065f46; font-size: 16px;">Transaktionen är nu skapad och redo att börja!</p>
                    </div>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 0 0 30px 0;">
                          <a href="${transactionUrl}" style="display: inline-block; background-color: #1F3C58; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px;">
                            Gå till transaktion
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                      <strong>Nästa steg:</strong> Logga in på BOLAXO för att se transaktionsdashboarden och börja med Due Diligence.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 5px 0;">
                      <strong style="color: #1F3C58;">BOLAXO</strong> © 2025 | Sveriges moderna marknadsplats för företagsöverlåtelser
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    fromName: 'BOLAXO',
    from: 'noreply@bolaxo.com'
  })
}

/**
 * Send NDA approval email to buyer
 */
export async function sendNDAApprovalEmail(
  buyerEmail: string,
  buyerName: string,
  listingTitle: string,
  ndaId: string,
  baseUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const ndaUrl = `${baseUrl}/dashboard/ndas`
  
  return sendEmail({
    to: buyerEmail,
    subject: `Din NDA-förfrågan har godkänts för ${listingTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #1F3C58; padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                      BOLAXO
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1F3C58; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                      NDA godkänd! 🎉
                    </h2>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hej ${buyerName},
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Vi har glada nyheter! Din NDA-förfrågan för <strong>${listingTitle}</strong> har godkänts av säljaren.
                    </p>
                    
                    <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
                      <p style="margin: 0; font-weight: 600; color: #065f46; font-size: 16px;">Du kan nu se all information om företaget och börja diskutera möjligheterna!</p>
                    </div>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 0 0 30px 0;">
                          <a href="${ndaUrl}" style="display: inline-block; background-color: #1F3C58; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px;">
                            Se objekt och kontakta säljare
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                      <strong>Nästa steg:</strong> Logga in på BOLAXO för att se all information om företaget och skicka meddelanden till säljaren.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 5px 0;">
                      <strong style="color: #1F3C58;">BOLAXO</strong> © 2025 | Sveriges moderna marknadsplats för företagsöverlåtelser
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    fromName: 'BOLAXO',
    from: 'noreply@bolaxo.com'
  })
}

/**
 * Send NDA rejection email to buyer
 */
export async function sendNDARejectionEmail(
  buyerEmail: string,
  buyerName: string,
  listingTitle: string,
  rejectionReason: string | null,
  baseUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const searchUrl = `${baseUrl}/sok`
  
  return sendEmail({
    to: buyerEmail,
    subject: `Din NDA-förfrågan för ${listingTitle} har avslagits`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #1F3C58; padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                      BOLAXO
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1F3C58; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                      NDA-förfrågan avslagen
                    </h2>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hej ${buyerName},
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Tyvärr har säljaren avslagit din NDA-förfrågan för <strong>${listingTitle}</strong>.
                    </p>
                    
                    ${rejectionReason ? `
                    <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                      <p style="margin: 0; color: #991b1b; font-size: 14px;"><strong>Anledning:</strong> ${rejectionReason}</p>
                    </div>
                    ` : ''}
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Det finns många andra spännande företag att utforska på BOLAXO. Fortsätt söka efter ditt nästa möjlighet!
                    </p>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 0 0 30px 0;">
                          <a href="${searchUrl}" style="display: inline-block; background-color: #1F3C58; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px;">
                            Sök efter fler företag
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 5px 0;">
                      <strong style="color: #1F3C58;">BOLAXO</strong> © 2025 | Sveriges moderna marknadsplats för företagsöverlåtelser
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    fromName: 'BOLAXO',
    from: 'noreply@bolaxo.com'
  })
}

/**
 * Send new NDA request email to seller
 */
export async function sendNewNDARequestEmail(
  sellerEmail: string,
  sellerName: string,
  buyerName: string,
  listingTitle: string,
  ndaId: string,
  baseUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const ndaUrl = `${baseUrl}/dashboard/ndas`
  
  return sendEmail({
    to: sellerEmail,
    subject: `Ny NDA-förfrågan från ${buyerName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #1F3C58; padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                      BOLAXO
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1F3C58; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                      Ny NDA-förfrågan
                    </h2>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hej ${sellerName},
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Du har fått en ny NDA-förfrågan från <strong>${buyerName}</strong> för ditt objekt:
                    </p>
                    
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1F3C58;">
                      <p style="margin: 0; font-weight: 600; color: #1F3C58; font-size: 18px;">${listingTitle}</p>
                    </div>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 0 0 30px 0;">
                          <a href="${ndaUrl}" style="display: inline-block; background-color: #1F3C58; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px;">
                            Se och hantera NDA-förfrågan
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                      Logga in på BOLAXO för att se köparens profil och godkänna eller avslå förfrågan.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 5px 0;">
                      <strong style="color: #1F3C58;">BOLAXO</strong> © 2025 | Sveriges moderna marknadsplats för företagsöverlåtelser
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    fromName: 'BOLAXO',
    from: 'noreply@bolaxo.com'
  })
}

/**
 * Send new message email to recipient
 */
export async function sendNewMessageEmail(
  recipientEmail: string,
  recipientName: string,
  senderName: string,
  listingTitle: string,
  messagePreview: string,
  listingId: string,
  baseUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const messageUrl = `${baseUrl}/dashboard/messages?listingId=${listingId}`
  
  return sendEmail({
    to: recipientEmail,
    subject: `Nytt meddelande från ${senderName} om ${listingTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #1F3C58; padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                      BOLAXO
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1F3C58; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                      Nytt meddelande
                    </h2>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hej ${recipientName},
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Du har fått ett nytt meddelande från <strong>${senderName}</strong> om objektet <strong>${listingTitle}</strong>:
                    </p>
                    
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1F3C58;">
                      <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6; font-style: italic;">
                        "${messagePreview.length > 200 ? messagePreview.substring(0, 200) + '...' : messagePreview}"
                      </p>
                    </div>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 0 0 30px 0;">
                          <a href="${messageUrl}" style="display: inline-block; background-color: #1F3C58; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px;">
                            Svara på meddelandet
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                      Logga in på BOLAXO för att läsa hela meddelandet och svara.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 5px 0;">
                      <strong style="color: #1F3C58;">BOLAXO</strong> © 2025 | Sveriges moderna marknadsplats för företagsöverlåtelser
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    fromName: 'BOLAXO',
    from: 'noreply@bolaxo.com'
  })
}

/**
 * Send match notification email to buyer and seller
 */
export async function sendMatchNotificationEmail(
  recipientEmail: string,
  recipientName: string,
  recipientRole: 'buyer' | 'seller',
  listingTitle: string,
  matchScore: number,
  listingId: string,
  baseUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const listingUrl = `${baseUrl}/objekt/${listingId}`
  const dashboardUrl = `${baseUrl}/dashboard/matches`
  
  const isBuyer = recipientRole === 'buyer'
  const subject = isBuyer 
    ? `Ny matchning hittad: ${listingTitle}`
    : `Ny matchning för ditt objekt: ${listingTitle}`
  
  const introText = isBuyer
    ? `Vi har hittat ett objekt som matchar dina preferenser perfekt!`
    : `Vi har hittat en köpare som matchar ditt objekt perfekt!`
  
  const actionText = isBuyer
    ? `Se objektet`
    : `Se matchningar`
  
  const actionUrl = isBuyer ? listingUrl : dashboardUrl
  
  return sendEmail({
    to: recipientEmail,
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #1F3C58; padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                      BOLAXO
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1F3C58; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                      Ny matchning! 🎯
                    </h2>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hej ${recipientName},
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      ${introText}
                    </p>
                    
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1F3C58;">
                      <p style="margin: 0 0 10px 0; font-weight: 600; color: #1F3C58; font-size: 18px;">${listingTitle}</p>
                      <p style="margin: 0; color: #6b7280; font-size: 14px;">Matchningspoäng: <strong style="color: #1F3C58;">${matchScore}%</strong></p>
                    </div>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 0 0 30px 0;">
                          <a href="${actionUrl}" style="display: inline-block; background-color: #1F3C58; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px;">
                            ${actionText}
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                      ${isBuyer ? 'Logga in på BOLAXO för att se objektet och skicka en NDA-förfrågan.' : 'Logga in på BOLAXO för att se alla matchningar och kontakta köpare.'}
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 5px 0;">
                      <strong style="color: #1F3C58;">BOLAXO</strong> © 2025 | Sveriges moderna marknadsplats för företagsöverlåtelser
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    fromName: 'BOLAXO',
    from: 'noreply@bolaxo.com'
  })
}

