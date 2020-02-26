if (typeof process !== "undefined") {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Dyna boilerplate: Unhandled Rejection; you should catch it!', {promise, reason});
  });
}
