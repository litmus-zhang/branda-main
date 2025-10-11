import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ResponseStatus } from 'utils/ResponseStatus';
import { BrandModel } from 'src/database/entities';
import { ModelClass } from 'objection';
import { ConfigService } from '@nestjs/config';
import { paginate } from '../../utils/paginator';

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
  async getAllBrands(
    userId,
    limit: number,
    page: number,
  ): Promise<ResponseStatus> {
    if (page < 1) {
      page = 1;
    }
    const data = await paginate(
      this.Brand.query().where('createdBy', userId),
      page,
      limit,
    );
    return {
      message: 'Brands fetched successfully',
      data,
    };
  }
  async getBrandById(userId, id: string): Promise<ResponseStatus> {
    try {
      const brand = await this.Brand.query()
        .where('createdBy', userId)
        .findById(id);
      return {
        message: 'Brand fetched successfully',
        data: brand,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async deleteOneBrandById(userId, id: string): Promise<ResponseStatus> {
    try {
      await this.Brand.query().deleteById(id).where({
        createdBy: userId,
      });
      return {
        message: 'Brand deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
