import { Module } from '@nestjs/common';
import { MailerProvider } from './mailer.provider';
import { MailerModule } from '@nestjs-modules/mailer';
import { config } from 'src/common/config/config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT'),
          auth: {
            user: configService.get<string>('EMAIL_USERNAME'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        },
      }),
    }),
  ],
  providers: [MailerProvider],
  exports: [MailerProvider],
})
export class SendMailerModule {}
