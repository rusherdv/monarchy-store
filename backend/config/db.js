import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pkg;

const DATABASE_URL = process.env.DB_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar con PostgreSQL', err);
  } else {
    console.log('Conexión exitosa a PostgreSQL');
  }
});

export default pool;
