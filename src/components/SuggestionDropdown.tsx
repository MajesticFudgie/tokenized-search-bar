import { useEffect, useRef } from 'react'
import type { TokenDefinition } from '../types'

interface SuggestionDropdownProps {
  suggestions: TokenDefinition[]
  highlightedIndex: number
  onSelect: (definition: TokenDefinition) => void
  onHighlight: (index: number) => void
}

export function SuggestionDropdown({
  suggestions,
  highlightedIndex,
  onSelect,
  onHighlight,
}: SuggestionDropdownProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = listRef.current?.children[highlightedIndex] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [highlightedIndex])

  if (suggestions.length === 0) return null

  return (
    <ul className="tsb-dropdown" role="listbox" ref={listRef}>
      {suggestions.map((def, index) => (
        <li
          key={def.slug}
          className={`tsb-dropdown__item${index === highlightedIndex ? ' tsb-dropdown__item--highlighted' : ''}`}
          role="option"
          aria-selected={index === highlightedIndex}
          onMouseDown={(e) => {
            e.preventDefault()
            onSelect(def)
          }}
          onMouseEnter={() => onHighlight(index)}
        >
          <span className="tsb-dropdown__label">{def.label}</span>
          {def.description && (
            <span className="tsb-dropdown__description">{def.description}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
