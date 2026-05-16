import { IconClipboardPaste } from '../icons/Icons'
import ModeToggle from '../ModeToggle'

const COMPOSER_HEIGHT = 'h-12'

export default function TrackerComposer({
  url,
  onUrlChange,
  mode,
  onToggleMode,
  onSubmit,
  onPasteFromClipboard,
  inputRef,
}) {
  const isVideo = mode === 'video'
  const borderColor = isVideo ? 'border-video' : 'border-comment'

  return (
    <form
      onSubmit={onSubmit}
      className="z-10 shrink-0 border-t border-input bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-stretch gap-2 px-4 py-3">
        <div
          className={`flex ${COMPOSER_HEIGHT} min-w-0 flex-1 items-stretch gap-2`}
        >
          <ModeToggle mode={mode} onToggle={onToggleMode} />
          <textarea
            ref={inputRef}
            rows={1}
            inputMode="url"
            autoFocus
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                e.currentTarget.form?.requestSubmit()
              }
            }}
            placeholder="Colle un ou plusieurs liens (espace ou retour à la ligne)"
            className={`h-full min-h-[48px] max-h-32 min-w-0 flex-1 resize-none rounded-lg border-2 bg-input px-4 py-3 text-base text-text outline-none placeholder:text-muted focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface ${borderColor} ${isVideo ? 'focus:ring-video' : 'focus:ring-comment'}`}
          />
          <button
            type="button"
            onClick={() => void onPasteFromClipboard()}
            className={`flex ${COMPOSER_HEIGHT} min-w-[48px] shrink-0 items-center justify-center rounded-lg border-2 bg-input text-muted transition-colors hover:bg-surface ${isVideo ? 'hover:text-video' : 'hover:text-comment'} ${borderColor}`}
            aria-label="Coller depuis le presse-papiers"
          >
            <IconClipboardPaste size={22} />
          </button>
        </div>
        <button
          type="submit"
          className={`${COMPOSER_HEIGHT} shrink-0 rounded-lg bg-video px-5 text-base font-semibold text-white transition-opacity hover:opacity-90`}
        >
          Envoyer
        </button>
      </div>
    </form>
  )
}
