import { Resend } from 'resend';

// Initialize Resend client using the API Key from Vercel environment
const resend = new Resend(process.env.RESEND_API_KEY); 

export default async function handler(req, res) {
  if (req.method !== "POST") {
    // Correctly handle non-POST requests
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Use Resend to send the email over HTTP
    const { data, error } = await resend.emails.send({
      // ⚠️ IMPORTANT: 'from' MUST be a verified domain/email on Resend
      from: `Portfolio Contact https://portfolio-inky-pi-51.vercel.app`, 
      to: [process.env.RECEIVER_EMAIL],
      reply_to: email, // Allow you to reply directly to the sender's email
      subject: `New message from ${name}`,
      html: `
        <strong>Name:</strong> ${name}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>Message:</strong> ${message}
      `,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return res.status(500).json({ error: "Email API failed to send message." });
    }

    // Success response
    return res.status(200).json({ success: true, message: "Message sent successfully! Thank you for your interest." });
  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({ error: "An unexpected server error occurred." });
  }
}