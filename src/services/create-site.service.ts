import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateSiteDto } from 'src/dtos/create-site';
import { SupabaseService } from './supabase.service';
import { randomBytes } from 'crypto';
import { EmailService } from './email.service';
import * as QRCode from 'qrcode';
import { sitePaidTemplate } from 'src/templates/qrcode-email';

function generatePublicKey(coupleName: string) {
  const slug = coupleName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const randomSuffix = randomBytes(2).toString('hex'); // ex: "a3f2"
  return `${slug}-${randomSuffix}`;
}

@Injectable()
export class CreateSiteService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
    private emailService: EmailService,
  ) {}

  // Cria o site em draft
  async createDraft(
    createSiteDto: CreateSiteDto,
    files: Express.Multer.File[],
  ) {
    try {
      // 1️⃣ Upload das fotos pro Supabase
      const photos = files?.length
        ? await Promise.all(
            files.map(async (file) => ({
              url: await this.supabaseService.uploadFile(file, 'sites'),
              file_id: file.originalname,
            })),
          )
        : [];

      const publicKey = generatePublicKey(createSiteDto.couple_name);

      const site = await this.prisma.site.create({
        data: {
          couple_name: createSiteDto.couple_name,
          public_key: publicKey,
          date: new Date(createSiteDto.date),
          time: createSiteDto.time,
          message: createSiteDto.message,
          color: createSiteDto.color,
          music: createSiteDto.music,
          plan_id: createSiteDto.plan_id,
          plan_price: Number(createSiteDto.plan_price),
          state: 'draft',
          photos: photos.length ? { create: photos } : undefined,
          email_address: createSiteDto.email,
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

  async markAsPaid(siteId: string) {
    const site = await this.prisma.site.findUnique({
      where: { id: siteId },
    });

    console.log('Marking site as paid:', siteId, site);

    if (!site) throw new Error('Site not found');

    const siteUrl = `${process.env.FRONT_URL}/site/${site.public_key}`;
    const qrCodeBase64 = await QRCode.toDataURL(siteUrl);

    console.log('Sending email to:', site.email_address);

    await this.emailService.sendMail(
      site.email_address,
      'Seu site de casamento está pronto! 💍',
      sitePaidTemplate(site.couple_name, siteUrl, qrCodeBase64),
    );

    return this.prisma.site.update({
      where: { id: siteId },
      data: { state: 'paid' },
    });
  }
}
