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
          background: '#ffffff',
          padding: '90px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, color: '#57534e', fontWeight: 500 }}>
          <span style={{ color: '#e0562a', marginRight: 14 }}>//</span> github activity tracer
        </div>
        <div style={{ display: 'flex', fontSize: 104, fontWeight: 600, color: '#2a2524', marginTop: 26, letterSpacing: -2 }}>
          waypoint
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: '#57534e', marginTop: 24, maxWidth: 940, lineHeight: 1.35 }}>
          See where developers actually spend their time on GitHub.
        </div>
      </div>
    ),
    { ...size }
  );
}
