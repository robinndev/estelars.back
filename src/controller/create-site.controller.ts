import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFiles,
  UseInterceptors,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateSiteDto } from 'src/dtos/create-site';
import { CreateSiteService } from 'src/services/create-site.service';
import { StripeService } from 'src/services/stripe.service';

@Controller('site')
export class CreateSiteController {
  constructor(
    private readonly createSiteService: CreateSiteService,
    private readonly stripeService: StripeService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('photos', 10, { storage: memoryStorage() }))
  async create(
    @Body() createSiteDto: CreateSiteDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      // 1️⃣ Cria site em draft
      const site = await this.createSiteService.createDraft(
        createSiteDto,
        files,
      );

      // 2️⃣ Cria Stripe Checkout Session
      const { url: checkoutUrl } =
        await this.stripeService.createCheckoutSession(
          site.plan_price,
          site.id,
        );

      // 3️⃣ Retorna site + URL do Checkout pro frontend
      return { site, checkoutUrl };
    } catch (error) {
      console.error('CreateSiteController Error:', error);
      if (error.code === 'P2002' || error.code === 'P2016') {
        throw new BadRequestException('Dados duplicados ou inválidos.');
      }
      throw new InternalServerErrorException(
        error.message || 'Erro ao criar site.',
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const site = await this.createSiteService.findOne(id);
      if (!site) {
        throw new BadRequestException('Site não encontrado');
      }
      return { site, message: 'Site retrieved successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Erro ao buscar site.',
      );
    }
  }
}
