import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GetBrandDto } from './dto';
import { ResponseStatus } from 'utils/ResponseStatus';
import { BrandModel } from 'src/database/entities';
import { ModelClass } from 'objection';
@Injectable()
export class BrandService {
  constructor(@Inject('BrandModel') private Brand: ModelClass<BrandModel>) {}

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
  async getBrandName(dto: GetBrandDto): Promise<ResponseStatus> {
    // get the brand name using the dto from grpc
    // return the brand name
    console.log(dto);
    return {
      message: 'Brand names fetched successfully',
      data: ['Brand 1'],
    };
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
