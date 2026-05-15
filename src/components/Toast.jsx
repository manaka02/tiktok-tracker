import { useEffect } from 'react'

const VARIANTS = {
  success: { bg: 'bg-success', duration: 1500 },
  warning: { bg: 'bg-warning', duration: 2000 },
  error: { bg: 'bg-error', duration: 2000 },
}

export default function Toast({ message, variant = 'success', onClose }) {
  const config = VARIANTS[variant] ?? VARIANTS.success

  useEffect(() => {
    const timer = setTimeout(onClose, config.duration)
    return () => clearTimeout(timer)
  }, [message, variant, onClose, config.duration])

  if (!message) return null

  return (
    <div
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-[fadeIn_0.2s_ease-out]"
      role="status"
    >
      <div
        className={`${config.bg} rounded-lg px-5 py-3 text-sm font-medium text-white shadow-lg`}
      >
        {message}
      </div>
    </div>
  )
}
