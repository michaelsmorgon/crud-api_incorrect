import { createServer } from 'http';
import 'dotenv/config';
import { controller } from './controller/controller';

const PORT = process.env.PORT || 4001;

export const server = createServer(controller());

server.listen(PORT, () => {
  console.log(
    `Server started on port: ${PORT}`
  );
});
