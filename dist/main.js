"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`\n🚀 Bond API running at: http://localhost:${port}/api`);
    console.log(`📋 Endpoints:`);
    console.log(`   POST   /api/bond        → Calculate + save`);
    console.log(`   GET    /api/bond        → List all history`);
    console.log(`   GET    /api/bond/:id    → Get single record`);
    console.log(`   PATCH  /api/bond/:id    → Update + recalculate`);
    console.log(`   DELETE /api/bond/:id    → Delete one`);
    console.log(`   DELETE /api/bond        → Clear all\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map