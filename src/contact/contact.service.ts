import { Injectable, Logger } from '@nestjs/common';
import * as brevo from '@getbrevo/brevo';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private readonly apiInstance: brevo.TransactionalEmailsApi;

  constructor() {
    if (!process.env.BREVO_API_KEY) {
      this.logger.error('BREVO_API_KEY not set — emails will fail');
      throw new Error('BREVO_API_KEY environment variable is required');
    }

    this.apiInstance = new brevo.TransactionalEmailsApi();

    // TypeScript now knows BREVO_API_KEY is defined because of the check above
    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY,
    );
  }

  async sendContactEmail(name: string, email: string, message: string) {
    const to = process.env.RECEIVER_EMAIL;
    if (!to) throw new Error('RECEIVER_EMAIL not configured');

    const htmlContent = `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${this.escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${this.escapeHtml(email)}</p>
      <hr/>
      <p>${this.escapeHtml(message).replace(/\n/g, '<br/>')}</p>
    `;

    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.subject = `📩 New contact form submission from ${this.escapeHtml(name)}`;
      sendSmtpEmail.htmlContent = htmlContent;
      sendSmtpEmail.sender = {
        name: 'Linar Studios Contact',
        email: process.env.BREVO_SENDER_EMAIL || 'noreply@linarstudios.com',
      };
      sendSmtpEmail.to = [{ email: to }];
      sendSmtpEmail.replyTo = {
        email: email,
        name: name,
      };

      await this.apiInstance.sendTransacEmail(sendSmtpEmail);

      this.logger.log('Contact email sent successfully via Brevo API');
      return { success: true, message: 'Email sent successfully' };
    } catch (err: any) {
      this.logger.error(`Failed to send email via Brevo API: ${err.message}`);
      if (err.response?.body) {
        this.logger.error(
          `Brevo API error details: ${JSON.stringify(err.response.body)}`,
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
