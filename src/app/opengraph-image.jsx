import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#faf9f5',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, letterSpacing: 4, color: '#a16207', fontWeight: 600 }}>
          GITHUB ACTIVITY TRACER
        </div>
        <div style={{ display: 'flex', fontSize: 108, fontWeight: 700, color: '#1b1a17', marginTop: 20 }}>
          Waypoint
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: '#5f5c54', marginTop: 24, maxWidth: 900 }}>
          Find where they actually spend their time on GitHub
        </div>
      </div>
    ),
    { ...size }
  );
}
