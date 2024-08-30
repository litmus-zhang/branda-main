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
    @Body() pattern: string,
  ) {
    return this.brandService.createPattern(id, brandId, pattern);
  }

  @Post(':id/photography')
  createPhoto(
    @GetUser('id') id: number,
    @Param('id') brandId: string,
    @Body() photography: string,
  ) {
    return this.brandService.createPhotography(id, brandId, photography);
  }

  @Post(':id/strategy')
  createStrategy(
    @GetUser('id') id: number,
    @Param('id') brandId: string,
    @Body() strategy: string,
  ) {
    return this.brandService.createStrategy(id, brandId, strategy);
  }

  @Post(':id/color')
  createColor(
    @GetUser('id') id: number,
    @Param('id') brandId: string,
    @Body() color: string,
  ) {
    return this.brandService.createColor(id, brandId, color);
  }

  @Post(':id/font')
  createFont(
    @GetUser('id') id: number,
    @Param('id') brandId: string,
    @Body() font: string,
  ) {
    return this.brandService.createFont(id, brandId, font);
  }

  @Post(':id/logo')
  createLogo(
    @GetUser('id') id: number,
    @Param('id') brandId: string,
    @Body() logo_url: string,
  ) {
    return this.brandService.createLogo(id, brandId, logo_url);
  }

  @Post(':id/messaging')
  createMessaging(
    @GetUser('id') id: number,
    @Param('id') brandId: string,
    @Body() messaging: string,
  ) {
    return this.brandService.createMessaging(id, brandId, messaging);
  }
}
