import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  public supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!, // Project URL do Supabase
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service Role Key do Supabase
    );
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'sites',
  ): Promise<string> {
    // Caminho no bucket
    const filePath = `${folder}/${Date.now()}_${file.originalname}`;

    // Upload do arquivo
    const { data, error } = await this.supabase.storage
      .from('couple-media') // nome do bucket
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error('Erro ao enviar arquivo para Supabase');
    }

    // Gerar URL pública
    const { data: publicData } = this.supabase.storage
      .from('couple-media')
      .getPublicUrl(filePath);

    if (!publicData?.publicUrl) {
      console.error('Supabase public URL error');
      throw new Error('Erro ao gerar URL do arquivo');
    }

    return publicData.publicUrl;
  }
}
