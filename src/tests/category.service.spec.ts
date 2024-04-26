import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../services/category.service';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryPostBody, DeleteBody } from '../interfaces/category.interface';
// import { CategoryDto } from 'src/schemas/category.schema';

// Mock do CategoryRepository para simular o comportamento do repositório
const mockCategoryRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: CategoryRepository, useValue: mockCategoryRepository },
        { provide: 'RedisClient', useValue: null }, // Fornecer um valor nulo para o cliente Redis
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all categories when Redis is offline', async () => {
    const mockCategories = [
      { id: 1, name: 'Category A', description: 'Desc A', films: [] },
    ];
    mockCategoryRepository.findAll.mockResolvedValue(mockCategories);

    const result = await service.findAll();

    expect(result).toEqual(mockCategories);
    expect(mockCategoryRepository.findAll).toHaveBeenCalled();
  });

  it('should find category by id', async () => {
    const categoryId = '1';
    const mockCategory = {
      id: categoryId,
      name: 'Category A',
      description: 'Desc A',
      films: [],
    };
    mockCategoryRepository.findById.mockResolvedValue(mockCategory);

    const result = await service.findById(categoryId);

    expect(result).toEqual(mockCategory);
    expect(mockCategoryRepository.findById).toHaveBeenCalledWith(categoryId);
  });

  it('should create a new category', async () => {
    const newCategory: CategoryPostBody = {
      name: 'New Category',
      description: 'New Desc',
      films: [],
    };
    const createdCategory: CategoryPostBody = { id: 1, ...newCategory };

    // Simulando que não existe categoria com o mesmo nome
    mockCategoryRepository.findByName.mockResolvedValue(null);
    mockCategoryRepository.create.mockResolvedValue(createdCategory);

    const result = await service.create(newCategory);

    expect(result).toEqual(createdCategory);
    // expect(mockCategoryRepository.findByName).toHaveBeenCalledWith(
    //   newCategory.name,
    // );
    // expect(mockCategoryRepository.create).toHaveBeenCalledWith(newCategory);
    // Aqui você pode adicionar mais expectativas, como verificar chamadas de métodos do Redis
  });
  it('should update an existing category', async () => {
    const categoryId = '1';
    const updatedCategory: CategoryPostBody = {
      id: Number(categoryId),
      name: 'Updated Category',
      description: 'Updated Desc',
      films: [],
    };

    mockCategoryRepository.findById.mockResolvedValue({ id: categoryId });
    mockCategoryRepository.update.mockResolvedValue(updatedCategory);

    const result = await service.update(categoryId, updatedCategory);

    expect(result).toEqual(updatedCategory);
  });

  it('should delete an existing category', async () => {
    const categoryId = '1';
    const deletedCategory: DeleteBody = { raw: [], affected: 1 };

    mockCategoryRepository.findById.mockResolvedValue({ id: categoryId }); // Simula que a categoria existe
    mockCategoryRepository.delete.mockResolvedValue(deletedCategory);

    const result = await service.delete(categoryId);

    expect(result).toEqual(deletedCategory);
  });
});
