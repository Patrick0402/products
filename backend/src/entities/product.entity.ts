import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string; 
  
  @Column({ type: 'int' })
  quantity_in_stock: number;

  @Column('decimal')
  price: number;

  @Column({ type: 'text', nullable: true })
  category?: string;

  @Column({ type: 'boolean', default: true })
  isActive?: boolean;

}
