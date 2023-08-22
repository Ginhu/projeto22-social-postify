import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  text: string;
}
