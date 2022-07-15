import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from '../services/movie.service';
import { MovieController } from '../controllers/movie.controller';
import { MovieModel } from '../models/movie.model';
@Module({
  imports: [TypeOrmModule.forFeature([MovieModel])],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
