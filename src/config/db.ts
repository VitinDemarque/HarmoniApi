import knex from 'knex';

export const connect = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '12345',
    database: 'harmoniapi'
  }
});