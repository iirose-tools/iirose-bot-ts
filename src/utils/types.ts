export type Constructor<T = any, P extends any[] = any[]> = new (
  ...args: P
) => T;
