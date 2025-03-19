import { Module } from '@nestjs/common';
import { IdentityPapersService } from './domain/port/input/identity-papers.service';
import { IdentityPapersController } from './adapters/driver/identity-papers.controller';
import { IdentityPapersRepository } from './adapters/driven/identity-papers.repository';

@Module({
  exports: [IdentityPapersService],
  controllers: [IdentityPapersController],
  providers: [
    IdentityPapersService,
    {
      provide: 'IIdentityPapersRepository',
      useClass: IdentityPapersRepository,
    },
  ],
})
export class IdentityPapersModule {}
