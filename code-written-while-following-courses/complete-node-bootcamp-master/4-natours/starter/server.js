import './env.js';
import { connect } from 'mongoose';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1); // Exit process with failure
});

import app from './app.js';

// CONNECT TO DATABASE
connect(process.env.DATABASE).then(() => {
  console.log('///_________________________ DB connection successful! _________________________///');
});

// START SERVER
const port = process.env.PORT || 420;
const server = app.listen(port, () => {
  console.log(`///                  Server is running http://localhost:${port}...                  ///`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection! 💥 Shutting down...');
  console.error(err );
  server.close(() => {
    process.exit(1); // Exit process with failure
  });
});
