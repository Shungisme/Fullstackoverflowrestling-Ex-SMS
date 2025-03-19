import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateIdentityPaperDTO } from '../../domain/dto/create-identity-paper.dto';
import { UpdateIdentityPaperDTO } from '../../domain/dto/update-identity-paper.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  IdentityPapersDto,
  IdentityPapersResponseWrapperDTO,
  IdentityPaperResponseWrapperDTO,
} from '../../domain/dto/identity-papers.dto';
import { IdentityPapersService } from '../../domain/port/input/identity-papers.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('Identity Papers')
@Controller({ path: 'identity-papers', version: '1' })
export class IdentityPapersController {
  constructor(private readonly identityPapersService: IdentityPapersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(IdentityPapersDto)
  @ApiBody({ type: CreateIdentityPaperDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create an identity paper',
    type: IdentityPaperResponseWrapperDTO,
  })
  create(@Body() createIdentityPaperDto: CreateIdentityPaperDTO) {
    return this.identityPapersService.create(createIdentityPaperDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all identity papers with pagination',
    type: IdentityPapersResponseWrapperDTO,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number, defaults to 1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Results per page, defaults to 10',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedResponse<IdentityPapersDto>> {
    return await this.identityPapersService.findAll(
      Number(page),
      Number(limit),
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(IdentityPapersDto)
  @ApiParam({ name: 'id', description: 'Identity Paper ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get identity paper by id',
    type: IdentityPaperResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Identity paper not found',
  })
  findById(@Param('id') id: string) {
    return this.identityPapersService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(IdentityPapersDto)
  @ApiParam({ name: 'id', description: 'Identity Paper ID', type: String })
  @ApiBody({ type: UpdateIdentityPaperDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update identity paper',
    type: IdentityPaperResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Identity paper not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateIdentityPaperDto: UpdateIdentityPaperDTO,
  ) {
    return this.identityPapersService.update(id, updateIdentityPaperDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(IdentityPapersDto)
  @ApiParam({ name: 'id', description: 'Identity Paper ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete identity paper',
    type: IdentityPaperResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Identity paper not found',
  })
  delete(@Param('id') id: string) {
    return this.identityPapersService.delete(id);
  }
}
