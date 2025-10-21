'use client'

import { useState, useEffect } from 'react'
import { Users, UserPlus, Mail, CheckCircle, Clock, Shield } from 'lucide-react'
import FormField from './FormField'

interface TeamMember {
  id: string
  email: string
  name: string
  role: string
  status: string
  invitedAt: string
  acceptedAt: string | null
  permissions: any
}

interface TeamCollaborationProps {
  transactionId: string
}

const ROLE_LABELS: Record<string, string> = {
  advisor: 'M&A-rådgivare',
  accountant: 'Revisor',
  lawyer: 'Jurist',
  other: 'Övrigt'
}

const ROLE_ICONS: Record<string, string> = {
  advisor: '💼',
  accountant: '📊',
  lawyer: '⚖️',
  other: '👤'
}

export default function TeamCollaboration({ transactionId }: TeamCollaborationProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteForm, setShowInviteForm] = useState(false)
  
  const [inviteData, setInviteData] = useState({
    email: '',
    name: '',
    role: 'advisor'
  })
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    fetchTeam()
  }, [transactionId])

  const fetchTeam = async () => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}/team`)
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data.teamMembers || [])
      }
    } catch (error) {
      console.error('Failed to fetch team:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsInviting(true)

    try {
      const response = await fetch(`/api/transactions/${transactionId}/team/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteData)
      })

      if (response.ok) {
        fetchTeam()
        setInviteData({ email: '', name: '', role: 'advisor' })
        setShowInviteForm(false)
      } else {
        alert('Kunde inte bjuda in teammedlem')
      }
    } catch (error) {
      console.error('Invite error:', error)
      alert('Ett fel uppstod')
    } finally {
      setIsInviting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center">
          <Users className="w-6 h-6 mr-2 text-primary-blue" />
          Team ({teamMembers.length})
        </h3>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="btn-secondary flex items-center text-sm"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Bjud in
        </button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <form onSubmit={handleInvite} className="bg-light-blue p-6 rounded-xl border-2 border-primary-blue">
          <h4 className="font-semibold mb-4">Bjud in teammedlem</h4>
          
          <div className="space-y-4">
            <FormField
              label="Namn"
              value={inviteData.name}
              onValueChange={(value) => setInviteData({ ...inviteData, name: value })}
              placeholder="För- och efternamn"
              required
            />

            <FormField
              label="E-post"
              type="email"
              value={inviteData.email}
              onValueChange={(value) => setInviteData({ ...inviteData, email: value })}
              placeholder="namn@firma.se"
              required
            />

            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Roll</label>
              <select
                value={inviteData.role}
                onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-blue focus:outline-none"
              >
                <option value="advisor">M&A-rådgivare</option>
                <option value="accountant">Revisor</option>
                <option value="lawyer">Jurist</option>
                <option value="other">Övrigt</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="btn-ghost flex-1"
              >
                Avbryt
              </button>
              <button
                type="submit"
                disabled={isInviting || !inviteData.email || !inviteData.name}
                className="btn-primary flex-1"
              >
                {isInviting ? 'Bjuder in...' : 'Skicka inbjudan'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Team Members List */}
      {teamMembers.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-text-gray text-sm">Inga teammedlemmar än</p>
          <p className="text-text-gray text-xs mt-1">Bjud in rådgivare, revisorer eller jurister för att hjälpa till</p>
        </div>
      ) : (
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-light-blue rounded-full flex items-center justify-center text-2xl mr-4">
                  {ROLE_ICONS[member.role] || '👤'}
                </div>
                <div>
                  <h4 className="font-semibold text-text-dark">{member.name}</h4>
                  <p className="text-sm text-text-gray">{ROLE_LABELS[member.role] || member.role}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-text-gray flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {member.email}
                    </span>
                    {member.status === 'ACCEPTED' && member.acceptedAt && (
                      <span className="text-xs text-green-600 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Aktiv sedan {new Date(member.acceptedAt).toLocaleDateString('sv-SE')}
                      </span>
                    )}
                    {member.status === 'PENDING' && (
                      <span className="text-xs text-yellow-600 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Väntar på svar
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Permissions Badge */}
              <button className="text-xs text-text-gray hover:text-primary-blue flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Behörigheter
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Tips:</strong> Bjud in professionell rådgivare för att snabba på processen. 
          M&A-rådgivare får full access, revisorer ser bara finansiellt, jurister ser bara avtal.
        </p>
      </div>
    </div>
  )
}

