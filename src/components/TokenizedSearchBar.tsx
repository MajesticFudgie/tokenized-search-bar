import { useCallback, useRef, useState } from 'react'
import type { TokenizedSearchBarProps, SearchResult } from '../types'
import { useTokenState } from '../hooks/useTokenState'
import { useTypeahead } from '../hooks/useTypeahead'
import { SuggestionDropdown } from './SuggestionDropdown'
import { TokenChip } from './TokenChip'

export function TokenizedSearchBar({
  tokenDefinitions,
  value,
  defaultValue,
  onChange,
  onSearch,
  placeholder = 'Search…',
  className,
  disabled,
  theme,
  freeText,
}: TokenizedSearchBarProps) {
  const freeTextSlug = freeText === true ? 'search' : typeof freeText === 'string' ? freeText : null
  const freeTextDef: import('../types').TokenDefinition | null = freeTextSlug
    ? { slug: freeTextSlug, label: '', type: 'text' }
    : null
  const allDefs = freeTextDef ? [...tokenDefinitions, freeTextDef] : tokenDefinitions
  const { tokens, addToken, removeToken, updateToken, removeEmpty } = useTokenState({
    value,
    defaultValue,
    onChange,
  })

  const { query, setQuery, suggestions, highlightedIndex, setHighlightedIndex, moveHighlight, clearQuery } =
    useTypeahead({ tokenDefinitions, activeTokens: tokens })

  const [open, setOpen] = useState(false)
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)
  const mainInputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const isOpen = open && suggestions.length > 0

  function buildResults(): SearchResult[] {
    return tokens.flatMap((token): SearchResult[] => {
      if (token.slug === freeTextSlug) {
        return [{ type: 'freetext' as const, value: token.value as string }]
      }
      const def = allDefs.find((d) => d.slug === token.slug)
      if (!def) return []
      switch (def.type) {
        case 'boolean': return [{ slug: token.slug, type: 'boolean' as const, value: token.value as boolean }]
        case 'number':  return [{ slug: token.slug, type: 'number'  as const, value: token.value as number }]
        default:        return [{ slug: token.slug, type: def.type,            value: token.value as string }]
      }
    })
  }

  function triggerSearch() {
    onSearch?.(buildResults())
    ;(rootRef.current?.querySelector(':focus') as HTMLElement | null)?.blur()
    setOpen(false)
  }

  function selectSuggestion(def: (typeof suggestions)[number]) {
    const defaultValue =
      def.type === 'boolean' ? false :
      def.type === 'number' ? 0 :
      def.type === 'colour' ? '#000000' :
      ''
    const token = addToken(def.slug, defaultValue)
    setLastAddedId(token.id)
    clearQuery()
    setOpen(false)
  }

  function handleMainKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) setOpen(true)
      else moveHighlight(1)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      moveHighlight(-1)
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (isOpen && suggestions[highlightedIndex]) {
        selectSuggestion(suggestions[highlightedIndex])
      } else if (freeTextSlug && query.trim() && !tokens.some((t) => t.slug === freeTextSlug)) {
        addToken(freeTextSlug, query.trim())
        clearQuery()
        setOpen(false)
      } else {
        triggerSearch()
      }
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      clearQuery()
      setOpen(false)
      mainInputRef.current?.blur()
      return
    }
    if (e.key === 'Backspace' && query === '' && tokens.length > 0) {
      e.preventDefault()
      const last = tokens[tokens.length - 1]
      setLastAddedId(last.id)
      return
    }
  }

  function handleMainInput(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    setOpen(true)
  }

  function handleRootBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!rootRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false)
      clearQuery()
      removeEmpty()
    }
  }

  const focusMain = useCallback(() => {
    mainInputRef.current?.focus()
  }, [])

  return (
    <div
      ref={rootRef}
      className={`tsb${className ? ` ${className}` : ''}${disabled ? ' tsb--disabled' : ''}`}
      data-theme={theme ?? 'light'}
      onBlur={handleRootBlur}
    >
      <div
        className="tsb__inner"
        onClick={(e) => {
          if (!disabled && !(e.target as Element).closest('.tsb-chip')) {
            mainInputRef.current?.focus()
          }
        }}
      >
        {tokens.map((token) => {
          const def = allDefs.find((d) => d.slug === token.slug)
          if (!def) return null
          return (
            <TokenChip
              key={token.id}
              token={token}
              definition={def}
              autoFocus={token.id === lastAddedId}
              disabled={disabled}
              onUpdate={updateToken}
              onRemove={removeToken}
              onSearch={triggerSearch}
              onFocusMain={focusMain}
            />
          )
        })}

        <span className="tsb__input-sizer" data-value={query}>
          <input
            ref={mainInputRef}
            className="tsb__input"
            type="text"
            value={query}
            placeholder={tokens.length === 0 ? placeholder : undefined}
            disabled={disabled}
            aria-label={placeholder}
            aria-autocomplete="list"
            aria-expanded={isOpen}
            autoComplete="off"
            onChange={handleMainInput}
            onKeyDown={handleMainKeyDown}
            onFocus={() => {
              setOpen(true)
              setLastAddedId(null)
            }}
          />
        </span>

        {isOpen && (
          <SuggestionDropdown
            suggestions={suggestions}
            highlightedIndex={highlightedIndex}
            onSelect={selectSuggestion}
            onHighlight={setHighlightedIndex}
          />
        )}
      </div>

      <button
        type="button"
        className="tsb__search-btn"
        aria-label="Search"
        disabled={disabled}
        onClick={triggerSearch}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          width="16"
          height="16"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}
