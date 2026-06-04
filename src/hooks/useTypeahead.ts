import { useCallback, useMemo, useState } from 'react'
import type { ActiveToken, TokenDefinition } from '../types'

interface UseTypeaheadOptions {
  tokenDefinitions: TokenDefinition[]
  activeTokens: ActiveToken[]
}

interface UseTypeaheadResult {
  query: string
  setQuery: (q: string) => void
  suggestions: TokenDefinition[]
  highlightedIndex: number
  setHighlightedIndex: (i: number) => void
  moveHighlight: (dir: 1 | -1) => void
  clearQuery: () => void
}

export function useTypeahead({
  tokenDefinitions,
  activeTokens,
}: UseTypeaheadOptions): UseTypeaheadResult {
  const [query, setQueryRaw] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()

    return tokenDefinitions.filter((def) => {
      if (!q) return true

      const matchesLabel = def.label.toLowerCase().includes(q)
      const matchesDesc = def.description?.toLowerCase().includes(q) ?? false
      if (!matchesLabel && !matchesDesc) return false

      if (!def.multiple) {
        const alreadyAdded = activeTokens.some((t) => t.slug === def.slug)
        if (alreadyAdded) return false
      }

      return true
    })
  }, [query, tokenDefinitions, activeTokens])

  const setQuery = useCallback((q: string) => {
    setQueryRaw(q)
    setHighlightedIndex(0)
  }, [])

  const moveHighlight = useCallback(
    (dir: 1 | -1) => {
      setHighlightedIndex((i) => {
        const next = i + dir
        if (next < 0) return suggestions.length - 1
        if (next >= suggestions.length) return 0
        return next
      })
    },
    [suggestions.length],
  )

  const clearQuery = useCallback(() => {
    setQueryRaw('')
    setHighlightedIndex(0)
  }, [])

  return {
    query,
    setQuery,
    suggestions,
    highlightedIndex,
    setHighlightedIndex,
    moveHighlight,
    clearQuery,
  }
}
