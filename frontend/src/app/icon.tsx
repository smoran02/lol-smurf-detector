import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1a2e',
          borderRadius: '20%',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Smurf face (blue) */}
          <ellipse cx="16" cy="19" rx="8" ry="7" fill="#5B9BD5" />

          {/* White hat */}
          <path
            d="M8 15 Q8 8 16 6 Q16 2 20 4 Q24 6 24 10 Q24 14 20 15 L12 15 Q8 15 8 15"
            fill="#FFFFFF"
          />
          <ellipse cx="16" cy="15" rx="8" ry="2" fill="#FFFFFF" />

          {/* Eyes */}
          <ellipse cx="13" cy="18" rx="1.5" ry="2" fill="#FFFFFF" />
          <ellipse cx="19" cy="18" rx="1.5" ry="2" fill="#FFFFFF" />
          <circle cx="13.5" cy="18.5" r="0.8" fill="#1a1a2e" />
          <circle cx="19.5" cy="18.5" r="0.8" fill="#1a1a2e" />

          {/* Cute smile */}
          <path
            d="M13 22 Q16 24 19 22"
            stroke="#1a1a2e"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />

          {/* Rosy cheeks */}
          <circle cx="10.5" cy="20" r="1.2" fill="#FF9999" opacity="0.5" />
          <circle cx="21.5" cy="20" r="1.2" fill="#FF9999" opacity="0.5" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
