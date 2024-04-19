import { vitest } from "vitest";

type AsyncFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<any> ? K : never;
}[keyof T];

type AsyncFunctionReturnType<T, K extends keyof T> = T[K] extends (
  ...args: any[]
) => Promise<infer R>
  ? R
  : never;

export const serviceMockBuilder = <F, S extends AsyncFunctionPropertyNames<F>>(
  file: F,
  service: S
) => {
  const mock = vitest.spyOn(file, service as any);

  return {
    build() {
      return mock;
    },
    withValue(value: AsyncFunctionReturnType<F, S>) {
      mock.mockResolvedValue(value);
      return this;
    },
    withError(error?: any) {
      mock.mockRejectedValue(error);

      return this;
    },
  };
};
