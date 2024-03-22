import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'
import mercadopagoRoutes from './routes/mercadopagoRoutes.js'

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/productImages', express.static('productImages'));
dotenv.config();

app.use("/", userRoutes)
app.use("/mp", mercadopagoRoutes)

app.listen(port, () => {
  console.log(`Servidor escuchando en ${port}`);
});
