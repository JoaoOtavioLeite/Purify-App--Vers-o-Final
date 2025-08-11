import { useState, useRef, useEffect } from 'react'

interface SwipeInput {
  onSwipedLeft?: () => void
  onSwipedRight?: () => void
  onSwipedUp?: () => void
  onSwipedDown?: () => void
  minDistanceX?: number
  minDistanceY?: number
  preventDefaultTouchmoveEvent?: boolean
}

export const useSwipeable = ({
  onSwipedLeft,
  onSwipedRight,
  onSwipedUp,
  onSwipedDown,
  minDistanceX = 50,
  minDistanceY = 50,
  preventDefaultTouchmoveEvent = false,
}: SwipeInput) => {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })
  const [isSwiping, setIsSwiping] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd({ x: 0, y: 0 }) // Reset touch end
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
    setIsSwiping(true)
  }

  const onTouchMove = (e: TouchEvent) => {
    if (preventDefaultTouchmoveEvent && e.cancelable) {
      e.preventDefault()
    }
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchEnd = () => {
    if (!touchStart.x || !touchStart.y) return
    setIsSwiping(false)

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y

    const isLeftSwipe = distanceX > minDistanceX
    const isRightSwipe = distanceX < -minDistanceX
    const isUpSwipe = distanceY > minDistanceY
    const isDownSwipe = distanceY < -minDistanceY

    // Determinar qual gesto teve maior magnitude
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Swipe horizontal
      if (isLeftSwipe && onSwipedLeft) {
        onSwipedLeft()
      }
      if (isRightSwipe && onSwipedRight) {
        onSwipedRight()
      }
    } else {
      // Swipe vertical
      if (isUpSwipe && onSwipedUp) {
        onSwipedUp()
      }
      if (isDownSwipe && onSwipedDown) {
        onSwipedDown()
      }
    }
  }

  useEffect(() => {
    const element = elementRef.current
    if (element) {
      element.addEventListener('touchstart', onTouchStart, { passive: true })
      element.addEventListener('touchmove', onTouchMove, { passive: !preventDefaultTouchmoveEvent })
      element.addEventListener('touchend', onTouchEnd, { passive: true })

      return () => {
        element.removeEventListener('touchstart', onTouchStart)
        element.removeEventListener('touchmove', onTouchMove)
        element.removeEventListener('touchend', onTouchEnd)
      }
    }
  }, [touchStart, touchEnd, preventDefaultTouchmoveEvent])

  return {
    ref: elementRef,
    isSwiping,
    touchStart,
    touchEnd,
  }
}

// Hook especializado para navegação entre páginas
export const useSwipeNavigation = () => {
  const pages = [
    { path: '/', name: 'Início' },
    { path: '/emergencia', name: 'SOS' },
    { path: '/estatistica', name: 'Progresso' },
    { path: '/definicoes', name: 'Menu' },
  ]

  const getCurrentPageIndex = (pathname: string) => {
    return pages.findIndex(page => page.path === pathname) || 0
  }

  const getNextPage = (currentPath: string) => {
    const currentIndex = getCurrentPageIndex(currentPath)
    const nextIndex = (currentIndex + 1) % pages.length
    return pages[nextIndex].path
  }

  const getPreviousPage = (currentPath: string) => {
    const currentIndex = getCurrentPageIndex(currentPath)
    const prevIndex = currentIndex === 0 ? pages.length - 1 : currentIndex - 1
    return pages[prevIndex].path
  }

  return {
    pages,
    getNextPage,
    getPreviousPage,
    getCurrentPageIndex,
  }
}
