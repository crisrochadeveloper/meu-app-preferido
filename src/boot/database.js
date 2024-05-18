export default {
  async openDatabase(dbName, dbVersion, upgradeCallback) {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(dbName, dbVersion);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        upgradeCallback(db, event);
      };
    });
  },

  async saveItem(db, storeName, item) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      // Verifica se o item não contém Promises
      const cleanItem = this.removePromises(item);

      const request = store.add(cleanItem);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  removePromises(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const cleanObj = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!(value instanceof Promise)) {
      cleanObj[key] = this.removePromises(value);
    }
  }
  return cleanObj;
},


  // Função para recuperar todos os itens de uma loja no IndexedDB
  async getAllItems(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
},

  // Função para atualizar um item no IndexedDB
  async updateItem(db, storeName, key, newItem) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(newItem, key);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
},

  // Função para excluir um item do IndexedDB
  async deleteItem(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
}

