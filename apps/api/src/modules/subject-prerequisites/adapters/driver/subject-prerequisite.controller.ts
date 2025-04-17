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
import { CreateSubjectPrerequisiteDTO } from '../../domain/dto/create-subject-prerequisite.dto';
import { UpdateSubjectPrerequisiteDTO } from '../../domain/dto/update-subject-prerequisite.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import {
  SubjectPrerequisiteDto,
  SubjectPrerequisiteResponseDto,
  SubjectPrerequisiteResponseWrapperDTO,
  SubjectPrerequisitesResponseWrapperDTO,
} from '../../domain/dto/subject-prerequisite.dto';
import { SubjectPrerequisiteService } from '../../domain/port/input/subject-prerequisite.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('Subject Prerequisites')
@Controller({ path: 'subject-prerequisites', version: '1' })
export class SubjectPrerequisiteController {
  constructor(
    private readonly prerequisiteService: SubjectPrerequisiteService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(SubjectPrerequisiteDto)
  @ApiBody({ type: CreateSubjectPrerequisiteDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a subject prerequisite relationship',
    type: SubjectPrerequisiteResponseWrapperDTO,
  })
  create(@Body() createDto: CreateSubjectPrerequisiteDTO) {
    return this.prerequisiteService.create(createDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all subject prerequisites with pagination',
    type: SubjectPrerequisitesResponseWrapperDTO,
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
  ): Promise<PaginatedResponse<SubjectPrerequisiteResponseDto>> {
    return await this.prerequisiteService.findAll(Number(page), Number(limit));
  }

  @Get('subject/:subjectId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'subjectId', description: 'Subject ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all prerequisites for a specific subject',
    type: [SubjectPrerequisiteResponseDto],
  })
  findBySubjectId(@Param('subjectId') subjectId: string) {
    return this.prerequisiteService.findPrerequisitesForSubject(subjectId);
  }

  @Get('required-by/:prerequisiteSubjectId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'prerequisiteSubjectId',
    description: 'Prerequisite Subject ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all subjects that require a specific prerequisite',
    type: [SubjectPrerequisiteResponseDto],
  })
  findByPrerequisiteSubjectId(
    @Param('prerequisiteSubjectId') prerequisiteSubjectId: string,
  ) {
    return this.prerequisiteService.findSubjectsRequiringPrerequisite(
      prerequisiteSubjectId,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(SubjectPrerequisiteDto)
  @ApiParam({ name: 'id', description: 'Prerequisite ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get subject prerequisite by id',
    type: SubjectPrerequisiteResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject prerequisite not found',
  })
  findById(@Param('id') id: string) {
    return this.prerequisiteService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(SubjectPrerequisiteDto)
  @ApiParam({ name: 'id', description: 'Prerequisite ID', type: String })
  @ApiBody({ type: UpdateSubjectPrerequisiteDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update subject prerequisite',
    type: SubjectPrerequisiteResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject prerequisite not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSubjectPrerequisiteDTO,
  ) {
    return this.prerequisiteService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(SubjectPrerequisiteDto)
  @ApiParam({ name: 'id', description: 'Prerequisite ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete subject prerequisite',
    type: SubjectPrerequisiteResponseWrapperDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject prerequisite not found',
  })
  delete(@Param('id') id: string) {
    return this.prerequisiteService.delete(id);
  }
}
