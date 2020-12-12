import express from 'express';
import routes from './routes';
import db from './app/models';
require('dotenv').config();


const app = express();

app.use(express.json());
app.use(routes);

db.sequelize.sync().then((req) => {
  app.listen(Number(process.env.APP_PORT));
});
