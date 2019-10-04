export type Constructor<T = any, P extends any[] = any[]> = new (
  ...args: P
) => T;

export type Type<T> =
  | Constructor<T>
  // tslint:disable-next-line:ban-types
  | Function & { prototype: T };
