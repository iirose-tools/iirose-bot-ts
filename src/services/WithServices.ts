import { Constructor } from '../utils/types';

type Intersect<U> = (U extends any ? (k: U) => void : never) extends ((
  k: infer I
) => void)
  ? I
  : never;
type Mixed<S> = Constructor<
  Intersect<
    S extends Array<infer T>
      ? T extends Constructor
        ? InstanceType<T>
        : never
      : never
  >,
  S extends Array<infer T>
    ? T extends Constructor
      ? ConstructorParameters<T>
      : never
    : never
>;

export const WithServices = <S extends Constructor[]>(
  ...services: S
): Mixed<S> => {
  return (function constructor(this: any, ...args: any[]): any {
    for (const service of services) {
      const instance = Reflect.construct(service, args, new.target);

      const descriptors = {
        ...Object.getOwnPropertyDescriptors(instance),
        ...Object.getOwnPropertyDescriptors(service.prototype)
      };

      Object.defineProperties(this, descriptors);
    }
  } as any) as Mixed<S>;
};
