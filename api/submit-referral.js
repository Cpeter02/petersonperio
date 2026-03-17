import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const {
    patientFirst, patientLast, patientPhone, patientDOB,
    referredFor, teeth, xray,
    referringDoctor, practiceName, doctorPhone, doctorEmail, comments
  } = await request.json();

  if (!patientFirst || !patientLast || !patientPhone || !referringDoctor || !referredFor) {
    return Response.json({ success: false, error: 'Please fill in all required fields.' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'Peterson Periodontics <info@petersonperio.com>',
      to: 'info@petersonperio.com',
      reply_to: doctorEmail || undefined,
      subject: `New Patient Referral — ${patientFirst} ${patientLast}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:640px;margin:0 auto;color:#2c2c28;">
          <div style="background:#1a1a18;padding:28px 36px;">
            <h1 style="color:#c4a06e;font-size:1.3rem;font-weight:400;margin:0;">Peterson Periodontics</h1>
            <p style="color:rgba(247,244,239,0.6);font-size:0.8rem;margin:4px 0 0;text-transform:uppercase;letter-spacing:0.1em;">New Patient Referral</p>
          </div>
          <div style="background:#f7f4ef;padding:36px;">

            <h2 style="font-family:Georgia,serif;font-size:1.1rem;font-weight:400;color:#1a1a18;margin:0 0 16px;padding-bottom:10px;border-bottom:1px solid #e8e4dc;">Patient Information</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
              <tr><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;width:160px;">Patient Name</td><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;">${patientFirst} ${patientLast}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;">Phone</td><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;">${patientPhone}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;">Date of Birth</td><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;">${patientDOB || '—'}</td></tr>
            </table>

            <h2 style="font-family:Georgia,serif;font-size:1.1rem;font-weight:400;color:#1a1a18;margin:0 0 16px;padding-bottom:10px;border-bottom:1px solid #e8e4dc;">Referral Details</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
              <tr><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;width:160px;">Referred For</td><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;">${referredFor}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;">Tooth Number(s)</td><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;">${teeth}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;">X-Rays</td><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;">${xray}</td></tr>
            </table>

            <h2 style="font-family:Georgia,serif;font-size:1.1rem;font-weight:400;color:#1a1a18;margin:0 0 16px;padding-bottom:10px;border-bottom:1px solid #e8e4dc;">Referring Doctor</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
              <tr><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;width:160px;">Doctor</td><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;">${referringDoctor}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;">Practice</td><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;">${practiceName || '—'}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;">Phone</td><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;">${doctorPhone || '—'}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;color:#9c7d52;font-size:0.75rem;text-transform:uppercase;">Email</td><td style="padding:8px 0;border-bottom:1px solid #e8e4dc;">${doctorEmail ? `<a href="mailto:${doctorEmail}" style="color:#9c7d52;">${doctorEmail}</a>` : '—'}</td></tr>
            </table>

            ${comments ? `
            <h2 style="font-family:Georgia,serif;font-size:1.1rem;font-weight:400;color:#1a1a18;margin:0 0 16px;padding-bottom:10px;border-bottom:1px solid #e8e4dc;">Additional Comments</h2>
            <p style="font-size:0.95rem;line-height:1.7;color:#6b6b67;">${comments}</p>
            ` : ''}

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
