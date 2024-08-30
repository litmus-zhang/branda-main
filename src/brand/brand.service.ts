import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GetBrandDto, GetBrandStrategyDto } from './dto';
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
  async getBrandLogo(dto: GetBrandDto): Promise<ResponseStatus> {
    try {
      const { data } = await axios.get(
        this.config.get('BRANDA_CORE_URL') + '/logo',
        { params: dto },
      );

      return {
        message: 'Brand logos fetched successfully',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getBrandColor(dto: GetBrandDto): Promise<ResponseStatus> {
    try {
      const { data } = await axios.get(
        this.config.get('BRANDA_CORE_URL') + '/color',
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
  async getBrandStrategy(dto: GetBrandStrategyDto): Promise<ResponseStatus> {
    try {
      const { data } = await axios.get(
        this.config.get('BRANDA_CORE_URL') + '/strategy',
        { params: dto },
      );
      console.log(data);

      return {
        message: 'Brand strategies fetched successfully',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getBrandFont(): Promise<ResponseStatus> {
    try {
      const { data } = await axios.get(
        this.config.get('BRANDA_CORE_URL') + '/font',
      );

      return {
        message: 'Brand fonts fetched successfully',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getBrandMessaging(dto: GetBrandDto): Promise<ResponseStatus> {
    try {
      // get the brand messaging using the dto from grpc/REST/message queue
      // return the brand names

      const { data } = await axios.get(
        this.config.get('BRANDA_CORE_URL') + '/messaging',
        { params: dto },
      );

      return {
        message: 'Brand messaging fetched successfully',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getBrandPhotography(industry: string): Promise<ResponseStatus> {
    try {
      // get the brand messaging using the dto from grpc/REST/message queue
      // return the brand names

      const { data } = await axios.get(
        this.config.get('BRANDA_CORE_URL') + '/messaging',
        { params: { industry } },
      );

      return {
        message: 'Brand messaging fetched successfully',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getBrandPattern(industry: string): Promise<ResponseStatus> {
    try {
      const { data } = await axios.get(
        this.config.get('BRANDA_CORE_URL') + '/pattern',
        {
          params: {
            industry,
          },
        },
      );

      return {
        message: 'Brand patterns fetched successfully',
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
  async createPhotography(
    userId: number,
    brandId: string,
    photography: string,
  ): Promise<ResponseStatus> {
    try {
      // create a new pattern in the brand table
      // return the success message
      console.log(photography);
      await this.Brand.query()
        .findById(brandId)
        .patch({
          photography: {
            primary: photography,
          },
        });

      return {
        message: 'Brand photography created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async createPattern(
    userId: number,
    brandId: string,
    pattern: string,
  ): Promise<ResponseStatus> {
    try {
      // create a new pattern in the brand table
      // return the success message
      await this.Brand.query().findById(brandId).patch({
        pattern,
      });

      return {
        message: 'Brand pattern created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async createStrategy(
    userId: number,
    brandId: string,
    strategy: string,
  ): Promise<ResponseStatus> {
    try {
      // create a new pattern in the brand table
      // return the success message
      await this.Brand.query()
        .findById(brandId)
        .patch({
          strategy: {
            primary: strategy,
          },
        });

      return {
        message: 'Brand strategy created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async createColor(
    userId: number,
    brandId: string,
    color: string,
  ): Promise<ResponseStatus> {
    try {
      // create a new pattern in the brand table
      // return the success message
      await this.Brand.query()
        .findById(brandId)
        .patch({
          colorPallete: {
            primary: color,
          },
        });

      return {
        message: 'Brand color created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async createFont(
    userId: number,
    brandId: string,
    font: string,
  ): Promise<ResponseStatus> {
    try {
      // create a new pattern in the brand table
      // return the success message
      await this.Brand.query()
        .findById(brandId)
        .patch({
          fonts: {
            primary: font,
          },
        });

      return {
        message: 'Brand font created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async createLogo(
    userId: number,
    brandId: string,
    logo_url: string,
  ): Promise<ResponseStatus> {
    try {
      // create a new pattern in the brand table
      // return the success message
      await this.Brand.query().findById(brandId).patch({
        logo: logo_url,
      });

      return {
        message: 'Brand logo created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async createMessaging(
    userId: number,
    brandId: string,
    messaging: string,
  ): Promise<ResponseStatus> {
    try {
      // create a new pattern in the brand table
      // return the success message
      await this.Brand.query().findById(brandId).patch({
        messaging,
      });

      return {
        message: 'Brand messaging created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
