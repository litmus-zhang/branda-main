import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Param,
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
    @Query('page') page: string = '0',
  ) {
    return this.brandService.getAllBrands(
      userId,
      parseInt(limit),
      parseInt(page),
    );
  }

  @Get('name')
  getBrandName(
    @Query('niche') niche: string,
    @Query('industry') industry: string,
  ) {
    return this.brandService.getBrandNames({ niche, industry });
  }
  @Get('logo')
  getBrandLogo(
    @Query('niche') niche: string,
    @Query('industry') industry: string,
  ) {
    return this.brandService.getBrandLogo({ niche, industry });
  }

  @Get('patterns')
  getBrandPattern(@Query('industry') industry: string) {
    return this.brandService.getBrandPattern(industry);
  }

  @Get('messaging')
  getBrandMessaging(
    @Query('niche') niche: string,
    @Query('industry') industry: string,
  ) {
    return this.brandService.getBrandMessaging({ niche, industry });
  }
  @Get('color')
  getBrandColor(
    @Query('niche') niche: string,
    @Query('industry') industry: string,
  ) {
    return this.brandService.getBrandColor({ niche, industry });
  }
  @Get('fonts')
  getBrandFront() {
    return this.brandService.getBrandFont();
  }
  @Get('strategy')
  getBrandStrategy(
    @Query('niche') niche: string,
    @Query('industry') industry: string,
    @Query('country') country: string,
  ) {
    return this.brandService.getBrandStrategy({ niche, industry, country });
  }

  @Post('name')
  createBrand(@GetUser('id') id: number, @Body() name: Brand) {
    return this.brandService.createBrand(id, name.name);
  }
  @Get(':id')
  getOneBrand(@GetUser('id') userId: number, @Param('id') brandId: string) {
    return this.brandService.getBrandById(userId, brandId);
  }
  @Post(':id/pattern')
  createPattern(
    @GetUser('id') id: number,
    @Param('id') brandId: string,
    @Body() dto: Brand,
  ) {
    return this.brandService.createPattern(id, brandId, dto.pattern);
  }

  @Post(':id/photography')
  createPhoto(
    @GetUser('id') id: number,
    @Param('id') brandId: string,
    @Body() dto: Brand,
  ) {
    return this.brandService.createPhotography(id, brandId, dto.photography);
  }

  @Post(':id/strategy')
  createStrategy(
    @GetUser('id') id: number,
    @Param('id') brandId: string,
    @Body() dto: Brand,
  ) {
    return this.brandService.createStrategy(id, brandId, dto.strategy);
  }

  @Post(':id/color')
  createColor(
    @GetUser('id') id: number,
    @Param('id') brandId: string,
    @Body() dto: Brand,
  ) {
    return this.brandService.createColor(id, brandId, dto.color_pallette);
  }

  @Post(':id/font')
  createFont(
    @GetUser('id') id: number,
    @Param('id') brandId: string,
    @Body() dto: Brand,
  ) {
    return this.brandService.createFont(id, brandId, dto.fonts);
  }

  @Post(':id/logo')
  createLogo(
    @GetUser('id') id: number,
    @Param('id') brandId: string,
    @Body() dto: Brand,
  ) {
    return this.brandService.createLogo(id, brandId, dto.logo);
  }

  @Post(':id/messaging')
  createMessaging(
    @GetUser('id') id: number,
    @Param('id') brandId: string,
    @Body() dto: Brand,
  ) {
    return this.brandService.createMessaging(id, brandId, dto.messaging);
  }
}
