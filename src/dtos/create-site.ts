import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateSiteDto {
  @IsString()
  couple_name: string;

  @IsDateString()
  date: string; // recebe string ISO

  @IsString()
  time: string;

  @IsString()
  message: string;

  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  music?: string;

  @IsString()
  plan_id: string;

  @IsNumber()
  plan_price: number;

  @IsString()
  email: string;
}
