import { IsString, IsInt, MaxLength } from 'class-validator';

export class MovieSchema {
  @IsString()
  @MaxLength(120)
  title: string;

  @IsString()
  @MaxLength(120)
  genre: string;

  @IsString()
  @MaxLength(120)
  duration: string;

  @IsInt()
  year: number;
}
