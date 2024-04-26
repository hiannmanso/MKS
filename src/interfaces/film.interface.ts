import { CategoryBody } from './category.interface';
export interface FilterOptions {
  author?: string;
  name?: string;
  year?: number;
}
export interface FilmBody {
  id?: number;
  name: string;
  author: string;
  synopsis: string;
  year: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface FilmBodyResponse extends FilmBody {
  categories: { id: number }[];
}
export interface FilmBodyWithCategories extends FilmBody {
  categories: CategoryBody[];
}
