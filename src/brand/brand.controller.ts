import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { GetBrandDto } from './dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('name')
  getBrandName(@Query() createBrandDto: GetBrandDto) {
    return this.brandService.getBrandName(createBrandDto);
  }
  @Post('name')
  create(@Body() brandName: string) {
    return this.brandService.createBrand(brandName);
  }
}
