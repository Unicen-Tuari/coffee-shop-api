import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  imports: [
    // Load environment variables and validate them
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().optional(),
        DB_SYNC: Joi.boolean().truthy('true').falsy('false').default(true),
        DB_SSL: Joi.boolean().truthy('true').falsy('false').default(false),
      }),
    }),
    CoffeesModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL') ?? undefined,
        autoLoadEntities: true,
        synchronize: config.get<boolean>('DB_SYNC'),
        ssl: config.get<boolean>('DB_SSL'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
