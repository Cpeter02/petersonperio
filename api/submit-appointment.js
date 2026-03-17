const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, date, time, message } = req.body;

  // Basic validation
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
  }

  try {
    // Email to the practice
    await resend.emails.send({
      from: 'Peterson Periodontics <info@petersonperio.com>', 
      to: 'info@petersonperio.com',
      reply_to: email,
      subject: `New Appointment Request — ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2c2c28;">
          <div style="background: #1a1a18; padding: 28px 36px;">
            <h1 style="color: #c4a06e; font-size: 1.3rem; font-weight: 400; letter-spacing: 0.05em; margin: 0;">
              Peterson Periodontics
            </h1>
            <p style="color: rgba(247,244,239,0.6); font-size: 0.8rem; margin: 4px 0 0; letter-spacing: 0.1em; text-transform: uppercase;">
              New Appointment Request
            </p>
          </div>
          <div style="background: #f7f4ef; padding: 36px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e4dc; color: #9c7d52; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; width: 140px;">Patient Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e4dc; font-size: 0.95rem;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e4dc; color: #9c7d52; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e4dc; font-size: 0.95rem;"><a href="mailto:${email}" style="color: #9c7d52;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e4dc; color: #9c7d52; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">Phone</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e4dc; font-size: 0.95rem;">${phone || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e4dc; color: #9c7d52; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">Preferred Date</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e4dc; font-size: 0.95rem;">${date || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e4dc; color: #9c7d52; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">Preferred Time</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e4dc; font-size: 0.95rem;">${time || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #9c7d52; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; vertical-align: top;">Message</td>
                <td style="padding: 10px 0; font-size: 0.95rem; line-height: 1.6;">${message || '—'}</td>
              </tr>
            </table>
            <p style="margin-top: 28px; font-size: 0.78rem; color: #6b6b67; line-height: 1.6;">
              * Reply directly to this email to contact the patient.
            </p>
          </div>
        </div>
      `,
    });

    // Confirmation email to the patient
    await resend.emails.send({
      from: 'Peterson Periodontics <info@petersonperio.com>', 
      to: email,
      subject: 'We received your appointment request — Peterson Periodontics',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2c2c28;">
          <div style="background: #1a1a18; padding: 28px 36px;">
            <h1 style="color: #c4a06e; font-size: 1.3rem; font-weight: 400; letter-spacing: 0.05em; margin: 0;">
              Peterson Periodontics
            </h1>
          </div>
          <div style="background: #f7f4ef; padding: 36px;">
            <h2 style="font-size: 1.4rem; font-weight: 400; color: #1a1a18; margin-bottom: 16px;">
              Thank you, ${firstName}!
            </h2>
            <p style="font-size: 0.95rem; line-height: 1.75; color: #6b6b67; margin-bottom: 20px;">
              We've received your appointment request and will be in touch shortly to confirm your visit.
            </p>
            <div style="background: #fff; border-left: 3px solid #9c7d52; padding: 16px 20px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 0.85rem; color: #6b6b67; line-height: 1.6;">
                <strong style="color: #1a1a18;">Requested date:</strong> ${date || 'To be confirmed'}<br/>
                <strong style="color: #1a1a18;">Requested time:</strong> ${time || 'To be confirmed'}
              </p>
            </div>
            <p style="font-size: 0.9rem; line-height: 1.75; color: #6b6b67;">
              If you need to reach us directly:<br/>
              📞 <a href="tel:+16192982322" style="color: #9c7d52;">(619) 298-2322</a><br/>
              ✉️ <a href="mailto:info@petersonperio.com" style="color: #9c7d52;">info@petersonperio.com</a><br/>
              📍 4076 Third Avenue, Suite 201, San Diego, CA 92103
            </p>
          </div>
          <div style="padding: 20px 36px; background: #1a1a18;">
            <p style="margin: 0; font-size: 0.72rem; color: rgba(247,244,239,0.35); letter-spacing: 0.06em;">
              © Peterson Periodontics 2025
            </p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ success: true });

  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ success: false, error: 'Failed to send. Please call us directly at (619) 298-2322.' });
  }
};
