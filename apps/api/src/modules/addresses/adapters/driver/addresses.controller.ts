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
import { CreateAddressDTO } from '../../domain/dto/create-address.dto';
import { UpdateAddressDTO } from '../../domain/dto/update-address.dto';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { AddressesDto } from '../../domain/dto/addresses.dto';
import { AddressesService } from '../../domain/port/input/addresses.service';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  create(@Body() createAddressDto: CreateAddressDTO) {
    return this.addressesService.create(createAddressDto);
  }

  @Post(':studentId')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateAddressDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create an address link with student',
    type: AddressesDto,
  })
  @ApiQuery({ name: 'studentId', type: String })
  createForStudent(
    @Body() createAddressDto: CreateAddressDTO,
    @Query('type')
    type: 'permanentAddress' | 'temporaryAddress' | 'mailingAddress',
    @Param('studentId') studentId: string,
  ) {
    return this.addressesService.createForStudent(
      studentId,
      type,
      createAddressDto,
    );
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
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedResponse<AddressesDto>> {
    return await this.addressesService.findAll(page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get address by id',
    type: AddressesDto,
  })
  findById(@Param('id') id: string) {
    return this.addressesService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UpdateAddressDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update address',
    type: AddressesDto,
  })
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDTO) {
    return this.addressesService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete address',
    type: AddressesDto,
  })
  delete(@Param('id') id: string) {
    return this.addressesService.delete(id);
  }
}
