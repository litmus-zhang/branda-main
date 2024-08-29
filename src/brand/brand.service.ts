import { Injectable } from '@nestjs/common';
import { GetBrandDto } from './dto';
import { ResponseStatus } from 'utils/ResponseStatus';

@Injectable()
export class BrandService {
  async createBrand(name: string): Promise<ResponseStatus> {
    // get list of brands using the dto
    // choose one of the brands
    // create a new brand in the brand table
    // return the sucess nessage and the brand ID
    console.log(name);
    return {
      message: 'Brand `created` successfully',
      data: {
        brandID: 1,
      },
    };
  }
  async getBrandName(dto: GetBrandDto): Promise<ResponseStatus> {
    // get the brand name using the dto
    // return the brand name
    console.log(dto);
    return {
      message: 'Brand name retrieved successfully',
      data: {
        brandName: 'Brand 1',
      },
    };
  }
}
