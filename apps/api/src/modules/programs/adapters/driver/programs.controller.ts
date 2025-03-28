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
import { CreateProgramDTO } from '../../domain/dto/create-program.dto';
import { UpdateProgramDTO } from '../../domain/dto/update-program.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  ProgramsDto,
  ProgramsResponseWrapperDTO,
  ProgramResponseWrapperDTO,
} from '../../domain/dto/programs.dto';
import { ProgramsService } from '../../domain/port/input/programs.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('Programs')
@Controller({ path: 'programs', version: '1' })
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(ProgramsDto)
  @ApiBody({ type: CreateProgramDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a program',
    type: ProgramResponseWrapperDTO,
  })
  create(@Body() createProgramDto: CreateProgramDTO) {
    return this.programsService.create(createProgramDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all programs with pagination',
    type: ProgramsResponseWrapperDTO,
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
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by status',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status: string = '',
  ): Promise<PaginatedResponse<ProgramsDto>> {
    return await this.programsService.findAll(
      Number(page),
      Number(limit),
      status,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(ProgramsDto)
  @ApiParam({ name: 'id', description: 'Program ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get program by id',
    type: ProgramResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Program not found',
  })
  findById(@Param('id') id: string) {
    return this.programsService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(ProgramsDto)
  @ApiParam({ name: 'id', description: 'Program ID', type: String })
  @ApiBody({ type: UpdateProgramDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update program',
    type: ProgramResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Program not found',
  })
  update(@Param('id') id: string, @Body() updateProgramDto: UpdateProgramDTO) {
    return this.programsService.update(id, updateProgramDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(ProgramsDto)
  @ApiParam({ name: 'id', description: 'Program ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete program',
    type: ProgramResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Program not found',
  })
  delete(@Param('id') id: string) {
    return this.programsService.delete(id);
  }
}
