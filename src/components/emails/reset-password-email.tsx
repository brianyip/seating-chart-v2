import * as React from 'react';

interface ResetPasswordEmailProps {
  firstName: string;
  resetUrl: string;
}

export const ResetPasswordEmail: React.FC<Readonly<ResetPasswordEmailProps>> = ({
  firstName,
  resetUrl,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#333', margin: '0' }}>Seating Chart Planner</h1>
    </div>
    
    <div style={{ padding: '30px 20px', backgroundColor: '#ffffff' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>
        Reset Your Password
      </h2>
      
      <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
        Hi {firstName},
      </p>
      
      <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
        We received a request to reset your password for your Seating Chart Planner account. 
        If you made this request, click the button below to set a new password.
      </p>
      
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a 
          href={resetUrl}
          style={{
            backgroundColor: '#dc2626',
            color: '#ffffff',
            padding: '12px 30px',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          Reset Password
        </a>
      </div>
      
      <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', marginTop: '30px' }}>
        If the button above doesn't work, you can copy and paste this link into your browser:
      </p>
      
      <p style={{ 
        color: '#dc2626', 
        fontSize: '14px', 
        wordBreak: 'break-all',
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRadius: '4px'
      }}>
        {resetUrl}
      </p>
      
      <div style={{ 
        backgroundColor: '#fef2f2', 
        border: '1px solid #fecaca', 
        padding: '15px', 
        borderRadius: '6px',
        marginTop: '30px'
      }}>
        <p style={{ color: '#dc2626', fontSize: '14px', margin: '0', fontWeight: 'bold' }}>
          Security Notice
        </p>
        <p style={{ color: '#991b1b', fontSize: '14px', margin: '5px 0 0 0' }}>
          If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
        </p>
      </div>
    </div>
    
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center' }}>
      <p style={{ color: '#888', fontSize: '12px', margin: '0' }}>
        This password reset link will expire in 1 hour for your security.
      </p>
    </div>
  </div>
); 