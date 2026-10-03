import app from './app.js';

const port = Number(process.env.PORT) || 5000;

const server = app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${port} is already in use.\nStop the existing process or change PORT in .env.`
    );
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});
