import { Module } from '@nestjs/common';
import { IdentityPapersService } from './domain/port/input/identity-papers.service';
import { IdentityPapersController } from './adapters/driver/identity-papers.controller';
import { IdentityPapersRepository } from './adapters/driven/identity-papers.repository';
import { IDENTITY_REPOSITORY } from './domain/port/output/IIdentityPapersRepository';

@Module({
  exports: [IdentityPapersService],
  controllers: [IdentityPapersController],
  providers: [
    IdentityPapersService,
    {
      provide: IDENTITY_REPOSITORY,
      useClass: IdentityPapersRepository,
    },
  ],
})
export class IdentityPapersModule {}
