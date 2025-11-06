import React from 'react';

interface IllustrationProps {
  className?: string;
  strokeColor?: string;
}

// Globe with airplane illustration for Trip Information
export const TripIllustration: React.FC<IllustrationProps> = ({ className = '', strokeColor = 'currentColor' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Globe */}
    <circle cx="100" cy="100" r="60" stroke={strokeColor} strokeWidth="2" />
    
    {/* Latitude lines */}
    <ellipse cx="100" cy="100" rx="60" ry="20" stroke={strokeColor} strokeWidth="1.5" opacity="0.5" />
    <ellipse cx="100" cy="100" rx="60" ry="40" stroke={strokeColor} strokeWidth="1.5" opacity="0.5" />
    
    {/* Longitude line */}
    <ellipse cx="100" cy="100" rx="20" ry="60" stroke={strokeColor} strokeWidth="1.5" opacity="0.5" />
    
    {/* Airplane */}
    <g transform="translate(130, 60) rotate(45)">
      {/* Airplane body */}
      <path d="M0 0 L0 25" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
      {/* Wings */}
      <path d="M-12 8 L12 8" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
      {/* Tail wings */}
      <path d="M-5 20 L5 20" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
    </g>
    
    {/* Flight path */}
    <path 
      d="M 50 120 Q 80 80, 120 70" 
      stroke={strokeColor} 
      strokeWidth="1.5" 
      strokeDasharray="4 4" 
      fill="none"
      opacity="0.6"
    />
  </svg>
);

// Passport with travelers illustration for Traveller Information
export const TravellerIllustration: React.FC<IllustrationProps> = ({ className = '', strokeColor = 'currentColor' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Passport */}
    <rect x="60" y="50" width="80" height="100" rx="4" stroke={strokeColor} strokeWidth="2" />
    
    {/* Passport lines */}
    <line x1="70" y1="70" x2="130" y2="70" stroke={strokeColor} strokeWidth="1.5" opacity="0.5" />
    <line x1="70" y1="80" x2="130" y2="80" stroke={strokeColor} strokeWidth="1.5" opacity="0.5" />
    
    {/* Person icon on passport */}
    <circle cx="100" cy="105" r="12" stroke={strokeColor} strokeWidth="2" />
    <path d="M 85 135 Q 85 120, 100 120 Q 115 120, 115 135" stroke={strokeColor} strokeWidth="2" fill="none" />
    
    {/* Document corner fold */}
    <path d="M 135 50 L 135 60 L 125 60 Z" stroke={strokeColor} strokeWidth="1.5" opacity="0.5" />
    
    {/* Multiple travelers indicator (overlapping circles) */}
    <circle cx="40" cy="100" r="15" stroke={strokeColor} strokeWidth="2" opacity="0.4" />
    <circle cx="30" cy="90" r="15" stroke={strokeColor} strokeWidth="2" opacity="0.4" />
    <circle cx="160" cy="100" r="15" stroke={strokeColor} strokeWidth="2" opacity="0.4" />
    <circle cx="170" cy="90" r="15" stroke={strokeColor} strokeWidth="2" opacity="0.4" />
  </svg>
);

// Shield with checkmark illustration for Coverage Plan
export const CoverageIllustration: React.FC<IllustrationProps> = ({ className = '', strokeColor = 'currentColor' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Shield */}
    <path 
      d="M 100 40 L 140 55 L 140 100 Q 140 140, 100 160 Q 60 140, 60 100 L 60 55 Z" 
      stroke={strokeColor} 
      strokeWidth="2.5"
    />
    
    {/* Checkmark */}
    <path 
      d="M 80 100 L 95 115 L 120 80" 
      stroke={strokeColor} 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* Decorative elements around shield */}
    <circle cx="50" cy="70" r="4" stroke={strokeColor} strokeWidth="1.5" opacity="0.4" />
    <circle cx="150" cy="70" r="4" stroke={strokeColor} strokeWidth="1.5" opacity="0.4" />
    <circle cx="60" cy="140" r="3" stroke={strokeColor} strokeWidth="1.5" opacity="0.4" />
    <circle cx="140" cy="140" r="3" stroke={strokeColor} strokeWidth="1.5" opacity="0.4" />
    
    {/* Plus signs for medical coverage */}
    <g opacity="0.3">
      <path d="M 40 100 L 40 110 M 35 105 L 45 105" stroke={strokeColor} strokeWidth="1.5" />
      <path d="M 160 110 L 160 120 M 155 115 L 165 115" stroke={strokeColor} strokeWidth="1.5" />
    </g>
  </svg>
);

// Family/people illustration for Nominee Details
export const NomineeIllustration: React.FC<IllustrationProps> = ({ className = '', strokeColor = 'currentColor' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Adult 1 (left) */}
    <g>
      <circle cx="70" cy="80" r="15" stroke={strokeColor} strokeWidth="2" />
      <path d="M 50 140 Q 50 115, 70 115 Q 90 115, 90 140" stroke={strokeColor} strokeWidth="2" fill="none" />
    </g>
    
    {/* Adult 2 (right) */}
    <g>
      <circle cx="130" cy="80" r="15" stroke={strokeColor} strokeWidth="2" />
      <path d="M 110 140 Q 110 115, 130 115 Q 150 115, 150 140" stroke={strokeColor} strokeWidth="2" fill="none" />
    </g>
    
    {/* Child (middle front) */}
    <g>
      <circle cx="100" cy="95" r="12" stroke={strokeColor} strokeWidth="2" />
      <path d="M 85 140 Q 85 120, 100 120 Q 115 120, 115 140" stroke={strokeColor} strokeWidth="2" fill="none" />
    </g>
    
    {/* Heart symbol */}
    <path 
      d="M 100 55 L 105 50 Q 110 45, 115 50 Q 120 55, 115 60 L 100 70 L 85 60 Q 80 55, 85 50 Q 90 45, 95 50 Z" 
      stroke={strokeColor} 
      strokeWidth="2"
      opacity="0.6"
    />
    
    {/* Connection lines between people */}
    <line x1="70" y1="95" x2="85" y2="107" stroke={strokeColor} strokeWidth="1.5" opacity="0.3" />
    <line x1="130" y1="95" x2="115" y2="107" stroke={strokeColor} strokeWidth="1.5" opacity="0.3" />
  </svg>
);

// Success/completion illustration
export const SuccessIllustration: React.FC<IllustrationProps> = ({ className = '', strokeColor = 'currentColor' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Checkmark circle */}
    <circle cx="100" cy="100" r="50" stroke={strokeColor} strokeWidth="3" />
    
    {/* Checkmark */}
    <path 
      d="M 75 100 L 92 117 L 125 75" 
      stroke={strokeColor} 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* Celebration sparkles */}
    <g opacity="0.6">
      {/* Top left sparkle */}
      <path d="M 50 50 L 50 60 M 45 55 L 55 55" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      {/* Top right sparkle */}
      <path d="M 150 50 L 150 60 M 145 55 L 155 55" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      {/* Bottom left sparkle */}
      <path d="M 60 150 L 60 158 M 56 154 L 64 154" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      {/* Bottom right sparkle */}
      <path d="M 140 150 L 140 158 M 136 154 L 144 154" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    </g>
    
    {/* Small stars */}
    <circle cx="40" cy="80" r="3" stroke={strokeColor} strokeWidth="1.5" />
    <circle cx="160" cy="80" r="3" stroke={strokeColor} strokeWidth="1.5" />
    <circle cx="70" cy="140" r="2.5" stroke={strokeColor} strokeWidth="1.5" />
    <circle cx="130" cy="140" r="2.5" stroke={strokeColor} strokeWidth="1.5" />
  </svg>
);
