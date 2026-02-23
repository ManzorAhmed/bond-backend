import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BondService } from './bond.service';
import { CreateBondDto } from './dto/create-bond.dto';
import { UpdateBondDto } from './dto/update-bond.dto';

@Controller('bond')
export class BondController {
  constructor(private readonly bondService: BondService) {}

  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBondDto: CreateBondDto) {
    const result = await this.bondService.create(createBondDto);
    return {
      success: true,
      message: 'Bond calculated and saved successfully',
      data: result,
    };
  }

 
  @Get()
  async findAll(@Query('limit') limit?: string) {
    const data = await this.bondService.findAll(limit ? +limit : 50);
    return {
      success: true,
      count: data.length,
      data,
    };
  }


  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.bondService.findOne(id);
    return {
      success: true,
      data,
    };
  }


  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBondDto: UpdateBondDto,
  ) {
    const result = await this.bondService.update(id, updateBondDto);
    return {
      success: true,
      message: `Bond #${id} recalculated and updated`,
      data: result,
    };
  }

  
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.bondService.remove(id);
    return {
      success: true,
      message: `Bond #${id} deleted successfully`,
      data: result,
    };
  }


  @Delete()
  async removeAll() {
    const result = await this.bondService.removeAll();
    return {
      success: true,
      message: `All bond calculations cleared`,
      data: result,
    };
  }
}
