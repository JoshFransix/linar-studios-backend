import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class ContactService {
  private readonly resend: Resend;
  private readonly logger = new Logger(ContactService.name);

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      this.logger.warn('RESEND_API_KEY not set — emails will fail');
    }
    this.resend = new Resend(process.env.RESEND_API_KEY);
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
      await this.resend.emails.send({
        from: `Linar Studios Contact <onboarding@resend.dev>`, // change if you have a verified sender
        to: [to, 'daxumjay@gmail.com'],
        subject: `📩 New contact form submission from ${this.escapeHtml(name)}`,
        html,
      });

      return { success: true, message: 'Email sent' };
    } catch (err) {
      this.logger.error('Resend error', err);
      throw new Error('Failed to send email');
    }
  }

  // small helper to avoid basic HTML injection
  private escapeHtml(raw: string) {
    return String(raw)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
