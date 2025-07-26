// app/api/contact/route.ts
import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const { name, agency,email, phone ,message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await sql`
        CREATE TABLE IF NOT EXISTS referrals (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            travel_agency_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `;
    await sql`
        INSERT INTO referrals (name, travel_agency_name, phone, email, message)
        VALUES (${name}, ${agency}, ${phone}, ${email}, ${message});
    `;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailData = {
      from: 'Contact Form <onboarding@resend.dev>',
    //   to: 'amirblue21@yahoo.com', 
      to: 'khichishab3313@gmail.com', 
      subject: 'Guest Referral',
      html: `
       <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); overflow: hidden;">
        <div style="background-color: #4A90E2; padding: 25px 30px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Guest Referral</h1>
        </div>
        <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333333; line-height: 1.6;">You've received a new message for Guest Referral. Here are the details:</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px; border-collapse: collapse;">
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; width: 120px; font-size: 15px; color: #555555; font-weight: bold;">Name:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-size: 15px; color: #333333;">${name}</td>
            </tr>
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; width: 120px; font-size: 15px; color: #555555; font-weight: bold;">Travel Agency Name:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-size: 15px; color: #333333;">${agency}</td>
            </tr>
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; width: 120px; font-size: 15px; color: #555555; font-weight: bold;">Phone:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-size: 15px; color: #333333;">${phone}</td>
            </tr>
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; width: 120px; font-size: 15px; color: #555555; font-weight: bold;">Email:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-size: 15px; color: #333333;"><a href="mailto:${email}" style="color: #4A90E2; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
                <td colspan="2" style="padding: 20px 0 10px 0; font-size: 15px; color: #555555; font-weight: bold;">Message:</td>
            </tr>
            <tr>
                <td colspan="2" style="padding: 0 0 10px 0; font-size: 15px; color: #333333; line-height: 1.8; background-color: #f9f9f9; padding: 15px; border-radius: 4px; border: 1px solid #f0f0f0;">${message.replace(/\n/g, '<br />')}</td>
            </tr>
            </table>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px 30px; text-align: center; font-size: 13px; color: #888888; border-top: 1px solid #eeeeee;">
            <p style="margin: 0;">This email was sent from your Referral Form.</p>
        </div>
        </div>
      `,
    };

    const result = await resend.emails.send(emailData);

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'We have received your message! Thanks for Referring a guest to us.' });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
