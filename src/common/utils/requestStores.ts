import CustomRequest, { IStores } from "../types/CustomRequest";

const storeNames: (keyof IStores)[] = ["payload", "token", "user"];

const Store =
  (storeName: keyof IStores): Function =>
  (req: CustomRequest, item: IStores[typeof storeName]) => {
    (req[storeName] as CustomRequest[keyof IStores]) = item;
  };

const baseRequestStores = (
  stores: (keyof IStores)[]
): Record<keyof IStores, Function> =>
  stores.reduce(
    (finalStore, currentStore) => ({
      ...finalStore,
      [currentStore]: Store(currentStore),
    }),
    {} as Record<keyof IStores, Function>
  );

const requestStores = baseRequestStores(storeNames);

export default requestStores;
