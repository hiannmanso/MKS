export interface UserBody extends SignInBody {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface SignInBody {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
}
