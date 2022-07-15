import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieModel } from '../models/movie.model';
import { MovieSchema } from '../schemas/movie.schema';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
@Controller('/movies')
export class MovieController {
  constructor(
    @InjectRepository(MovieModel) private model: Repository<MovieModel>,
  ) {}
  @Post()
  @ApiCreatedResponse({ description: 'Cria um novo filme' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({
    description: 'Bad Request possivelmente dados inseridos com o tipo errado',
  })
  @ApiBadGatewayResponse({ description: 'Bad Gateway' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBody({ type: MovieModel })
  public async create(@Body() body: MovieSchema): Promise<MovieModel> {
    return await this.model.save(body);
  }
  @Get()
  @ApiOkResponse({ description: 'Lista todos os filmes cadastrados' })
  @ApiNotFoundResponse({
    description: 'Not Found ou Não foi encontrado registros na base de dados.',
  })
  @ApiBadGatewayResponse({ description: 'Bad Gateway' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  public async getAll(): Promise<MovieModel | MovieModel[]> {
    const movies = await this.model.find();
    if (movies.length === 0)
      throw new NotFoundException('Não existem registos na base de dados.');
    return movies;
  }
  @Get(':id')
  @ApiOkResponse({ description: 'Pega um filme identificando-o pelo ID' })
  @ApiNotFoundResponse({
    description:
      'Not Found ou Não foi possivel encontrar o filme com ID especificado',
  })
  @ApiBadGatewayResponse({ description: 'Bad Gateway' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  public async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MovieModel> {
    const movie = await this.model.findOne({ where: { id } });
    if (!movie)
      throw new NotFoundException(`Filme com o id ${id} não encontrado.`);
    return movie;
  }
  @Put(':id')
  @ApiOkResponse({ description: 'Altera um filme' })
  @ApiNotFoundResponse({
    description:
      'Not Found ou Não foi possivel encontrar o filme com o ID especificado',
  })
  @ApiBadGatewayResponse({ description: 'Bad Gateway' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBody({ type: MovieModel })
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: MovieSchema,
  ): Promise<MovieModel> {
    // verifica se o filme existe
    await this.getOne(id);
    await this.model.update({ id }, body);
    return await this.getOne(id);
  }
  @Delete(':id')
  @ApiOkResponse({ description: 'Deleta um filme' })
  @ApiNotFoundResponse({
    description:
      'Not Found ou Não foi possivel encontrar o filme com o ID especificado',
  })
  @ApiBadGatewayResponse({ description: 'Bad Gateway' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<object> {
    // verificando se o filme existe
    const movie = await this.getOne(id);
    await this.model.delete(id);
    return {
      message: 'Excluido com sucesso.',
      'Filme excluido': movie,
    };
  }
  @Delete()
  @ApiNoContentResponse({
    description: 'Limpa base de dados (Exclui todos os filmes cadastrados)',
  })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadGatewayResponse({ description: 'Bad Gateway' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  public async deleteAll(): Promise<object> {
    const allMovies: any = await this.getAll();
    allMovies.forEach(async (movie) => {
      await this.delete(movie.id);
    });
    return {
      statusCode: 204,
      message: 'Todos os registros foram apagados',
    };
  }
}
