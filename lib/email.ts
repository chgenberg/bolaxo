export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
  fromName?: string
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
          name: options.fromName || 'BOLAXO',
          email: options.from || 'noreply@sendinblue.com', // Temporärt tills bolaxo.com är verifierad
        },
        to: recipients.map(email => ({ email })),
        subject: options.subject,
        htmlContent: options.html,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Sendinblue API error:', errorText)
      return { 
        success: false, 
        error: `Sendinblue API error: ${response.status} ${errorText}` 
      }
    }

    const data = await response.json()
    return { 
      success: true, 
      messageId: data.messageId 
    }
  } catch (error) {
    console.error('Email send error:', error)
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Välkommen till BOLAXO</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hej ${name},</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Klicka på knappen nedan för att logga in på ditt konto:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" style="display: inline-block; background: #1e40af; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Logga in på BOLAXO
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            <strong>Länken är giltig i 1 timme.</strong> Om du inte begärt denna länk, ignorera detta mail.
          </p>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 20px;">
            Om knappen inte fungerar, kopiera och klistra in denna länk i din webbläsare:
          </p>
          <p style="color: #1e40af; font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">
            ${magicLink}
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            BOLAXO © 2025 | Sveriges smartaste företagsförmedling
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
            Verifierade uppgifter • NDA innan detaljer • Kvalificerade köpare
          </p>
        </div>
      </div>
    `,
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Ny LOI mottagen</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hej ${sellerName},</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Du har fått ett nytt indikativt bud (LOI) från <strong>${buyerName}</strong> för ditt objekt:
          </p>
          
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1e40af;">
            <p style="margin: 0; font-weight: 600; color: #1e40af;">${listingTitle}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loiUrl}" style="display: inline-block; background: #1e40af; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Se LOI och hantera
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            Logga in på BOLAXO för att se detaljer och godkänna eller avslå budet.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            BOLAXO © 2025 | Sveriges smartaste företagsförmedling
          </p>
        </div>
      </div>
    `,
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">LOI godkänd! 🎉</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hej ${buyerName},</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Vi har glada nyheter! Din LOI för <strong>${listingTitle}</strong> har godkänts av säljaren.
          </p>
          
          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0; font-weight: 600; color: #065f46;">Transaktionen är nu skapad och redo att börja!</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${transactionUrl}" style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Gå till transaktion
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            <strong>Nästa steg:</strong> Logga in på BOLAXO för att se transaktionsdashboarden och börja med Due Diligence.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            BOLAXO © 2025 | Sveriges smartaste företagsförmedling
          </p>
        </div>
      </div>
    `,
  })
}

