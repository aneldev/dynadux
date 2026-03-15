const consoled: { [argsKey: string]: boolean } = {};

export const consoledOnce = (consoleType: 'log' | 'warn' | 'error', ...args: any[]): void => {
  const consoledKey = JSON.stringify({
    consoleType,
    args,
  });
  if (consoled[consoledKey]) return;

  consoled[consoledKey] = true;
  // eslint-disable-next-line no-console
  console[consoleType](...args);
};
