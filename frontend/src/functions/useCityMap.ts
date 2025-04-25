import { type Ref } from 'vue'
import { useElementSize } from '@vueuse/core'

export const useCityMap = (mapRef: Ref<HTMLElement | null>) => {
  const { width, height } = useElementSize(mapRef)

  const baseWidth = 2640
  const baseHeight = 1683

  const computePosition = (x: number, y: number) => {
    if (!width.value || !height.value) {
      return {
        left: '0px',
        top: '0px',
        width: '0.5rem',
        height: '0.5rem',
        position: 'absolute',
      }
    }

    const ratioX = width.value / baseWidth
    const ratioY = height.value / baseHeight

    // Average scale ratio to keep consistency
    const scale = (ratioX + ratioY) / 2

    const basePointSizePx = 27
    const scaledPointSizePx = Math.max(basePointSizePx * scale, 1)

    // Convert px to rem (assuming 1rem = 16px)
    const pxToRem = (px: number) => `${(px / 16).toFixed(3)}rem`

    return {
      left: `${x * ratioX}px`,
      top: `${y * ratioY}px`,
      position: 'absolute',
      width: pxToRem(scaledPointSizePx),
      height: pxToRem(scaledPointSizePx),
    }
  }

  return { computePosition }
}
