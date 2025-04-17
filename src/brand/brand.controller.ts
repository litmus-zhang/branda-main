import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { GetUser } from '../auth/decorators';
import { JwtGuard } from '../auth/guards';
import { Brand } from './dto';

@UseGuards(JwtGuard)
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('all')
  getAllBrands(
    @GetUser('id') userId: number,
    @Query('limit') limit: string = '10',
    @Query('page') page: string = '1',
  ) {
    return this.brandService.getAllBrands(
      userId,
      parseInt(limit),
      parseInt(page),
    );
  }

  @Get(':id')
  getOneBrand(@GetUser('id') userId: number, @Param('id') brandId: string) {
    return this.brandService.getBrandById(userId, brandId);
  }
  @Delete(':id')
  deleteOneBrand(@GetUser('id') userId: number, @Param('id') brandId: string) {
    return this.brandService.deleteOneBrandById(userId, brandId);
  }
  @Post('new')
  createBrand(@GetUser('id') id: number, @Body() dto: Brand) {
    return this.brandService.createBrand(id, dto.name);
  }
}
