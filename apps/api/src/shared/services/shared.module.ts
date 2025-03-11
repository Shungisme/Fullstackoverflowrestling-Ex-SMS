import { Global, Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

const sharedModule = [PrismaService];

@Global()
@Module({
  providers: [...sharedModule],
  exports: [...sharedModule],
})
export class SharedModule {}
