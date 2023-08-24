import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicationDto } from './create-publication.dto';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {
  @IsNumber()
  @IsNotEmpty()
  mediaId: number;

  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
