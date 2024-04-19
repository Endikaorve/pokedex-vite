export const localStorageClient = {
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: <T>(key: string) => {
    const value = localStorage.getItem(key);

    return value ? (JSON.parse(value) as T) : undefined;
  },
};
