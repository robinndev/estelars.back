// src/services/email.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false, // TLS não exige secure true
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('Verifying SMTP transporter...');
      await this.transporter.verify();
      this.logger.log('✅ SMTP transporter verified and ready');
    } catch (err) {
      this.logger.error('❌ Error verifying SMTP transporter', err as any);
    }
  }

  async sendMail(to: string, subject: string, html: string) {
    console.log('Sending email to:', to);

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      this.logger.log(`✅ Email sent: ${info.messageId}`);
      console.log('Email sent successfully to:', to);
      return info;
    } catch (err) {
      this.logger.error('❌ Error sending email', err as any);
      console.log('Failed to send email to:', to);
      throw err;
    }
  }
}
