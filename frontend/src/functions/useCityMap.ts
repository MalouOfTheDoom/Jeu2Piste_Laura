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
        width: '6px',
        height: '6px',
        position: 'absolute',
      }
    }

    const ratioX = width.value / baseWidth
    const ratioY = height.value / baseHeight
    const scale = (ratioX + ratioY) / 2

    const basePointSize = 27
    const scaledPointSize = Math.max(basePointSize * scale, 6)

    return {
      left: `${x * ratioX}px`,
      top: `${y * ratioY}px`,
      position: 'absolute',
      width: `${scaledPointSize}px`,
      height: `${scaledPointSize}px`,
    }
  }

  return { computePosition }
}
