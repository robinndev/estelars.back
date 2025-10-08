import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateSiteDto } from 'src/dtos/create-site';
import { SupabaseService } from './supabase.service';
import { StripeService } from './stripe.service';

@Injectable()
export class CreateSiteService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
    private stripeService: StripeService, // ✅ injetado
  ) {}

  async create(createSiteDto: CreateSiteDto, files: Express.Multer.File[]) {
    try {
      // 1️⃣ Upload das fotos no Supabase
      const photos = files?.length
        ? await Promise.all(
            files.map(async (file) => {
              const url = await this.supabaseService.uploadFile(file, 'sites');
              return { url, file_id: file.originalname };
            }),
          )
        : [];

      // 2️⃣ Criação do site no Prisma
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

      // 3️⃣ Criação do PaymentIntent no Stripe
      const paymentIntent = await this.stripeService.createPaymentIntent(
        site.plan_price,
        'usd', // moeda, ajuste conforme necessidade
      );

      // 4️⃣ Retornar site + paymentIntent
      return { site, paymentIntent };
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
