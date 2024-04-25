import { Module } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';

@Module({
  imports: [], // Importe outros módulos, se necessário
  providers: [CategoryRepository], // Inclua o CategoryRepository como um provedor
})
export class RootTestModule {}
