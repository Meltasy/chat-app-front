import { useEffect } from 'react'

export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
  active: boolean
) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler()
      }
    }
    if (active) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [active, ref, handler])
}
