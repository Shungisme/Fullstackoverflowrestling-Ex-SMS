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
} from '@nestjs/common';
import { CreateAddressDTO } from '../../domain/dto/create-address.dto';
import { UpdateAddressDTO } from '../../domain/dto/update-address.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { AddressesDto } from '../../domain/dto/addresses.dto';
import { AddressesService } from '../../domain/port/input/addresses.service';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    type: AddressesDto,
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
    type: AddressesDto,
  })
  async createForStudent(
    @Res() response: Response,
    @Body() createAddressDto: CreateAddressDTO,
    @Query('type')
    type: 'permanentAddress' | 'temporaryAddress' | 'mailingAddress',
    @Param('studentId') studentId: string,
  ): Promise<Response> {
    try {
      const address = await this.addressesService.createForStudent(
        studentId,
        type,
        createAddressDto,
      );
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Address created for student successfully',
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
  async findAll(
    @Res() response: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Response> {
    try {
      const addresses = await this.addressesService.findAll(page, limit);
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
    type: AddressesDto,
  })
  async findById(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const address = await this.addressesService.findById(id);
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
    type: AddressesDto,
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
    type: AddressesDto,
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
