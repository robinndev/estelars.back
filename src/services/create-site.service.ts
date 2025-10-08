import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateSiteDto } from 'src/dtos/create-site';
import { Prisma } from '@prisma/client';
import { SupabaseService } from './supabase.service';

@Injectable()
export class CreateSiteService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async create(createSiteDto: CreateSiteDto, files: Express.Multer.File[]) {
    try {
      const photos = files?.length
        ? await Promise.all(
            files.map(async (file) => {
              const url = await this.supabaseService.uploadFile(file, 'sites');
              return { url, file_id: file.originalname };
            }),
          )
        : [];

      const site = await this.prisma.site.create({
        data: {
          couple_name: createSiteDto.couple_name,
          date: new Date(createSiteDto.date),
          time: createSiteDto.time,
          message: createSiteDto.message,
          color: createSiteDto.color,
          music: createSiteDto.music,
          plan_id: createSiteDto.plan_id,
          plan_price: Number(createSiteDto.plan_price),
          photos: photos.length ? { create: photos } : undefined,
        },
        include: { photos: true },
      });

      return site;
    } catch (error) {
      console.error('CreateSiteService Error:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    return this.prisma.site.findUnique({
      where: { id },
      include: { photos: true, videos: true },
    });
  }
}
