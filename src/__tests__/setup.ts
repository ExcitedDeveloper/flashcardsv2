import '@testing-library/jest-dom'

// Mock ResizeObserver
class MockResizeObserver {
  // eslint-disable-next-line class-methods-use-this
  observe() {}

  // eslint-disable-next-line class-methods-use-this
  unobserve() {}

  // eslint-disable-next-line class-methods-use-this
  disconnect() {}
}

global.ResizeObserver = MockResizeObserver

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

// Mock scrollIntoView (only if not already defined)
if (!Element.prototype.scrollIntoView) {
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    value: jest.fn()
  })
}

// Mock crypto.getRandomValues for UUID generation (only if not already defined)
if (!global.crypto) {
  Object.defineProperty(global, 'crypto', {
    value: {
      getRandomValues: (arr: Uint8Array) => {
        for (let i = 0; i < arr.length; i += 1) {
          arr[i] = Math.floor(Math.random() * 256)
        }
        return arr
      }
    }
  })
} else if (!global.crypto.getRandomValues) {
  // If crypto exists but doesn't have getRandomValues, add it
  global.crypto.getRandomValues = <T extends ArrayBufferView | null>(
    array: T
  ): T => {
    if (array) {
      const arr = new Uint8Array(
        array.buffer,
        array.byteOffset,
        array.byteLength
      )
      for (let i = 0; i < arr.length; i += 1) {
        arr[i] = Math.floor(Math.random() * 256)
      }
    }
    return array
  }
}

// Mock Electron preload API (only if not already defined)
if (!('electron' in window)) {
  Object.defineProperty(window, 'electron', {
    value: {
      ipcRenderer: {
        sendMessage: jest.fn(),
        on: jest.fn(),
        once: jest.fn(),
        removeListener: jest.fn()
      }
    }
  })
}

// Global test timeout
jest.setTimeout(10000)

// Dummy test to prevent "no tests" error
describe('Test Setup', () => {
  it('should configure test environment', () => {
    expect(true).toBe(true)
  })
})
