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
          email: options.from || 'noreply@bolaxo.com', // Domänen är nu verifierad hos Brevo ✅
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
    fromName: 'BOLAXO',
    from: 'noreply@bolaxo.com'
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

