export const global = (() => {
  let global: any;
  if (typeof window !== 'undefined') global = window;
  if (!global && typeof process !== 'undefined') global = process;
  return global;
})();
