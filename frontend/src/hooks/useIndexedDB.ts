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

export async function setIndexedItem<T>(key: string, value: T) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(JSON.stringify(value), key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getIndexedItem<T>(key: string) {
  const db = await openDB();
  return new Promise<T | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => {
      const res = req.result;
      if (res == null) return resolve(null);
      try {
        resolve(JSON.parse(res) as T);
      } catch {
        // fallback for existing plain strings
        resolve(res as T);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export default function useIndexedDB<T>(key: string, initialValue: T | null = null) {
  const [value, setValue] = useState<T | null>(initialValue);

  useEffect(() => {
    getIndexedItem<T>(key).then((val) => {
      if (val !== null) setValue(val);
    });
  }, [key]);

  const save = async (val: T) => {
    await setIndexedItem(key, val);
    setValue(val);
  };

  return [value, save] as const;
}
