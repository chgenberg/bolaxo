/**
 * Scrive E-signature Integration
 * 
 * Setup:
 * 1. Skapa konto på https://scrive.com
 * 2. Få API credentials från Settings → API
 * 3. Lägg till i Railway:
 *    SCRIVE_API_TOKEN=your_token_here
 *    SCRIVE_CLIENT_ID=your_client_id_here
 * 
 * Kostnad: ~8-15 SEK per signatur (pay-as-you-go)
 */

interface ScriveParty {
  email: string
  name: string
  role: 'seller' | 'buyer' | 'witness'
  authenticationMethod: 'se_bankid' | 'email' | 'sms'
}

interface ScriveDocument {
  title: string
  parties: ScriveParty[]
  fileContent: string // Base64-encoded PDF
  fileName: string
}

export class ScriveClient {
  private apiToken: string
  private baseUrl = 'https://api.scrive.com/v2'

  constructor(apiToken?: string) {
    this.apiToken = apiToken || process.env.SCRIVE_API_TOKEN || ''
  }

  isConfigured(): boolean {
    return !!this.apiToken
  }

  /**
   * Skicka dokument för signering
   */
  async createDocument(doc: ScriveDocument): Promise<{ id: string; signingUrl: string } | null> {
    if (!this.isConfigured()) {
      console.log('⚠️ Scrive not configured. Set SCRIVE_API_TOKEN in environment.')
      return null
    }

    try {
      const response = await fetch(`${this.baseUrl}/documents/new`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: doc.title,
          parties: doc.parties.map((party, index) => ({
            email: party.email,
            name: party.name,
            role: party.role,
            sign_order: index + 1,
            authentication_method_to_view: party.authenticationMethod,
            authentication_method_to_sign: party.authenticationMethod,
          })),
          file: {
            name: doc.fileName,
            content: doc.fileContent, // Base64
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Scrive API error: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        id: data.id,
        signingUrl: data.parties[0]?.url || data.url
      }
    } catch (error) {
      console.error('Scrive createDocument error:', error)
      return null
    }
  }

  /**
   * Hämta dokument-status
   */
  async getDocumentStatus(documentId: string): Promise<'pending' | 'signed' | 'declined' | 'error'> {
    if (!this.isConfigured()) {
      return 'error'
    }

    try {
      const response = await fetch(`${this.baseUrl}/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      })

      if (!response.ok) {
        return 'error'
      }

      const data = await response.json()
      
      if (data.status === 'closed' && data.all_parties_signed) {
        return 'signed'
      } else if (data.status === 'rejected') {
        return 'declined'
      }
      
      return 'pending'
    } catch (error) {
      console.error('Scrive getDocumentStatus error:', error)
      return 'error'
    }
  }

  /**
   * Ladda ner signerat dokument
   */
  async downloadSignedDocument(documentId: string): Promise<Buffer | null> {
    if (!this.isConfigured()) {
      return null
    }

    try {
      const response = await fetch(`${this.baseUrl}/documents/${documentId}/files/main`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      })

      if (!response.ok) {
        return null
      }

      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    } catch (error) {
      console.error('Scrive download error:', error)
      return null
    }
  }
}

// Mock mode för demo (när Scrive ej konfigurerat)
export class MockScriveClient extends ScriveClient {
  async createDocument(doc: ScriveDocument): Promise<{ id: string; signingUrl: string }> {
    // Simulera Scrive-svar
    const mockId = `scrive_mock_${Date.now()}`
    const mockUrl = `https://scrive.com/s/${mockId}` // Mock URL
    
    console.log(`📝 Mock Scrive: Document "${doc.title}" created`)
    console.log(`   Parties: ${doc.parties.map(p => p.name).join(', ')}`)
    console.log(`   Signing URL: ${mockUrl}`)
    
    return {
      id: mockId,
      signingUrl: mockUrl
    }
  }

  async getDocumentStatus(documentId: string): Promise<'pending' | 'signed' | 'declined' | 'error'> {
    // I demo: simulera att dokument signeras efter 10 sekunder
    return 'pending'
  }

  async downloadSignedDocument(documentId: string): Promise<Buffer | null> {
    return Buffer.from('Mock signed PDF content')
  }
}

// Factory function
export function getScriveClient(): ScriveClient | MockScriveClient {
  if (process.env.SCRIVE_API_TOKEN) {
    return new ScriveClient()
  } else {
    return new MockScriveClient()
  }
}

