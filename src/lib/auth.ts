import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { Resend } from "resend";


// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      try {
        const { data, error } = await resend.emails.send({
          from: 'Seating Chart Planner <onboarding@resend.dev>',
          to: [user.email],
          subject: 'Reset Your Password - Seating Chart Planner',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                <h1 style="color: #333; margin: 0;">Seating Chart Planner</h1>
              </div>
              <div style="padding: 30px 20px; background-color: #ffffff;">
                <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
                <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Hi ${user.name || 'there'},
                </p>
                <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  We received a request to reset your password. Click the link below to set a new password.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${url}" style="background-color: #dc2626; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                    Reset Password
                  </a>
                </div>
                <p style="color: #666; font-size: 14px; line-height: 1.5; margin-top: 30px;">
                  If the button doesn't work, copy and paste this link: ${url}
                </p>
              </div>
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                <p style="color: #888; font-size: 12px; margin: 0;">
                  If you didn't request this password reset, please ignore this email.
                </p>
              </div>
            </div>
          `,
        });

        if (error) {
          console.error('Failed to send password reset email:', error);
          throw new Error('Failed to send password reset email');
        }

        console.log('✅ Password reset email sent successfully:', data?.id);
      } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const { data, error } = await resend.emails.send({
          from: 'Seating Chart Planner <onboarding@resend.dev>',
          to: [user.email],
          subject: 'Verify Your Email - Seating Chart Planner',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                <h1 style="color: #333; margin: 0;">Seating Chart Planner</h1>
              </div>
              <div style="padding: 30px 20px; background-color: #ffffff;">
                <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${user.name || 'there'}!</h2>
                <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Thank you for creating an account with Seating Chart Planner. To complete your registration 
                  and start creating amazing seating arrangements, please verify your email address.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${url}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                    Verify Email Address
                  </a>
                </div>
                <p style="color: #666; font-size: 14px; line-height: 1.5; margin-top: 30px;">
                  If the button doesn't work, copy and paste this link: ${url}
                </p>
              </div>
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                <p style="color: #888; font-size: 12px; margin: 0;">
                  This verification link will expire in 24 hours. If you didn't create this account, please ignore this email.
                </p>
              </div>
            </div>
          `,
        });

        if (error) {
          console.error('Failed to send verification email:', error);
          throw new Error('Failed to send verification email');
        }

        console.log('✅ Verification email sent successfully:', data?.id);
      } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes cache
    },
  },
}); 