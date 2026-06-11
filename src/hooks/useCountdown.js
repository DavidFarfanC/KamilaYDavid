import { useEffect, useState } from 'react'

function diff(target) {
  const total = Math.max(0, target.getTime() - Date.now())
  return {
    total,
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  }
}

export function useCountdown(target) {
  const [time, setTime] = useState(() => diff(target))

  useEffect(() => {
    const id = setInterval(() => setTime(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return time
}
