type LogMetadata = Record<string, string | number | boolean | null | undefined>;

function sanitize(metadata?: LogMetadata) {
  if (!metadata) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(metadata).filter(([key]) => !/secret|password|token|key/i.test(key)),
  );
}

export const logger = {
  info(message: string, metadata?: LogMetadata) {
    console.info(message, sanitize(metadata));
  },
  warn(message: string, metadata?: LogMetadata) {
    console.warn(message, sanitize(metadata));
  },
  error(message: string, metadata?: LogMetadata) {
    console.error(message, sanitize(metadata));
  },
};
