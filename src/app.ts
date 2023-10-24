import Server from './startup/bootstrap';
import { config } from './utils/config';

const server = new Server(config.APP_NAME, config.HOST, config.PORT);
server.start();
