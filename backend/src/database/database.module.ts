import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            logging: true,
            url: "postgresql://postgres.roppmcevdknqpcifgkfh:2YN1IUxkEfz1QaNC@aws-0-us-west-1.pooler.supabase.com:6543/postgres",
            entities: [Product],
            synchronize: true,
        }),
    ],

})

export class DatabaseModule implements OnModuleInit {
    private readonly logger = new Logger(DatabaseModule.name);

    constructor(@InjectDataSource() private dataSource: DataSource) {}

    async onModuleInit() {
        try {
            // Verifica se a conexão está estabelecida corretamente
            this.logger.log('Database conectado');

            // Loga as entidades carregadas
            const entities = this.dataSource.entityMetadatas.map((entity) => entity.name);
            this.logger.log(`Entidades carregadas: ${entities.join(', ')}`);

            // Verifica se a tabela de Products existe e se está vazia
            const productRepository = this.dataSource.getRepository(Product);
            const count = await productRepository.count();

            if (count === 0) {
                this.logger.log('Tabela Products vazia, inserindo dados seed...');
                await this.seedProducts();
            }

        } catch (error) {
            this.logger.error('Erro na conexão com o database: ', error);
        }
    }

    // Método para inserir dados seed na tabela Product
    private async seedProducts() {
        const productRepository = this.dataSource.getRepository(Product);

        const products = [
            {
                name: 'Camiseta Básica',
                description: 'Camiseta de algodão com modelagem clássica.',
                quantity_in_stock: 100,
                price: 29.99,
                category: 'Roupas',
            },
            {
                name: 'Tênis Esportivo',
                description: 'Tênis para corrida, confortável e com alta durabilidade.',
                quantity_in_stock: 50,
                price: 199.99,
                category: 'Calçados',
            },
            {
                name: 'Mochila de Viagem',
                description: 'Mochila resistente e espaçosa, ideal para viagens.',
                quantity_in_stock: 30,
                price: 149.99,
                category: 'Acessórios',
            },
        ];

        // Inserindo os produtos seed
        await productRepository.save(products);
        this.logger.log('Produtos seed inseridos com sucesso!');
    }
}