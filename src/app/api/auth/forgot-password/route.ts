import { type NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { generateResetToken, generateResetTokenExpiry } from '@/lib/auth-utils';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log('Forgot password request for:', email);

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userResult = await sql`
      SELECT id, "firstName", "lastName", email FROM users WHERE email = ${email}
    `;

    if (userResult.length === 0) {
      // For security, we don't reveal if the email exists or not
      // But we still return success to prevent email enumeration
      return NextResponse.json({
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    const user = userResult[0];

    // Generate reset token and expiry
    const resetToken = generateResetToken();
    const resetTokenExpiry = generateResetTokenExpiry();

    console.log('Generated reset token for user:', user.id);

    // Update user with reset token
    await sql`
      UPDATE users
      SET "resetToken" = ${resetToken}, "resetTokenExpiry" = ${resetTokenExpiry}, "updatedAt" = NOW()
      WHERE id = ${user.id}
    `;

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    // Send email 
    console.log('=== EMAIL SENDING DEBUG ===');
    console.log('RESEND_API_KEY available:', !!process.env.RESEND_API_KEY);
    console.log('RESEND_API_KEY (first 10 chars):', process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 10)}...` : 'NOT SET');
    console.log('About to send email to:', email);
    console.log('Reset URL:', resetUrl);

    if (process.env.RESEND_API_KEY) {
      try {
        console.log('Creating Resend instance...');
        const resend = new Resend(process.env.RESEND_API_KEY);
        console.log('Resend instance created successfully');

        const emailData = {
          // from: 'NYC Bookings <noreply@resend.dev>',
          from : 'onboarding@resend.dev',
          to: email,
          subject: 'Reset Your Password - NYC Bookings',
          html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
              <h1 style="color: #2563eb; text-align: center;">Reset Your Password</h1>
              <p>Hi ${user.firstName},</p>
              <p>We received a request to reset your password for your NYC Bookings account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}"
                   style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
                ${resetUrl}
              </p>
              <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
              <p>If you didn't request this password reset, you can safely ignore this email.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; text-align: center;">
                NYC Bookings - Your trusted vacation rental platform
              </p>
            </div>
          `
        };

        console.log('Email data prepared:', {
          from: emailData.from,
          to: emailData.to,
          subject: emailData.subject,
          htmlLength: emailData.html.length
        });

        console.log('Calling resend.emails.send()...');
        const startTime = Date.now();
        const result = await resend.emails.send(emailData);
        const endTime = Date.now();

        console.log('Resend API call completed in', endTime - startTime, 'ms');
        console.log('Resend API response:', JSON.stringify(result, null, 2));

        if (result.data) {
          console.log('✅ Email sent successfully! ID:', result.data.id);
        } else if (result.error) {
          console.error('❌ Resend API returned error:', result.error);
        }

        console.log('Reset email process completed for:', email);
      } catch (emailError) {
        console.error('❌ Exception during email sending:', emailError);
        console.error('Error details:', {
          name: emailError instanceof Error ? emailError.name : 'Unknown',
          message: emailError instanceof Error ? emailError.message : 'Unknown error',
          stack: emailError instanceof Error ? emailError.stack : 'No stack trace'
        });
        // Continue anyway - don't fail the request due to email issues
      }
    } else {
      console.log('❌ RESEND_API_KEY not configured, reset token generated but email not sent');
      console.log('Reset URL for testing:', resetUrl);
    }
    console.log('=== END EMAIL DEBUG ===');

    return NextResponse.json({
      message: 'If an account with that email exists, we have sent a password reset link.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
