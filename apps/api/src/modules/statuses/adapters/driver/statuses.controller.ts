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
import { CreateStatusDTO } from '../../domain/dto/create-status.dto';
import { UpdateStatusDTO } from '../../domain/dto/update-status.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  StatusesDto,
  StatusesResponseWrapperDTO,
  StatusResponseWrapperDTO,
} from '../../domain/dto/statuses.dto';
import { StatusesService } from '../../domain/port/input/statuses.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('Statuses')
@Controller({ path: 'statuses', version: '1' })
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(StatusesDto)
  @ApiBody({ type: CreateStatusDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a status',
    type: StatusResponseWrapperDTO,
  })
  create(@Body() createStatusDto: CreateStatusDTO) {
    return this.statusesService.create(createStatusDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all statuses with pagination',
    type: StatusesResponseWrapperDTO,
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
    description: 'Status to filter by',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status: string = '',
  ): Promise<PaginatedResponse<StatusesDto>> {
    return await this.statusesService.findAll(
      Number(page),
      Number(limit),
      status,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(StatusesDto)
  @ApiParam({ name: 'id', description: 'Status ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get status by id',
    type: StatusResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Status not found',
  })
  findById(@Param('id') id: string) {
    return this.statusesService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(StatusesDto)
  @ApiParam({ name: 'id', description: 'Status ID', type: String })
  @ApiBody({ type: UpdateStatusDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update status',
    type: StatusResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Status not found',
  })
  update(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDTO) {
    return this.statusesService.update(id, updateStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(StatusesDto)
  @ApiParam({ name: 'id', description: 'Status ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete status',
    type: StatusResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Status not found',
  })
  delete(@Param('id') id: string) {
    return this.statusesService.delete(id);
  }
}
