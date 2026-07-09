import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ArcjetGuard,
  ArcjetModule,
  fixedWindow,
  shield,
} from "@arcjet/nest";
import { APP_GUARD } from "@nestjs/core";
import { PrismaService } from './lib/prisma/prisma.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth/auth';

@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    ArcjetModule.forRoot({
      isGlobal: true,
      key: process.env.ARCJET_KEY!,
      rules: [
        shield({ mode: "LIVE" }),
        fixedWindow({
          mode: "LIVE",
          window: "60s",
          max: 2,
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ArcjetGuard,
    },
  ],
})
export class AppModule { }
