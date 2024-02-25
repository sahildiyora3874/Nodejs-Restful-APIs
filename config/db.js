const { Pool, Client } = require('pg');
const Sequelize = require('sequelize');

const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'nodejs-instagram',
  password: '697071',
  port: 5432,
};

const pool = new Pool(dbConfig);
const client = new Client(dbConfig);

client.connect()
  .then(() => console.log('Db connected Successfully!'))
  .catch((e) => console.error('Db connection Failed', e));

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'postgres',
  logging: false,
});

sequelize.authenticate()
  .then(() => {
    console.log('Sequelize connection has been successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {
  sequelize: sequelize,
  pool:pool,
  client: client,
};

