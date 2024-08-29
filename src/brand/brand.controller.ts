import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { GetUser } from '../auth/decorators';
import { JwtGuard } from '../auth/guards';
import { Brand } from './dto';

@UseGuards(JwtGuard)
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('name')
  getBrandName(
    @Query('niche') niche: string,
    @Query('industry') industry: string,
  ) {
    return this.brandService.getBrandName({ niche, industry });
  }
  @Post('name')
  create(@GetUser('id') id: number, @Body() name: Brand) {
    return this.brandService.createBrand(id, name.name);
  }

  @Get('all')
  getAllBrands(
    @GetUser('id') userId: number,
    @Query('limit') limit: string = '10',
    @Query('page') page: string = '0',
  ) {
    console.log(limit, page);
    return this.brandService.getAllBrands(
      userId,
      parseInt(limit),
      parseInt(page),
    );
  }
}
