import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiRoutesModule } from './router/routes/api-routes.module';

export async function swaggerInit(app: NestApplication) {
  /* Admin Router Document Build and setup*/
  const adminRouterDocumentBuild = new DocumentBuilder()
    .setTitle('Chat App API Documentation')
    .setDescription('This is the API documentation for the chat app.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const apiRouterDocument = SwaggerModule.createDocument(
    app,
    adminRouterDocumentBuild,
    {
      deepScanRoutes: true,
      include: [ApiRoutesModule],
    },
  );

  SwaggerModule.setup('api-docs/admin', app, apiRouterDocument, {
    customSiteTitle: 'Chat App Backend - Admin',
    swaggerOptions: {
      tagsSorter: (a: string, b: string) => {
        if (a === 'Authentication') return -100;
        if (b === 'Authentication') return 100;

        return a > b ? 1 : -1;
      },
      docExpansion: false,
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
    },
  });
}
