import CustomRequest, { IStores } from "../types/CustomRequest";

const stores: (keyof IStores)[] = ["payload", "token", "user"];

const Store =
  (storeName: keyof IStores): Function =>
  (req: CustomRequest, item: IStores[typeof storeName]) => {
    (req[storeName] as CustomRequest[keyof IStores]) = item;
  };

const baseRequestStores = (
  storeNames: (keyof IStores)[]
): Record<keyof IStores, Function> =>
  storeNames.reduce(
    (finalStore, storeName) => ({
      ...finalStore,
      [storeName]: Store(storeName),
    }),
    {} as Record<keyof IStores, Function>
  );

const requestStores = baseRequestStores(stores);

export default requestStores;
