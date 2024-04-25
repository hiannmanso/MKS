import { FilmBody } from './film.interface';

export interface CategoryBody {
  id?: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryPostBody extends CategoryBody {
  films: { id: number }[];
}
export interface CategoryBodyWithFilms extends CategoryBody {
  films: FilmBody[];
}
export interface DeleteBody {
  raw: any[];
  affected?: number;
}
