import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieModel } from '../models/movie.model';
@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieModel)
    private movieRepository: Repository<MovieModel>,
  ) {}

  findAll(): Promise<MovieModel[]> {
    return this.movieRepository.find();
  }

  findOne(id: any): Promise<MovieModel> {
    return this.movieRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.movieRepository.delete(id);
  }
}
