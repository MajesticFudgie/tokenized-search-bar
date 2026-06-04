export type TokenType = 'text' | 'number' | 'date' | 'colour' | 'boolean' | 'select'

export interface TokenDefinition {
  /** Unique identifier returned in search results */
  slug: string
  /** Label shown on the chip and in the suggestion dropdown */
  label: string
  /** Optional description shown beneath the label in the dropdown */
  description?: string
  /** Optional hex colour for the chip background, e.g. "#e0e7ff" */
  colour?: string
  /** Governs what input element is rendered inside the chip */
  type: TokenType
  /** Placeholder text inside the token's input */
  placeholder?: string
  /** Allowed values for 'select' type */
  options?: string[]
  /** Allow this token to appear more than once in the search bar */
  multiple?: boolean
  /** Min value for 'number' and 'date' types */
  min?: number | string
  /** Max value for 'number' and 'date' types */
  max?: number | string
  /** Optional suffix displayed after the input, e.g. "KB" or "ms" */
  suffix?: string
}

export interface ActiveToken {
  /** Stable internal ID (uuid v4) */
  id: string
  /** Matches a TokenDefinition slug */
  slug: string
  /** Current value — type depends on the token's TokenType */
  value: string | number | boolean
  /** When true, the chip cannot be removed (no × button, Escape does not dismiss) */
  locked?: boolean
}

export interface SearchResult {
  slug: string
  value: string | number | boolean
}

export type Theme = 'light' | 'dark' | 'auto'

export interface TokenizedSearchBarProps {
  /** Colour theme. 'auto' follows the OS preference via prefers-color-scheme. Defaults to 'light'. */
  theme?: Theme
  /** Available token definitions the user can choose from */
  tokenDefinitions: TokenDefinition[]
  /** Controlled list of active tokens */
  value?: ActiveToken[]
  /** Initial tokens for uncontrolled usage */
  defaultValue?: ActiveToken[]
  /** Fires on every structural change (add / remove / value update) */
  onChange?: (tokens: ActiveToken[]) => void
  /** Fires when the user explicitly triggers a search */
  onSearch?: (tokens: SearchResult[]) => void
  /** Placeholder text for the main type-ahead input */
  placeholder?: string
  /** Extra class name applied to the root element */
  className?: string
  /** Disables all interaction */
  disabled?: boolean
}
