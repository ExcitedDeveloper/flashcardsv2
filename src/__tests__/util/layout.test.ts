import {
  calculateContentHeight,
  calculateMainContentHeight,
  getResponsiveHeight
} from '../../renderer/util/layout'
import {
  DEFAULT_WINDOW_HEIGHT,
  MENU_BAR_HEIGHT,
  FOOTER_HEIGHT
} from '../../renderer/constants'

describe('layout utilities', () => {
  describe('calculateContentHeight', () => {
    it('should calculate height with provided window height', () => {
      const windowHeight = 800
      const result = calculateContentHeight(windowHeight)
      expect(result).toBe(windowHeight - MENU_BAR_HEIGHT)
    })

    it('should use default height when window height is undefined', () => {
      const result = calculateContentHeight(undefined)
      expect(result).toBe(DEFAULT_WINDOW_HEIGHT - MENU_BAR_HEIGHT)
    })

    it('should handle zero window height', () => {
      const result = calculateContentHeight(0)
      expect(result).toBe(0 - MENU_BAR_HEIGHT)
    })

    it('should handle negative window height', () => {
      const result = calculateContentHeight(-100)
      expect(result).toBe(-100 - MENU_BAR_HEIGHT)
    })
  })

  describe('calculateMainContentHeight', () => {
    it('should calculate height with provided window height', () => {
      const windowHeight = 800
      const result = calculateMainContentHeight(windowHeight)
      expect(result).toBe(windowHeight - MENU_BAR_HEIGHT - FOOTER_HEIGHT)
    })

    it('should use default height when window height is undefined', () => {
      const result = calculateMainContentHeight(undefined)
      expect(result).toBe(
        DEFAULT_WINDOW_HEIGHT - MENU_BAR_HEIGHT - FOOTER_HEIGHT
      )
    })

    it('should handle zero window height', () => {
      const result = calculateMainContentHeight(0)
      expect(result).toBe(0 - MENU_BAR_HEIGHT - FOOTER_HEIGHT)
    })

    it('should handle small window heights', () => {
      const result = calculateMainContentHeight(100)
      expect(result).toBe(100 - MENU_BAR_HEIGHT - FOOTER_HEIGHT)
    })
  })

  describe('getResponsiveHeight', () => {
    it('should calculate height with no additional offset', () => {
      const windowHeight = 800
      const result = getResponsiveHeight(windowHeight)
      expect(result).toBe(windowHeight)
    })

    it('should calculate height with additional offset', () => {
      const windowHeight = 800
      const offset = 50
      const result = getResponsiveHeight(windowHeight, offset)
      expect(result).toBe(windowHeight - offset)
    })

    it('should use default height when window height is undefined', () => {
      const result = getResponsiveHeight(undefined)
      expect(result).toBe(DEFAULT_WINDOW_HEIGHT)
    })

    it('should use default height with offset when window height is undefined', () => {
      const offset = 100
      const result = getResponsiveHeight(undefined, offset)
      expect(result).toBe(DEFAULT_WINDOW_HEIGHT - offset)
    })

    it('should handle zero offset', () => {
      const windowHeight = 800
      const result = getResponsiveHeight(windowHeight, 0)
      expect(result).toBe(windowHeight)
    })

    it('should handle negative offset', () => {
      const windowHeight = 800
      const offset = -50
      const result = getResponsiveHeight(windowHeight, offset)
      expect(result).toBe(windowHeight - offset)
    })
  })
})
