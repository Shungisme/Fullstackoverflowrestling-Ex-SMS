import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TranslationService } from '../../domain/port/input/translation.service';
import { CreateTranslationDTO } from '../../domain/dto/create-translation.dto';
import { GetTranslationDTO } from '../../domain/dto/get-translation.dto';
import { TranslationDto } from '../../domain/dto/translation.dto';

@ApiTags('Translations')
@Controller({ path: 'translations', version: '1' })
export class TranslationController {
  private readonly logger = new Logger(TranslationController.name);

  constructor(private readonly translationService: TranslationService) {}

  @Post()
  @ApiOperation({ summary: 'Translate and save entity fields' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Entity fields translated and saved successfully',
  })
  async translateAndSave(
    @Body() data: CreateTranslationDTO,
  ): Promise<{ message: string }> {
    this.logger.log(
      `Translating fields for ${data.entity} ID: ${data.entityId}`,
    );
    await this.translationService.translateAndSave(data);
    return { message: 'Translations saved successfully' };
  }

  @Get('detect-language')
  @ApiOperation({ summary: 'Detect language of text' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Language detected successfully',
  })
  async detectLanguage(
    @Query('text') text: string,
  ): Promise<{ language: string }> {
    const language = await this.translationService.detectLanguage(text);
    return { language };
  }

  @Get('single')
  @ApiOperation({ summary: 'Get single translation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Translation retrieved successfully',
    type: TranslationDto,
  })
  async getTranslation(
    @Query() query: GetTranslationDTO,
  ): Promise<TranslationDto | null> {
    return this.translationService.getTranslation(query);
  }

  @Get()
  @ApiOperation({ summary: 'Get translations for an entity' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Translations retrieved successfully',
    type: [TranslationDto],
  })
  async getAllTranslations(
    @Query('entity') entity: string,
    @Query('entityId') entityId: string,
    @Query('field') field?: string,
    @Query('lang') lang?: string,
  ): Promise<TranslationDto[]> {
    return this.translationService.getAllTranslations(
      entity,
      entityId,
      field,
      lang,
    );
  }
}
