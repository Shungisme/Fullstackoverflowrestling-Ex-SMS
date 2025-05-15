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
  Res,
  Headers,
} from '@nestjs/common';
import { CreateAddressDTO } from '../../domain/dto/create-address.dto';
import { UpdateAddressDTO } from '../../domain/dto/update-address.dto';
import { AddressesService } from '../../domain/port/input/addresses.service';
import {
  ApiBody,
  ApiHeader,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Addresses')
@Controller({ path: 'addresses', version: '1' })
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateAddressDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create an address',
    type: CreateAddressDTO,
  })
  async create(
    @Res() response: Response,
    @Body() createAddressDto: CreateAddressDTO,
  ): Promise<Response> {
    try {
      const address = await this.addressesService.create(createAddressDto);
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Address created successfully',
        data: address,
      });
    } catch (error: any) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
  }

  @Post(':studentId')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateAddressDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create an address link with student',
    type: CreateAddressDTO,
  })
  async createForStudent(
    @Res() response: Response,
    @Body() createAddressDto: CreateAddressDTO,
    @Query('type')
    type: 'permanentAddress' | 'temporaryAddress' | 'mailingAddress',
    @Param('studentId') studentId: string,
  ): Promise<Response> {
    try {
      const address =
        await this.addressesService.createAndLinkAddressForStudent(
          studentId,
          type,
          createAddressDto,
        );
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Address created and linked successfully',
        data: address,
      });
    } catch (error: any) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all addresses',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'lang',
    required: false,
    type: String,
    description: 'Language code for translations (e.g., en, vi)',
  })
  @ApiHeader({
    name: 'Accept-Language',
    required: false,
    description: 'Language preference',
  })
  async findAll(
    @Res() response: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('lang') queryLang?: string,
    @Headers('accept-language') acceptLanguage?: string,
  ): Promise<Response> {
    try {
      // Ưu tiên query param, sau đó dùng header
      const lang =
        queryLang ||
        (acceptLanguage
          ? acceptLanguage.split(',')[0].split(';')[0]
          : undefined);

      const addresses = await this.addressesService.findAll(page, limit, lang);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Addresses fetched successfully',
        data: addresses,
      });
    } catch (error: any) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get address by id',
    type: CreateAddressDTO,
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    type: String,
    description: 'Language code for translations (e.g., en, vi)',
  })
  @ApiHeader({
    name: 'Accept-Language',
    required: false,
    description: 'Language preference',
  })
  async findById(
    @Res() response: Response,
    @Param('id') id: string,
    @Query('lang') queryLang?: string,
    @Headers('accept-language') acceptLanguage?: string,
  ): Promise<Response> {
    try {
      // Ưu tiên query param, sau đó dùng header
      const lang =
        queryLang ||
        (acceptLanguage
          ? acceptLanguage.split(',')[0].split(';')[0]
          : undefined);

      const address = await this.addressesService.findById(id, lang);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Address fetched successfully',
        data: address,
      });
    } catch (error: any) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UpdateAddressDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update address',
    type: CreateAddressDTO,
  })
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDTO,
  ): Promise<Response> {
    try {
      const address = await this.addressesService.update(id, updateAddressDto);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Address updated successfully',
        data: address,
      });
    } catch (error: any) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete address',
    type: CreateAddressDTO,
  })
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const address = await this.addressesService.delete(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Address deleted successfully',
        data: address,
      });
    } catch (error: any) {
      return response
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal Server Error',
        });
    }
  }
}
