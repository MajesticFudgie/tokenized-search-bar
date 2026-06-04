import { useEffect, useRef } from 'react'
import type { TokenDefinition } from '../types'
import { TokenSelectInput } from './TokenSelectInput'

interface TokenInputProps {
  definition: TokenDefinition
  value: string | number | boolean
  autoFocus?: boolean
  disabled?: boolean
  onChange: (value: string | number | boolean) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function TokenInput({
  definition,
  value,
  autoFocus,
  disabled,
  onChange,
  onKeyDown,
}: TokenInputProps) {
  const inputRef = useRef<HTMLInputElement & HTMLSelectElement>(null)

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  const sharedProps = {
    className: 'tsb-chip__input',
    disabled,
    onKeyDown,
  }

  switch (definition.type) {
    case 'boolean':
      return (
        <label className="tsb-chip__toggle">
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="checkbox"
            className="tsb-chip__toggle-input"
            checked={Boolean(value)}
            disabled={disabled}
            onKeyDown={onKeyDown}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="tsb-chip__toggle-track">
            <span className="tsb-chip__toggle-thumb" />
          </span>
        </label>
      )

    case 'number': {
      const numStr = value !== '' && !isNaN(value as number) ? String(value) : ''
      const numWidth = `${Math.max(2, numStr.length + 1)}ch`
      return (
        <input
          {...sharedProps}
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="number"
          className="tsb-chip__input tsb-chip__input--number"
          style={{ width: numWidth }}
          value={value as number}
          placeholder={definition.placeholder}
          min={definition.min}
          max={definition.max}
          onChange={(e) => onChange(e.target.valueAsNumber)}
        />
      )
    }

    case 'date':
      return (
        <input
          {...sharedProps}
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="date"
          value={value as string}
          min={definition.min}
          max={definition.max}
          onChange={(e) => onChange(e.target.value)}
        />
      )

    case 'colour':
      return (
        <label className="tsb-chip__input tsb-chip__input--colour-wrap">
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="color"
            className="tsb-chip__colour-swatch"
            value={(value as string) || '#000000'}
            disabled={disabled}
            onKeyDown={onKeyDown}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="tsb-chip__colour-hex">{(value as string) || '#000000'}</span>
        </label>
      )

    case 'select':
      return (
        <TokenSelectInput
          definition={definition}
          value={value}
          autoFocus={autoFocus}
          disabled={disabled}
          onChange={(v) => onChange(v)}
          onKeyDown={onKeyDown}
        />
      )

    default:
      return (
        <span className="tsb-chip__input-sizer" data-value={(value as string) || ' '}>
          <input
            {...sharedProps}
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            size={1}
            value={value as string}
            placeholder={definition.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </span>
      )
  }
}
