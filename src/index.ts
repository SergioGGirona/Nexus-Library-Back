import createDebug from 'debug';
import 'dotenv/config';
import { createServer } from 'http';
import { app } from './app.js';
import { dbConnect } from './db/database.connect.js';

const debug = createDebug('Nexus: Index');

const PORT = process.env.PORT ?? 7373;

const server = createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('Connected to DB', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    server.emit('error', error);
    debug('Error in the conection of db');
  });

server.on('listening', () => {
  console.log(`Listening on port ${PORT}`);
});

server.on('error', (error) => {
  console.log(`Error en Index: ${error.message}`);
});
