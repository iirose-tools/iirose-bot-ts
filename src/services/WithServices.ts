import { Constructor } from '../utils/types';

type ServiceConstructorParams<S extends Service> = ConstructorParameters<
  ServiceType<S>
>;
type Service<T extends Constructor = Constructor> = (Base: Constructor) => T;
type ServiceType<S> = S extends Service<infer T> ? T : never;
type Union<T> = T extends Array<infer E> ? E : never;
type Intersect<U> = (U extends any ? (k: U) => void : never) extends ((
  k: infer I
) => void)
  ? I
  : never;
type Mixed<S> = Intersect<
  S extends Array<infer E>
    ? E extends Service
      ? new (...args: ServiceConstructorParams<E>) => Intersect<
          InstanceType<ServiceType<Union<S>>>
        >
      : never
    : never
>;

export const WithServices = <S extends Service[]>(...services: S): Mixed<S> => {
  return services.reduce(
    (MixedClass, service) => service(MixedClass),
    class {} as any
  );
};
