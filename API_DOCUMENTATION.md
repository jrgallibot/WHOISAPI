# 🔍 Whois Lookup API Documentation

## Overview

The Whois Lookup API is a RESTful service that provides domain and contact information lookup using the WhoisXML API. It features a Flask backend with optional MySQL logging and a React frontend with TypeScript.

## Base URL

```
http://localhost:5000
```

## Authentication

No authentication required for basic usage. The API uses a WhoisXML API key configured on the server side.

## Endpoints

### POST /api/whois

Performs a WHOIS lookup for domain or contact information.

#### Request

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "domain": "example.com",
  "type": "domain"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain` | string | Yes | The domain name to lookup (e.g., "google.com") |
| `type` | string | Yes | Information type: "domain" or "contact" |

#### Response

**Success Response (200 OK):**

**Domain Information:**
```json
{
  "domain": "google.com",
  "type": "domain",
  "data": {
    "domainName": "google.com",
    "registrar": "MarkMonitor Inc.",
    "registrationDate": "1997-09-15T00:00:00Z",
    "expirationDate": "2028-09-14T00:00:00Z",
    "estimatedDomainAge": 11308,
    "hostnames": "ns1.google.com, ns2.google.com, ns3.google.com, ns4.google.com"
  }
}
```

**Contact Information:**
```json
{
  "domain": "google.com",
  "type": "contact",
  "data": {
    "registrantName": "Google LLC",
    "technicalContactName": "Google LLC",
    "administrativeContactName": "Google LLC",
    "contactEmail": "dns-admin@google.com"
  }
}
```

#### Error Responses

**400 Bad Request:**
```json
{
  "error": "Missing 'domain'"
}
```

```json
{
  "error": "Invalid 'type'. Use 'domain' or 'contact'"
}
```

**404 Not Found:**
```json
{
  "error": "Whois record not found for domain"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Server not configured with WHOIS_API_KEY"
}
```

**502 Bad Gateway:**
```json
{
  "error": "Upstream whois service error",
  "status": 500,
  "details": "API rate limit exceeded"
}
```

**504 Gateway Timeout:**
```json
{
  "error": "Upstream whois request timed out"
}
```

### GET /

Serves the React frontend application.

### GET /<path>

Serves static files or falls back to the main application for SPA routing.

## Data Models

### Domain Information

| Field | Type | Description |
|-------|------|-------------|
| `domainName` | string | The domain name |
| `registrar` | string | Registrar name |
| `registrationDate` | string | Registration date in ISO format |
| `expirationDate` | string | Expiration date in ISO format |
| `estimatedDomainAge` | number | Estimated age in days |
| `hostnames` | string | Comma-separated list of name servers |

### Contact Information

| Field | Type | Description |
|-------|------|-------------|
| `registrantName` | string | Registrant name |
| `technicalContactName` | string | Technical contact name |
| `administrativeContactName` | string | Administrative contact name |
| `contactEmail` | string | Contact email address |

## Rate Limits

The API is subject to the WhoisXML API rate limits. Check your WhoisXML account for specific limits.

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (domain not found)
- `500` - Internal Server Error (server configuration issues)
- `502` - Bad Gateway (upstream API errors)
- `504` - Gateway Timeout (request timeout)

## Examples

### cURL Examples

**Domain Information Lookup:**
```bash
curl -X POST http://localhost:5000/api/whois \
  -H "Content-Type: application/json" \
  -d '{"domain": "google.com", "type": "domain"}'
```

**Contact Information Lookup:**
```bash
curl -X POST http://localhost:5000/api/whois \
  -H "Content-Type: application/json" \
  -d '{"domain": "github.com", "type": "contact"}'
```

### JavaScript Examples

**Using Fetch API:**
```javascript
const response = await fetch('/api/whois', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    domain: 'example.com',
    type: 'domain'
  })
});

const data = await response.json();
console.log(data);
```

**Using Axios:**
```javascript
import axios from 'axios';

const response = await axios.post('/api/whois', {
  domain: 'example.com',
  type: 'domain'
});

console.log(response.data);
```

## Database Logging

If MySQL is configured, the API logs all lookups to the `whois_lookups` table:

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `domain` | VARCHAR(255) | Domain name looked up |
| `info_type` | ENUM | 'domain' or 'contact' |
| `http_status` | INT | HTTP response status |
| `success` | TINYINT(1) | Whether lookup was successful |
| `registrar` | VARCHAR(255) | Registrar name (if available) |
| `created_at` | TIMESTAMP | When lookup was performed |

## Configuration

The API can be configured using environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WHOIS_API_KEY` | Yes | - | WhoisXML API key |
| `PORT` | No | 5000 | Server port |
| `MYSQL_HOST` | No | localhost | MySQL host |
| `MYSQL_PORT` | No | 3306 | MySQL port |
| `MYSQL_USER` | No | root | MySQL username |
| `MYSQL_PASSWORD` | No | - | MySQL password |
| `MYSQL_DB` | No | whois_logs | MySQL database name |
| `LOG_LEVEL` | No | INFO | Logging level |

## Frontend API Integration

The React frontend uses the following utilities for API integration:

### Types

```typescript
type InfoType = 'domain' | 'contact'

interface DomainInfo {
  domainName: string
  registrar: string
  registrationDate: string
  expirationDate: string
  estimatedDomainAge?: string | number | null
  hostnames: string
}

interface ContactInfo {
  registrantName: string
  technicalContactName: string
  administrativeContactName: string
  contactEmail: string
}
```

### API Function

```typescript
const performWhoisLookup = async (
  domain: string, 
  type: InfoType
): Promise<ApiResponse<DomainInfo | ContactInfo>> => {
  const response = await fetch('/api/whois', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: domain.trim(), type })
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Lookup failed')
  }
  
  return data
}
```

## Troubleshooting

### Common Issues

1. **"Server not configured with WHOIS_API_KEY"**
   - Ensure the `WHOIS_API_KEY` environment variable is set
   - Verify the API key is valid and active

2. **"Upstream whois service error"**
   - Check your WhoisXML API quota
   - Verify the domain name is valid

3. **"Whois record not found for domain"**
   - The domain may not exist or be private
   - Try a different domain

4. **Database logging not working**
   - Ensure MySQL is running and accessible
   - Check database credentials in environment variables

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the server logs for detailed error messages
3. Verify your WhoisXML API key and quota
4. Ensure all environment variables are properly configured
