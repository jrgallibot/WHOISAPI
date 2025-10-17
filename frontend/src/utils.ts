/**
 * Utility functions for the Whois Lookup application
 * 
 * This file contains helper functions used throughout the application
 * for data formatting, API calls, and local storage management.
 */

import { ApiResponse, ApiError, DomainInfo, ContactInfo, InfoType, STORAGE_KEYS, API_ENDPOINTS } from './types'

/**
 * Format date string to a human-readable format
 * 
 * @param dateStr - Date string in ISO format
 * @returns Formatted date string or '-' if invalid
 */
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-'
  
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateStr
  }
}

/**
 * Format domain age from days to years
 * 
 * @param age - Age in days (string or number)
 * @returns Formatted age string or '-' if invalid
 */
export const formatAge = (age: string | number | null | undefined): string => {
  if (!age) return '-'
  
  const years = Math.floor(Number(age) / 365)
  return `${years} years`
}

/**
 * Validate domain name format
 * 
 * @param domain - Domain name to validate
 * @returns True if domain format is valid
 */
export const isValidDomain = (domain: string): boolean => {
  if (!domain || typeof domain !== 'string') return false
  
  // Basic domain validation regex
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return domainRegex.test(domain.trim())
}

/**
 * Perform WHOIS lookup API call
 * 
 * @param domain - Domain name to lookup
 * @param type - Type of information to retrieve
 * @returns Promise resolving to API response or error
 */
export const performWhoisLookup = async (
  domain: string, 
  type: InfoType
): Promise<ApiResponse<DomainInfo | ContactInfo>> => {
  const response = await fetch(API_ENDPOINTS.WHOIS, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ 
      domain: domain.trim(), 
      type 
    })
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    const error: ApiError = data
    throw new Error(error.error || 'Lookup failed')
  }
  
  return data as ApiResponse<DomainInfo | ContactInfo>
}

/**
 * Save recent lookup to localStorage
 * 
 * @param domain - Domain name to save
 * @param recentLookups - Current recent lookups array
 * @returns Updated recent lookups array
 */
export const saveRecentLookup = (domain: string, recentLookups: string[]): string[] => {
  const updated = [domain, ...recentLookups.filter(d => d !== domain)].slice(0, 5)
  localStorage.setItem(STORAGE_KEYS.RECENT_LOOKUPS, JSON.stringify(updated))
  return updated
}

/**
 * Load recent lookups from localStorage
 * 
 * @returns Array of recent domain lookups
 */
export const loadRecentLookups = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.RECENT_LOOKUPS)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

/**
 * Clear recent lookups from localStorage
 */
export const clearRecentLookups = (): void => {
  localStorage.removeItem(STORAGE_KEYS.RECENT_LOOKUPS)
}

/**
 * Debounce function to limit API calls
 * 
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T, 
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Generate a unique ID for components
 * 
 * @returns Unique identifier string
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Copy text to clipboard
 * 
 * @param text - Text to copy
 * @returns Promise resolving to success status
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    return success
  }
}
