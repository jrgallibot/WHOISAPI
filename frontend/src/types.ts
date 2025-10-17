/**
 * TypeScript interfaces and types for the Whois Lookup application
 * 
 * This file contains all the type definitions used throughout the application
 * to ensure type safety and better developer experience.
 */

/**
 * Type for information lookup types
 */
export type InfoType = 'domain' | 'contact'

/**
 * Domain information interface
 * Contains all domain-related data returned from the API
 */
export interface DomainInfo {
  /** The domain name */
  domainName: string
  /** Registrar name */
  registrar: string
  /** Registration date in ISO format */
  registrationDate: string
  /** Expiration date in ISO format */
  expirationDate: string
  /** Estimated domain age in days */
  estimatedDomainAge?: string | number | null
  /** Comma-separated list of name servers */
  hostnames: string
}

/**
 * Contact information interface
 * Contains all contact-related data returned from the API
 */
export interface ContactInfo {
  /** Registrant name */
  registrantName: string
  /** Technical contact name */
  technicalContactName: string
  /** Administrative contact name */
  administrativeContactName: string
  /** Contact email address */
  contactEmail: string
}

/**
 * API response interface
 * Generic response structure from the backend API
 */
export interface ApiResponse<T> {
  /** The domain that was looked up */
  domain: string
  /** Type of information requested */
  type: InfoType
  /** The actual data returned */
  data: T
}

/**
 * API error response interface
 * Structure for error responses from the API
 */
export interface ApiError {
  /** Error message */
  error: string
  /** Additional error details */
  details?: string
  /** HTTP status code */
  status?: number
}

/**
 * Application state interface
 * Main state structure for the React component
 */
export interface AppState {
  /** Current domain input value */
  domain: string
  /** Selected information type */
  type: InfoType
  /** Loading state */
  loading: boolean
  /** Error message if any */
  error: string | null
  /** Domain information data */
  domainData: DomainInfo | null
  /** Contact information data */
  contactData: ContactInfo | null
  /** Recent lookup history */
  recentLookups: string[]
}

/**
 * Local storage keys
 * Constants for localStorage keys used in the application
 */
export const STORAGE_KEYS = {
  RECENT_LOOKUPS: 'recentLookups'
} as const

/**
 * API endpoints
 * Constants for API endpoint URLs
 */
export const API_ENDPOINTS = {
  WHOIS: '/api/whois'
} as const

/**
 * Application constants
 * Various constants used throughout the application
 */
export const APP_CONSTANTS = {
  MAX_RECENT_LOOKUPS: 5,
  REQUEST_TIMEOUT: 20000,
  DEFAULT_DOMAIN: 'amazon.com'
} as const
