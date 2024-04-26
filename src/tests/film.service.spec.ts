import { Test, TestingModule } from '@nestjs/testing';
import { FilmService } from '../services/film.service';
import { FilmRepository } from '../repositories/film.repository';
import { CategoryRepository } from '../repositories/category.repository';
import {
  FilmBodyResponse,
  FilmBodyWithCategories,
} from '../interfaces/film.interface';
import { FilmDto } from '../schemas/film.schema';

const mockFilmRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockCategoryRepository = {
  findByName: jest.fn(),
};

describe('FilmService', () => {
  let service: FilmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmService,
        { provide: FilmRepository, useValue: mockFilmRepository },
        { provide: CategoryRepository, useValue: mockCategoryRepository },
      ],
    }).compile();

    service = module.get<FilmService>(FilmService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all films', async () => {
    const mockFilms: FilmBodyWithCategories[] = [
      {
        id: 1,
        name: 'Film A',
        author: 'Author A',
        synopsis: 'Synopsis A',
        year: 2000,
        categories: [],
      },
      {
        id: 2,
        name: 'Film B',
        author: 'Author B',
        synopsis: 'Synopsis B',
        year: 2005,
        categories: [],
      },
    ];

    mockFilmRepository.findAll.mockResolvedValue(mockFilms);

    const result = await service.findAll();

    expect(result).toEqual(mockFilms);
    expect(mockFilmRepository.findAll).toHaveBeenCalled();
  });

  it('should find film by id', async () => {
    const filmId = '1';
    const mockFilm: FilmBodyWithCategories = {
      id: 1,
      name: 'Film A',
      author: 'Author A',
      synopsis: 'Synopsis A',
      year: 2000,
      categories: [],
    };

    mockFilmRepository.findById.mockResolvedValue(mockFilm);

    const result = await service.findById(filmId);

    expect(result).toEqual(mockFilm);
    expect(mockFilmRepository.findById).toHaveBeenCalledWith(filmId);
  });

  it('should create a new film', async () => {
    const newFilm: FilmDto = {
      name: 'New Film',
      author: 'New Author',
      synopsis: 'New Synopsis',
      year: 2022,
      categories: [{ id: 1 }, { id: 2 }],
    };
    const createdFilm: FilmBodyResponse = { id: 1, ...newFilm, categories: [] };

    mockFilmRepository.findByName.mockResolvedValue(null);
    mockFilmRepository.create.mockResolvedValue(createdFilm);

    const result = await service.create(newFilm);

    expect(result).toEqual(createdFilm);
    expect(mockFilmRepository.findByName).toHaveBeenCalledWith(newFilm.name);
    expect(mockFilmRepository.create).toHaveBeenCalledWith(newFilm);
  });

  it('should update an existing film', async () => {
    const filmId = '1';
    const updatedFilm: FilmDto = {
      name: 'Updated Film',
      author: 'Updated Author',
      synopsis: 'Updated Synopsis',
      year: 2023,
      categories: [{ id: 1 }, { id: 3 }],
    };

    const mockExistingFilm: FilmBodyWithCategories = {
      id: 1,
      name: 'Film A',
      author: 'Author A',
      synopsis: 'Synopsis A',
      year: 2000,
      categories: [],
    };

    mockFilmRepository.findById.mockResolvedValue(mockExistingFilm);
    mockFilmRepository.update.mockResolvedValue(updatedFilm);

    const result = await service.update(filmId, updatedFilm);

    expect(result).toEqual(updatedFilm);
    expect(mockFilmRepository.findById).toHaveBeenCalledWith(filmId);
    expect(mockFilmRepository.update).toHaveBeenCalledWith(filmId, updatedFilm);
  });

  it('should delete an existing film', async () => {
    const filmId = '1';
    const deleteBody = { raw: [], affected: 1 };

    const mockExistingFilm: FilmBodyWithCategories = {
      id: 1,
      name: 'Film A',
      author: 'Author A',
      synopsis: 'Synopsis A',
      year: 2000,
      categories: [],
    };

    mockFilmRepository.findById.mockResolvedValue(mockExistingFilm);
    mockFilmRepository.delete.mockResolvedValue(deleteBody);

    const result = await service.delete(filmId);

    expect(result).toEqual(deleteBody);
    expect(mockFilmRepository.findById).toHaveBeenCalledWith(filmId);
    expect(mockFilmRepository.delete).toHaveBeenCalledWith(filmId);
  });
});
