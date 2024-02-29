import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import process from 'node:process';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';

import { startDbConnection } from './shared/database/models/index.js'
import serviceAccount from './shopot-e12ae-firebase-adminsdk-au601-a7c7bbdb73.json' assert { type: 'json' };
import { authRouter } from './routes/auth.route.js';

import DbPopulate from './shared/database/db.js';



const app = express();
const server = http.createServer(app);

app.use(bodyParser.json({ limit: '35mb' }));

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '35mb',
    parameterLimit: 50000,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/api/auth/', authRouter);

const start = async () => {
  try {
    await startDbConnection();
        const mode = process.env.MODE?.trim();
        if (mode === 'gFull') await DbPopulate.generateTables();

    if (admin?.apps?.length === 0) { // Проверка, не инициализирован ли уже экземпляр
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    server.listen(3001, async () => {
      console.log('Сервер запущен')
    });
  } catch (error) {
    console.log('Критическая ошибка при запуске', error);
  }
};

start();




// import * as dotenv from 'dotenv';
// import fs from 'fs';
// import https from 'https';
// import express from 'express';
// import process from 'node:process';
// import cors from 'cors';
// import DbPopulate from './database/db.js';
// import { startDbConnection } from './database/models/index.js';
// import indexRouter from './routes/index.js';
// import { startSocketServer } from './io/socketServer.js';

// import bodyParser from 'body-parser';

// dotenv.config();

// const app = express();


// const options = {
//   key: fs.readFileSync(process.env.CERT_KEY),
//   cert: fs.readFileSync(process.env.CERT_FULLCHAIN)
// };

// export const server = https.createServer(options, app);

// app.use(bodyParser.json({ limit: '35mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '35mb', parameterLimit: 50000 }));
// app.use(cors({ origin: true, credentials: true }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(indexRouter);

// const start = async () => {
//   try {
//     await startDbConnection();

//     const mode = process.env.MODE?.trim();
//     if (mode === 'gFull') await DbPopulate.generateTables();

//     server.listen(process.env.PORT, async () => {
//       startSocketServer(server);
//     });
//   } catch (error) {
//   }
// };

// start();