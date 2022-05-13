const defaultConfiguration = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_history',
  migrationsRun: true,
  cli: {
    migrationsDir: 'migrations',
  },
};

const development = {
  type: 'postgres',
  database: 'db',
  password: 'root',
  username: 'root',
  host: 'localhost',
  port: 5432,
  ...defaultConfiguration,
};

const test = {
  type: 'sqlite',
  database: 'test.sqlite',
  entities: ['**/*.entity.ts'],
  ...defaultConfiguration,
};

const production = {};

const dbConfiguration = {
  development,
  test,
  production,
}[process.env.NODE_ENV];

module.exports = dbConfiguration;
