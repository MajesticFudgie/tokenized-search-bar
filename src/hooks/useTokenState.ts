import { useCallback, useState } from 'react'
import type { ActiveToken } from '../types'

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

interface UseTokenStateOptions {
  value?: ActiveToken[]
  defaultValue?: ActiveToken[]
  onChange?: (tokens: ActiveToken[]) => void
}

interface UseTokenStateResult {
  tokens: ActiveToken[]
  addToken: (slug: string, initialValue?: string | number | boolean, locked?: boolean) => ActiveToken
  removeToken: (id: string) => void
  updateToken: (id: string, value: string | number | boolean) => void
  removeEmpty: () => void
}

export function useTokenState({
  value,
  defaultValue,
  onChange,
}: UseTokenStateOptions): UseTokenStateResult {
  const isControlled = value !== undefined

  const [internalTokens, setInternalTokens] = useState<ActiveToken[]>(() => {
    if (defaultValue) {
      return defaultValue.map((t) => ({ ...t, id: t.id ?? generateId() }))
    }
    return []
  })

  const tokens = isControlled ? value! : internalTokens

  const commit = useCallback(
    (next: ActiveToken[]) => {
      if (!isControlled) setInternalTokens(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  const addToken = useCallback(
    (slug: string, initialValue: string | number | boolean = '', locked?: boolean): ActiveToken => {
      const token: ActiveToken = { id: generateId(), slug, value: initialValue, locked }
      commit([...tokens, token])
      return token
    },
    [tokens, commit],
  )

  const removeToken = useCallback(
    (id: string) => {
      const token = tokens.find((t) => t.id === id)
      if (!token || token.locked) return
      commit(tokens.filter((t) => t.id !== id))
    },
    [tokens, commit],
  )

  const updateToken = useCallback(
    (id: string, value: string | number | boolean) => {
      commit(tokens.map((t) => (t.id === id ? { ...t, value } : t)))
    },
    [tokens, commit],
  )

  const removeEmpty = useCallback(() => {
    commit(
      tokens.filter(
        (t) =>
          t.locked ||
          (t.value !== '' && !(typeof t.value === 'number' && isNaN(t.value as number))),
      ),
    )
  }, [tokens, commit])

  return { tokens, addToken, removeToken, updateToken, removeEmpty }
}
