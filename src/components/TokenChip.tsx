import { useRef, useState } from 'react'
import type { ActiveToken, TokenDefinition } from '../types'
import { TokenInput } from './TokenInput'

interface TokenChipProps {
  token: ActiveToken
  definition: TokenDefinition
  autoFocus?: boolean
  disabled?: boolean
  onUpdate: (id: string, value: string | number | boolean) => void
  onRemove: (id: string) => void
  onSearch: () => void
  onFocusMain: () => void
}

export function TokenChip({
  token,
  definition,
  autoFocus,
  disabled,
  onUpdate,
  onRemove,
  onSearch,
  onFocusMain,
}: TokenChipProps) {
  const [focused, setFocused] = useState(false)
  const chipRef = useRef<HTMLSpanElement>(null)

  const chipStyle: React.CSSProperties = definition.colour
    ? { backgroundColor: definition.colour }
    : {}

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSearch()
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      const isEmpty =
        token.value === '' ||
        token.value === false ||
        token.value === 0 ||
        token.value === null ||
        token.value === undefined

      if (!isEmpty) {
        onUpdate(
          token.id,
          definition.type === 'boolean' ? false : definition.type === 'number' ? 0 : '',
        )
      } else if (!token.locked) {
        onRemove(token.id)
        onFocusMain()
      } else {
        onFocusMain()
      }
    }
  }

  function handleFocus() {
    setFocused(true)
  }

  function handleBlur(e: React.FocusEvent<HTMLSpanElement>) {
    if (!chipRef.current?.contains(e.relatedTarget as Node)) {
      setFocused(false)
    }
  }

  return (
    <span
      ref={chipRef}
      className={`tsb-chip${focused ? ' tsb-chip--focused' : ''}${token.locked ? ' tsb-chip--locked' : ''}`}
      style={chipStyle}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <span className="tsb-chip__label">{definition.label}</span>
      <span className="tsb-chip__separator" aria-hidden="true" />
      <TokenInput
        definition={definition}
        value={token.value}
        autoFocus={autoFocus}
        disabled={disabled}
        onChange={(val) => onUpdate(token.id, val)}
        onKeyDown={handleKeyDown}
      />
      {definition.suffix && (
        <span className="tsb-chip__suffix">{definition.suffix}</span>
      )}
      {!token.locked && (
        <button
          type="button"
          className="tsb-chip__remove"
          aria-label={`Remove ${definition.label} filter`}
          tabIndex={-1}
          disabled={disabled}
          onMouseDown={(e) => {
            e.preventDefault()
            onRemove(token.id)
            onFocusMain()
          }}
        >
          ×
        </button>
      )}
    </span>
  )
}
