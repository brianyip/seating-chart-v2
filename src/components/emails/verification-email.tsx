import * as React from 'react';

interface VerificationEmailProps {
  firstName: string;
  verificationUrl: string;
}

export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
  firstName,
  verificationUrl,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#333', margin: '0' }}>Seating Chart Planner</h1>
    </div>
    
    <div style={{ padding: '30px 20px', backgroundColor: '#ffffff' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>
        Welcome, {firstName}!
      </h2>
      
      <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
        Thank you for creating an account with Seating Chart Planner. To complete your registration 
        and start creating amazing seating arrangements, please verify your email address.
      </p>
      
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a 
          href={verificationUrl}
          style={{
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            padding: '12px 30px',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          Verify Email Address
        </a>
      </div>
      
      <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', marginTop: '30px' }}>
        If the button above doesn't work, you can copy and paste this link into your browser:
      </p>
      
      <p style={{ 
        color: '#3b82f6', 
        fontSize: '14px', 
        wordBreak: 'break-all',
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRadius: '4px'
      }}>
        {verificationUrl}
      </p>
    </div>
    
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center' }}>
      <p style={{ color: '#888', fontSize: '12px', margin: '0' }}>
        This verification link will expire in 24 hours. If you didn't create this account, 
        please ignore this email.
      </p>
    </div>
  </div>
); 