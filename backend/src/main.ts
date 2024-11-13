import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from "cors"

export interface CorsOptions { 

}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Permite todas as origens
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permite os métodos HTTP necessários
    allowedHeaders: 'Content-Type, Accept', // Permite os cabeçalhos necessários
  })

  await app.listen(3001);
}
bootstrap();
