import React from 'react'

type IconType = 
  | 'user'          // Independent Realtors
  | 'building'      // Brokerages
  | 'construction'  // Developers
  | 'palette'       // Architects
  | 'house'         // STR Managers
  | 'houses'        // Property Owners
  | 'key'           // STR Owners
  | 'shopping'      // Shoppers

interface UserTypeIconProps {
  type: IconType
  className?: string
}

export default function UserTypeIcon({ type, className = 'w-8 h-8' }: UserTypeIconProps) {
  const icons = {
    user: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    building: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 7H10M14 7H16M8 11H10M14 11H16M8 15H10M14 15H16M4 21H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    construction: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21L9 15M9 15L5 11L7 9L11 13M9 15L13 11M21 3L15 9M15 9L19 13L17 15L13 11M15 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 7L7 3M17 21L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    palette: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C13.105 22 14 21.105 14 20C14 19.47 13.79 18.995 13.465 18.64C13.145 18.29 13 17.845 13 17.5C13 16.672 13.672 16 14.5 16H16.5C19.538 16 22 13.538 22 10.5C22 5.806 17.523 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
        <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/>
        <circle cx="11" cy="7" r="1.5" fill="currentColor"/>
        <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
      </svg>
    ),
    house: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9.5L12 3L21 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 10V20C5 20.552 5.448 21 6 21H9M19 10V20C19 20.552 18.552 21 18 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <rect x="9" y="15" width="6" height="6" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    houses: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 10L7 6L12 10V19H2V10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M9 6L14 2L22 8V19H14V10L9 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <rect x="4" y="13" width="2" height="3" fill="currentColor"/>
        <rect x="8" y="13" width="2" height="3" fill="currentColor"/>
        <rect x="16" y="11" width="2" height="3" fill="currentColor"/>
        <rect x="19" y="11" width="2" height="3" fill="currentColor"/>
      </svg>
    ),
    key: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8.5" cy="15.5" r="4.5" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 12L21 3M21 3V7M21 3H17M15 9L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor"/>
      </svg>
    ),
    shopping: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 6L8 2H16L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 6H21L20 20C20 21.105 19.105 22 18 22H6C4.895 22 4 21.105 4 20L3 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M8 10C8 12.209 9.791 14 12 14C14.209 14 16 12.209 16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }

  return icons[type]
}
