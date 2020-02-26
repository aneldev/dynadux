const consoleError = console.error;

export const hideConsoleError = (hide: boolean): void => {
  hide
    ? console.error = () => undefined
    : console.error = consoleError;
};

