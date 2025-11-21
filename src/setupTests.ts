import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
class LocalStorageMock implements Storage {
  private store: Record<string, string> = {};
  
  get length(): number {
    return Object.keys(this.store).length;
  }
  
  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return index >= 0 && index < keys.length ? keys[index] : null;
  }
  
  getItem = vi.fn((key: string): string | null => {
    return this.store[key] || null;
  });
  
  setItem = vi.fn((key: string, value: string): void => {
    this.store[key] = value.toString();
  });
  
  removeItem = vi.fn((key: string): void => {
    delete this.store[key];
  });
  
  clear = vi.fn((): void => {
    this.store = {};
  });
}

const localStorageMock = new LocalStorageMock();

// Mock global objects
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
  writable: true
});

Object.defineProperty(window, 'alert', {
  value: vi.fn(),
  configurable: true,
  writable: true
});

Object.defineProperty(window.URL, 'createObjectURL', {
  value: vi.fn(() => 'mocked-url'),
  configurable: true,
  writable: true
});

// Mock FormData
const mockFormData = {
  get: vi.fn(),
  set: vi.fn(),
  has: vi.fn(),
  delete: vi.fn(),
  append: vi.fn(),
  getAll: vi.fn(),
  entries: vi.fn(),
  keys: vi.fn(),
  values: vi.fn(),
};

// @ts-ignore
global.FormData = vi.fn(() => mockFormData);

// Make vi available globally for easier access in tests
// @ts-ignore
global.vi = vi;
