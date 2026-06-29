/**
 * Web storage service — implements StorageService via IndexedDB.
 *
 * Falls back to localStorage if IndexedDB is unavailable.
 * This file IS allowed to use DOM APIs.
 */

import type { StorageService } from '@core/platform'

const DB_NAME = 'visutry-mobile'
const DB_VERSION = 1
const STORE_NAME = 'kv'

// ── IndexedDB helpers ──

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not available'))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

export class WebStorageService implements StorageService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await openDB()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const request = tx.objectStore(STORE_NAME).get(key)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve((request.result as T) ?? null)
      })
    } catch {
      // Fallback to localStorage
      const value = localStorage.getItem(key)
      return value ? (JSON.parse(value) as T) : null
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const db = await openDB()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        tx.objectStore(STORE_NAME).put(value, key)
        tx.onerror = () => reject(tx.error)
        tx.oncomplete = () => resolve()
      })
    } catch {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const db = await openDB()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        tx.objectStore(STORE_NAME).delete(key)
        tx.onerror = () => reject(tx.error)
        tx.oncomplete = () => resolve()
      })
    } catch {
      localStorage.removeItem(key)
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await openDB()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        tx.objectStore(STORE_NAME).clear()
        tx.onerror = () => reject(tx.error)
        tx.oncomplete = () => resolve()
      })
    } catch {
      localStorage.clear()
    }
  }
}
