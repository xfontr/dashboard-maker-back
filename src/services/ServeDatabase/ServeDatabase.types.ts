type MethodOptions<T> = Partial<{
  replace: boolean;
  mainIdentifier: keyof T;
}>;

export default MethodOptions;
