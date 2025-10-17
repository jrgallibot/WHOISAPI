import React, { useMemo, useState, useEffect } from 'react'
import { 
  InfoType, 
  DomainInfo, 
  ContactInfo, 
  APP_CONSTANTS 
} from './types'
import { 
  formatDate, 
  formatAge, 
  performWhoisLookup, 
  saveRecentLookup, 
  loadRecentLookups 
} from './utils'

export default function App() {
  // Application state
  const [domain, setDomain] = useState<string>(APP_CONSTANTS.DEFAULT_DOMAIN)
  const [type, setType] = useState<InfoType>('domain')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [domainData, setDomainData] = useState<DomainInfo | null>(null)
  const [contactData, setContactData] = useState<ContactInfo | null>(null)
  const [recentLookups, setRecentLookups] = useState<string[]>([])

  // Computed values
  const title = useMemo(() => 
    type === 'domain' ? 'Domain Information' : 'Contact Information', 
    [type]
  )

  // Load recent lookups from localStorage on component mount
  useEffect(() => {
    const saved = loadRecentLookups()
    setRecentLookups(saved)
  }, [])

  /**
   * Handle WHOIS lookup request
   * Performs API call and updates state with results
   */
  const handleLookup = async (): Promise<void> => {
    if (!domain.trim()) return
    
    setError(null)
    setLoading(true)
    setDomainData(null)
    setContactData(null)
    
    try {
      const response = await performWhoisLookup(domain.trim(), type)
      
      if (response.type === 'domain') {
        setDomainData(response.data as DomainInfo)
      } else {
        setContactData(response.data as ContactInfo)
      }
      
      // Save to recent lookups
      const updated = saveRecentLookup(domain.trim(), recentLookups)
      setRecentLookups(updated)
    } catch (e: any) {
      setError(e?.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        {/* Application Header */}
        <h1>🔍 Whois Lookup</h1>
        <p className="subtitle">Retrieve domain or contact information via Whois API</p>

        {/* Main Form */}
        <div className="form">
          {/* Domain Input Field */}
          <div className="field">
            <label htmlFor="domain">Domain Name</label>
            <input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. example.com"
              onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
              disabled={loading}
            />
            {/* Recent Lookups */}
            {recentLookups.length > 0 && (
              <div className="recent-lookups">
                <small>Recent: </small>
                {recentLookups.map((recent, index) => (
                  <button
                    key={index}
                    className="recent-btn"
                    onClick={() => setDomain(recent)}
                    disabled={loading}
                  >
                    {recent}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Information Type Selection */}
          <div className="field">
            <label>Information Type</label>
            <div className="radio-group">
              <label className={type === 'domain' ? 'active' : ''}>
                <input
                  type="radio"
                  name="type"
                  value="domain"
                  checked={type === 'domain'}
                  onChange={() => setType('domain')}
                  disabled={loading}
                />
                🌐 Domain Info
              </label>
              <label className={type === 'contact' ? 'active' : ''}>
                <input
                  type="radio"
                  name="type"
                  value="contact"
                  checked={type === 'contact'}
                  onChange={() => setType('contact')}
                  disabled={loading}
                />
                👤 Contact Info
              </label>
            </div>
          </div>

          {/* Lookup Button */}
          <button className="btn" onClick={handleLookup} disabled={loading || !domain.trim()}>
            {loading ? 'Looking up...' : '🔍 Lookup'}
          </button>
        </div>

        {/* Error Display */}
        {error && <div className="error">{error}</div>}

        {/* Domain Information Results */}
        {domainData && (
          <div className="table-wrapper">
            <h2>🌐 Domain Information</h2>
            <table>
              <tbody>
                <tr>
                  <th>Domain Name</th>
                  <td>{domainData.domainName || '-'}</td>
                </tr>
                <tr>
                  <th>Registrar</th>
                  <td>{domainData.registrar || '-'}</td>
                </tr>
                <tr>
                  <th>Registration Date</th>
                  <td>{formatDate(domainData.registrationDate)}</td>
                </tr>
                <tr>
                  <th>Expiration Date</th>
                  <td>{formatDate(domainData.expirationDate)}</td>
                </tr>
                <tr>
                  <th>Estimated Age</th>
                  <td>{formatAge(domainData.estimatedDomainAge)}</td>
                </tr>
                <tr>
                  <th>Name Servers</th>
                  <td title={domainData.hostnames}>{domainData.hostnames || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Contact Information Results */}
        {contactData && (
          <div className="table-wrapper">
            <h2>👤 Contact Information</h2>
            <table>
              <tbody>
                <tr>
                  <th>Registrant Name</th>
                  <td>{contactData.registrantName || '-'}</td>
                </tr>
                <tr>
                  <th>Technical Contact</th>
                  <td>{contactData.technicalContactName || '-'}</td>
                </tr>
                <tr>
                  <th>Administrative Contact</th>
                  <td>{contactData.administrativeContactName || '-'}</td>
                </tr>
                <tr>
                  <th>Contact Email</th>
                  <td>
                    {contactData.contactEmail ? (
                      <a href={`mailto:${contactData.contactEmail}`} className="email-link">
                        {contactData.contactEmail}
                      </a>
                    ) : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Help Text */}
        {!domainData && !contactData && !error && (
          <p className="hint">
            💡 Enter a domain name and click "Lookup" to see {title.toLowerCase()}.
            <br />
            Try domains like <strong>google.com</strong>, <strong>github.com</strong>, or <strong>stackoverflow.com</strong>
          </p>
        )}
      </div>
      
      {/* Footer */}
      <footer>
        <span>🚀 Powered by WhoisXML API</span>
      </footer>
    </div>
  )
}
