import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { config } from 'src/common/config/config';

@Injectable()
export class MailerProvider {
  constructor(private readonly mailService: MailerService) {}

  async sendMail(to: string, message: string) {
    
    try {
      await this.mailService.sendMail({
        from: config().EMAIL_USERNAME,
        to,
        subject: 'Your one time password',
        text: message,
      });
    } catch (error) {
      console.log(error);
      
      throw new Error(error);
    }
  }
}
