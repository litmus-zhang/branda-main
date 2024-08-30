import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GetBrandDto } from './dto';
import { ResponseStatus } from 'utils/ResponseStatus';
import { BrandModel } from 'src/database/entities';
import { ModelClass } from 'objection';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class BrandService {
  constructor(
    @Inject('BrandModel') private Brand: ModelClass<BrandModel>,
    private config: ConfigService,
  ) {}

  async createBrand(userId: number, name: string): Promise<ResponseStatus> {
    try {
      const newBrand = await this.Brand.query().insert({
        name,
        createdBy: userId,
      });
      // create a new brand in the brand table
      // return the sucess nessage and the brand ID
      return {
        message: 'Brand created successfully',
        data: {
          brandID: newBrand.id,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getBrandNames(dto: GetBrandDto): Promise<ResponseStatus> {
    try {
      // get the brand name using the dto from grpc/REST/message queue
      // return the brand names

      const { data } = await axios.get(
        this.config.get('BRANDA_CORE_URL') + '/name',
        { params: dto },
      );

      return {
        message: 'Brand names fetched successfully',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllBrands(
    userId,
    limit: number,
    page: number,
  ): Promise<ResponseStatus> {
    const brands = await this.Brand.query()
      .where('createdBy', userId)
      .page(page, limit)
      .orderBy('updated_at', 'desc');
    brands['limit'] = limit;
    brands['page'] = page;
    return {
      message: 'Brands fetched successfully',
      data: brands,
    };
  }
}
