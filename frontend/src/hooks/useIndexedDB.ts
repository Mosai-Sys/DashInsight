import { useEffect, useState } from 'react';

const DB_NAME = 'dashinsight';
const STORE_NAME = 'store';
const VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function setIndexedItem(key: string, value: string) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getIndexedItem(key: string) {
  const db = await openDB();
  return new Promise<string | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

export default function useIndexedDB(key: string) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    getIndexedItem(key).then((val) => {
      if (val) setValue(val);
    });
  }, [key]);

  const save = async (val: string) => {
    await setIndexedItem(key, val);
    setValue(val);
  };

  return [value, save] as const;
}
