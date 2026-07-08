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

@Module({
imports: [
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
    {
      provide: APP_GUARD,
      useClass: ArcjetGuard,
    },
  ],
})
export class AppModule {}
