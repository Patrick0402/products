import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Cria um novo produto
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  // Retorna todos os produtos
  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  // Retorna um produto específico pelo ID
  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } });
  }

  // Atualiza um produto específico pelo ID
  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id); // Retorna o produto atualizado
  }

  // Remove um produto específico pelo ID
  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
