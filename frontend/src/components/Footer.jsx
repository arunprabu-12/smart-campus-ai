import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      padding: '24px',
      textAlign: 'center',
      borderTop: '1px solid #1e293b',
      color: '#94a3b8',
      fontSize: '14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px'
    }}>
      <div>
        Built with ❤️ by <span style={{ color: '#f8fafc', fontWeight: '500' }}>Arun Prabu</span>
      </div>
      <div>
        <a 
          href="https://github.com/arunprabu-12" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: '#818cf8', 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#a5b4fc'}
          onMouseOut={(e) => e.currentTarget.style.color = '#818cf8'}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          GitHub @arunprabu-12
        </a>
      </div>
    </footer>
  );
}
