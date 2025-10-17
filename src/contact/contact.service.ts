import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class ContactService {
  private readonly transporter: Transporter;
  private readonly logger = new Logger(ContactService.name);

  constructor() {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      this.logger.warn('GMAIL_USER or GMAIL_PASS not set — emails will fail');
    }

    // Create Gmail SMTP transporter (typed)
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true if port 465
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_API_KEY,
      },
      tls: {
        rejectUnauthorized: false, // avoids SSL issues in some hosts
      },
    });
  }

  async sendContactEmail(name: string, email: string, message: string) {
    const to = process.env.RECEIVER_EMAIL;
    if (!to) throw new Error('RECEIVER_EMAIL not configured');

    const html = `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${this.escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${this.escapeHtml(email)}</p>
      <hr/>
      <p>${this.escapeHtml(message).replace(/\n/g, '<br/>')}</p>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Linar Studios Contact" <${process.env.RECEIVER_EMAIL}>`,
        to: [to, 'joshiandersonk69@gmail.com'],
        subject: `📩 New contact form submission from ${this.escapeHtml(name)}`,
        html,
      });

      this.logger.log('Contact email sent successfully');
      return { success: true, message: 'Email sent successfully' };
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error(`Failed to send email: ${err.message}`, err.stack);
      } else {
        this.logger.error(
          'Failed to send email (unknown error)',
          JSON.stringify(err),
        );
      }
      throw new Error('Failed to send email');
    }
  }

  private escapeHtml(raw: string) {
    return String(raw)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
