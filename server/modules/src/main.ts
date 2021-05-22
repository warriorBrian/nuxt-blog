import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {IoAdapter} from '@nestjs/platform-socket.io';
import * as helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app.useWebSocketAdapter(new IoAdapter(app));
  app.setGlobalPrefix('/api');
  // 静态资源地址，图片文件等
  app.useStaticAssets('uploads', { prefix: '/static' });
  // 渲染页面路径
  app.useStaticAssets('public', { prefix: '/' });
  app.use(helmet());
  await app.listen(3000);
}
bootstrap();
