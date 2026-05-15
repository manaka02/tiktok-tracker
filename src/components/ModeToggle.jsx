import { IconMessage, IconVideo } from './icons/Icons'

export default function ModeToggle({ mode, onToggle, className = '' }) {
  const isVideo = mode === 'video'
  const accentColor = isVideo ? 'text-video border-video' : 'text-comment border-comment'

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex aspect-square h-full min-w-[44px] shrink-0 items-center justify-center rounded-lg border-2 bg-input ${accentColor} transition-colors ${className}`}
      aria-label={
        isVideo
          ? 'Mode vidéo actif, passer en commentaire'
          : 'Mode commentaire actif, passer en vidéo'
      }
    >
      {isVideo ? <IconVideo size={22} /> : <IconMessage size={22} />}
    </button>
  )
}
