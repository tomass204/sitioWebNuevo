import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.alert
Object.defineProperty(window, 'alert', {
  value: jest.fn(),
});

// Mock URL.createObjectURL
Object.defineProperty(window.URL, 'createObjectURL', {
  value: jest.fn(() => 'mocked-url'),
});

// Mock FormData
global.FormData = jest.fn(() => ({
  get: jest.fn(),
  set: jest.fn(),
  has: jest.fn(),
  delete: jest.fn(),
  append: jest.fn(),
  getAll: jest.fn(),
  entries: jest.fn(),
  keys: jest.fn(),
  values: jest.fn(),
})) as any;
