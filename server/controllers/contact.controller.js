import sendEmail from '../utils/sendEmail.js';

// POST /api/v1/contact
export const sendContact = async (req, res, next) => {
    try {
        const { name, email, message } = req.body || {};

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const subject = `New contact from ${name}`;
        const html = `
      <h3>New contact form submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br/>${String(message).replace(/\n/g, '<br/>')}</p>
    `;

        // Send email to configured recipient (SMTP_TO_EMAIL) or fallback to SMTP_FROM_EMAIL
        const to = process.env.SMTP_TO_EMAIL || process.env.SMTP_FROM_EMAIL;
        // send message to site owner
        await sendEmail(to, subject, message, html);

        // send acknowledgement to the user who submitted the form
        const ackSubject = `Thanks for contacting Blogging Platform`;
        const ackHtml = `
                    <p>Hi ${name},</p>
                    <p>Thanks for reaching out — we received your message and will get back to you soon.</p>
                    <hr/>
                    <p><strong>Your message:</strong></p>
                    <p>${String(message).replace(/\n/g, '<br/>')}</p>
                    <p>— The Blogging Platform team</p>
                `;

        try {
            await sendEmail(email, ackSubject, `Thank you for contacting us`, ackHtml);
        } catch (ackErr) {
            // Log but don't fail the entire request — owner already received the message
            console.error('Failed to send acknowledgement to user:', ackErr);
        }

        return res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
        console.error('contact.controller error:', err);
        return res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};
