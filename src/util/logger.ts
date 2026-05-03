import pino, { Logger } from 'pino';
import prettifier from 'pino-pretty';

export let pinoLogger: Logger;

const initLogger = (enableLogging: boolean): Logger => {
  if (pinoLogger) return pinoLogger;

  return (pinoLogger = pino(
    {
      enabled: enableLogging,
    },
    prettifier({
      colorize: true,
      sync: true,
    }),
  ));
};

export default initLogger;
