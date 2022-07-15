import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class MovieModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({ type: String, description: 'genre' })
  genre: string;

  @Column()
  @ApiProperty({ type: String, description: 'title' })
  title: string;

  @Column()
  @ApiProperty({ type: String, description: 'duration' })
  duration: string;

  @Column()
  @ApiProperty({ type: Number, description: 'year' })
  year: number;
}
