import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}));


// process.env
//       │
//       ▼
// database.config.ts
//       │
//       ▼
// ConfigService
//       │
//       ▼
// Whole application