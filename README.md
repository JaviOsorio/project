# BarberConnect

BarberConnect es un backend SaaS multiempresa para gestión de barberías construido con NestJS, TypeORM y PostgreSQL.

## Requisitos

- Node.js 22+
- Docker y Docker Compose
- PostgreSQL 16+

## Instalación

```bash
npm install
cp .env.example .env
```

## Desarrollo

```bash
npm run start:dev
```

## Migraciones

```bash
npm run migration:run
```

## Seed de roles

```bash
npm run seed:roles
```

## Swagger

La documentación queda disponible en:

```text
/api/docs
```

## Postman

Importa estos archivos desde `postman/`:

- `BarberConnect.postman_collection.json`
- `BarberConnect.postman_environment.json`

## Docker

```bash
docker compose up --build
```
