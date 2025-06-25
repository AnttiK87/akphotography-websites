// Start point of the application

// Dependencies
import app from './app.js';
import { PORT } from './utils/config.js';
import logger from './utils/logger.js';

// Start the server and log the message once it's running
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
