import {
  DEFAULT_WINDOW_HEIGHT,
  MENU_BAR_HEIGHT,
  FOOTER_HEIGHT
} from '../constants'

export const calculateContentHeight = (windowHeight?: number): number => {
  return (windowHeight ?? DEFAULT_WINDOW_HEIGHT) - MENU_BAR_HEIGHT
}

export const calculateMainContentHeight = (windowHeight?: number): number => {
  return (
    (windowHeight ?? DEFAULT_WINDOW_HEIGHT) - MENU_BAR_HEIGHT - FOOTER_HEIGHT
  )
}

export const getResponsiveHeight = (
  windowHeight?: number,
  additionalOffset = 0
): number => {
  return (windowHeight ?? DEFAULT_WINDOW_HEIGHT) - additionalOffset
}
