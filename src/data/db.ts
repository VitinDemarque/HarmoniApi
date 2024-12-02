import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config(); 
//vitin: aqui ele vai carregar as variaveis para o process

export const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
});
