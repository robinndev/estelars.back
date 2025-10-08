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

@Controller('site')
export class CreateSiteController {
  constructor(private readonly createSiteService: CreateSiteService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('photos', 10, { storage: memoryStorage() }))
  async create(
    @Body() createSiteDto: CreateSiteDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      console.log(createSiteDto);

      return await this.createSiteService.create(createSiteDto, files);
    } catch (error) {
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
