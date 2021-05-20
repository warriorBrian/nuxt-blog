import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionsEntity } from 'src/entity/options.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ OptionsEntity ])
  ],
  controllers: [ EmailController ],
  providers: [ EmailService ],
  exports: [ EmailService ]
})
export class EmailModule {}
