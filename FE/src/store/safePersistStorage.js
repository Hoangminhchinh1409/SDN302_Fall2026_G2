const safePersistStorage = {
  getItem: (name) => {
    try {
      const value = window.localStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    } catch {
      window.localStorage.removeItem(name);
      return null;
    }
  },
  setItem: (name, value) => window.localStorage.setItem(name, JSON.stringify(value)),
  removeItem: (name) => window.localStorage.removeItem(name),
};

export default safePersistStorage;
