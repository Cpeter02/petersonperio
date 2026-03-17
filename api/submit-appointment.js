import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { firstName, lastName, email, phone, date, time, message } = await request.json();

  if (!firstName || !lastName || !email) {
    return Response.json({ success: false, error: 'Please fill in all required fields.' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'Peterson Periodontics <info@petersonperio.com>',
      to: 'info@petersonperio.com',
      reply_to: email,
      subject: `New Appointment Request — ${firstName} ${lastName}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#2c2c28;">
          <div style="background:#1a1a18;padding:28px 36px;">
            <h1 style="color:#c4a06e;font-size:1.3rem;font-weight:400;margin:0;">Peterson Periodontics</h1>
            <p style="color:rgba(247,244,239,0.6);font-size:0.8rem;margin:4px 0 0;text-transform:uppercase;letter-spacing:0.1em;">New Appointment Request</p>
          </div>
          <div style="background:#f7f4ef;padding:36px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;width:140px;">Patient Name</td><td style="padding:10px 0;border-bottom:1px solid #e8e4dc;">${firstName} ${lastName}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e8e4dc;"><a href="mailto:${email}" style="color:#9c7d52;">${email}</a></td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #e8e4dc;">${phone || '—'}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;">Preferred Date</td><td style="padding:10px 0;border-bottom:1px solid #e8e4dc;">${date || '—'}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;">Preferred Time</td><td style="padding:10px 0;border-bottom:1px solid #e8e4dc;">${time || '—'}</td></tr>
              <tr><td style="padding:10px 0;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;vertical-align:top;">Message</td><td style="padding:10px 0;line-height:1.6;">${message || '—'}</td></tr>
            </table>
            <p style="margin-top:28px;font-size:0.78rem;color:#6b6b67;line-height:1.6;">* Reply directly to this email to contact the patient.</p>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });

  } catch (err) {
    console.error('Resend error:', err);
    return Response.json({ success: false, error: 'Failed to send. Please call (619) 298-2322.' }, { status: 500 });
  }
}

export const config = {
  runtime: 'edge',
};
