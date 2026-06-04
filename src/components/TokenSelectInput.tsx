import { useEffect, useRef, useState } from 'react'
import type { TokenDefinition } from '../types'

interface TokenSelectInputProps {
  definition: TokenDefinition
  value: string | number | boolean
  autoFocus?: boolean
  disabled?: boolean
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function TokenSelectInput({
  definition,
  value,
  autoFocus,
  disabled,
  onChange,
  onKeyDown,
}: TokenSelectInputProps) {
  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const containerRef = useRef<HTMLSpanElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const options = definition.options ?? []
  const displayValue = (value as string) || definition.placeholder || 'Select…'

  useEffect(() => {
    if (autoFocus) triggerRef.current?.focus()
  }, [autoFocus])

  useEffect(() => {
    if (open) {
      const current = options.indexOf(value as string)
      setHighlightedIndex(current >= 0 ? current : 0)
    }
  }, [open])

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((i) => Math.min(i + 1, options.length - 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((i) => Math.max(i - 1, 0))
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (options[highlightedIndex]) {
          onChange(options[highlightedIndex])
        }
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
    } else {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setOpen(true)
        return
      }
      // Pass Escape/Enter through to the chip handler when closed
      onKeyDown(e)
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLSpanElement>) {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false)
    }
  }

  return (
    <span
      ref={containerRef}
      className="tsb-chip__select"
      onBlur={handleBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        className="tsb-chip__select-trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="tsb-chip__select-value">{displayValue}</span>
        <svg
          className={`tsb-chip__select-chevron${open ? ' tsb-chip__select-chevron--open' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          width="10"
          height="10"
        >
          <polyline points="2,4 6,8 10,4" />
        </svg>
      </button>

      {open && (
        <ul
          className="tsb-chip__select-dropdown"
          role="listbox"
          aria-label={definition.label}
        >
          {options.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              className={[
                'tsb-chip__select-option',
                i === highlightedIndex ? 'tsb-chip__select-option--highlighted' : '',
                opt === value ? 'tsb-chip__select-option--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => setHighlightedIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault()
                onChange(opt)
                setOpen(false)
                triggerRef.current?.focus()
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </span>
  )
}
