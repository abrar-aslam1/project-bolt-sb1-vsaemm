'use client';

interface StateIconProps {
  state: string;
  className?: string;
}

// Simplified, recognizable state shapes
const stateIcons: Record<string, { path: string; viewBox: string }> = {
  'California': {
    viewBox: '0 0 32 48',
    path: 'M8 44L6 34L3 30L2 25L4 22L3 20L4 17L3 15V13L6 10L7 7L9 5L10 3L12 2L14 3L17 2L19 0L21 1L23 2L25 1L27 2L29 4L30 6L32 7V10L31 12V15L29 17L30 19L28 21L29 23L28 25L29 27L27 29V32L25 34L24 37L21 39L20 41L18 42L16 44L14 45L12 43L10 44L8 44Z'
  },
  'Texas': {
    viewBox: '0 0 48 48',
    path: 'M4 24L8 40L12 42L16 40L20 42L24 40L28 42L32 40L36 42L40 40L44 42V24L40 22L36 24L32 22L28 24L24 22L20 24L16 22L12 24L8 22L4 24ZM4 24L8 8L12 6L16 8L20 6L24 8L28 6L32 8L36 6L40 8L44 6V24'
  },
  'Florida': {
    viewBox: '0 0 48 32',
    path: 'M4 4L8 20L12 22L16 20L20 22L24 20L28 22L32 20L36 22L40 20L44 22V4L40 2L36 4L32 2L28 4L24 2L20 4L16 2L12 4L8 2L4 4Z'
  },
  'New York': {
    viewBox: '0 0 48 32',
    path: 'M4 8L12 24L16 26L20 24L24 26L28 24L32 26L36 24L40 26L44 24V8L40 6L36 8L32 6L28 8L24 6L20 8L16 6L12 8L8 6L4 8Z'
  },
  'Illinois': {
    viewBox: '0 0 32 48',
    path: 'M8 44L6 34L4 30L3 25L4 22L3 20L4 17L3 15V13L6 10L7 7L9 5L10 3L12 2L14 3L17 2L19 0L21 1L23 2L25 1L27 2L29 4V44H8Z'
  },
  'Pennsylvania': {
    viewBox: '0 0 48 32',
    path: 'M4 8L8 24L12 26L16 24L20 26L24 24L28 26L32 24L36 26L40 24L44 26V8L40 6L36 8L32 6L28 8L24 6L20 8L16 6L12 8L8 6L4 8Z'
  },
  'Arizona': {
    viewBox: '0 0 32 48',
    path: 'M4 4L28 4L28 44L4 44L4 4Z'
  },
  'Georgia': {
    viewBox: '0 0 48 48',
    path: 'M24 44C35 44 44 35 44 24C44 13 35 4 24 4C13 4 4 13 4 24C4 35 13 44 24 44Z'
  },
  'Washington': {
    viewBox: '0 0 48 32',
    path: 'M4 8L44 8L44 24L4 24L4 8Z'
  },
  'Massachusetts': {
    viewBox: '0 0 48 24',
    path: 'M4 4L44 4L44 20L4 20L4 4Z'
  },
  'Nevada': {
    viewBox: '0 0 32 48',
    path: 'M4 4L28 4L28 44L4 44L4 4Z'
  },
  'Oregon': {
    viewBox: '0 0 48 32',
    path: 'M4 4L44 4L44 28L4 28L4 4Z'
  },
  'Tennessee': {
    viewBox: '0 0 48 16',
    path: 'M4 4L44 4L44 12L4 12L4 4Z'
  },
  'Louisiana': {
    viewBox: '0 0 48 32',
    path: 'M8 28C19 28 28 19 28 8C28 19 37 28 48 28C37 28 28 37 28 48C28 37 19 28 8 28Z'
  },
  'Colorado': {
    viewBox: '0 0 48 32',
    path: 'M4 4L44 4L44 28L4 28L4 4Z'
  }
};

export function StateIcon({ state, className = "w-6 h-6" }: StateIconProps) {
  const stateData = stateIcons[state];
  
  if (!stateData) return null;
  
  return (
    <svg 
      viewBox={stateData.viewBox}
      className={`${className} fill-current`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={stateData.path} />
    </svg>
  );
}
