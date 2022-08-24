import { IsString, IsNumberString, IsDateString, IsUrl, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsOptional()
  buttons?: string;

  @IsDateString()
  @IsOptional()
  start?: string;
}
