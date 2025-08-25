import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import configs from '.';
import validationSchema from './validation-schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: configs,
      validationSchema: validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
})
export class ConfigModule {}
