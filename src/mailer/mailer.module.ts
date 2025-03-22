import { Module } from '@nestjs/common';
import { MailerProvider } from './mailer.provider';
import { MailerModule } from '@nestjs-modules/mailer';
import { config } from 'src/common/config/config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: config.EMAIL_HOST,
        auth: {
          user: config.EMAIL_USERNAME,
          pass: config.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  providers: [MailerProvider],
  exports: [MailerProvider],
})
export class SendMailerModule {}
