# @majesticfudgie/tokenized-search-bar

A fully typesafe, styleable tokenized search bar for React. Users compose structured search queries by picking token types from a suggestion dropdown, then filling in values inline as chip inputs.

Zero runtime dependencies. ESM + CJS + TypeScript declarations. Optional default CSS.

---

## Features

- **Six input types** — `text`, `number`, `date`, `colour`, `boolean` (toggle), `select` (custom styled dropdown)
- **Chip tokens** — each token renders as a coloured pill with a label and an inline input
- **Locked tokens** — pre-populate tokens that can be edited but not removed
- **Controlled & uncontrolled** — supports both `value` / `onChange` and `defaultValue` patterns
- **Theming** — `light`, `dark`, and `auto` (follows OS preference) via `data-theme`; fully overridable with CSS custom properties
- **Accessible** — keyboard navigation throughout (arrows, Enter, Escape, Tab)

---

## Installation

```bash
npm install @majesticfudgie/tokenized-search-bar
```

```bash
yarn add @majesticfudgie/tokenized-search-bar
```

---

## Quick Start

```tsx
import { useState } from 'react'
import { TokenizedSearchBar } from '@majesticfudgie/tokenized-search-bar'
import '@majesticfudgie/tokenized-search-bar/dist/index.css'
import type { ActiveToken, TokenDefinition } from '@majesticfudgie/tokenized-search-bar'

const TOKEN_DEFS: TokenDefinition[] = [
  { slug: 'subject', label: 'Subject', type: 'text',    colour: '#93c5fd' },
  { slug: 'from',    label: 'From',    type: 'text',    colour: '#6ee7b7' },
  { slug: 'unread',  label: 'Unread',  type: 'boolean', colour: '#f9a8d4' },
  {
    slug: 'mailbox', label: 'Mailbox', type: 'select',  colour: '#fcd34d',
    options: ['Inbox', 'Sent', 'Drafts', 'Spam', 'Trash'],
  },
]

export default function Search() {
  const [tokens, setTokens] = useState<ActiveToken[]>([])

  return (
    <TokenizedSearchBar
      tokenDefinitions={TOKEN_DEFS}
      value={tokens}
      onChange={setTokens}
      onSearch={(results) => console.log(results)}
      placeholder="Search your inbox…"
      theme="light"
    />
  )
}
```

---

## Pre-populating a Locked Token

Pass a token with `locked: true` via `value` or `defaultValue`. A locked token has no × button and cannot be dismissed with Escape — it can only be edited.

```tsx
const [tokens, setTokens] = useState<ActiveToken[]>([
  {
    id: 'default-mailbox',
    slug: 'mailbox',
    value: 'Inbox',
    locked: true,
  },
])
```

---

## Component Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `tokenDefinitions` | `TokenDefinition[]` | **required** | Tokens available for the user to pick from |
| `value` | `ActiveToken[]` | — | Controlled list of active tokens |
| `defaultValue` | `ActiveToken[]` | — | Initial tokens for uncontrolled usage |
| `onChange` | `(tokens: ActiveToken[]) => void` | — | Fires on every structural change (add / remove / update) |
| `onSearch` | `(results: SearchResult[]) => void` | — | Fires when the user triggers a search (Enter or search button) |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Colour theme. `'auto'` follows `prefers-color-scheme` |
| `placeholder` | `string` | `'Search…'` | Placeholder for the main typeahead input |
| `className` | `string` | — | Extra class applied to the root element |
| `disabled` | `boolean` | `false` | Disables all interaction |

---

## TokenDefinition Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | ✓ | Unique identifier — returned in `onChange` / `onSearch` results |
| `label` | `string` | ✓ | Displayed on the chip and in the suggestion dropdown |
| `type` | `'text'\|'number'\|'date'\|'colour'\|'boolean'\|'select'` | ✓ | Governs the input rendered inside the chip |
| `description` | `string` | — | Subtitle shown in the suggestion dropdown |
| `colour` | `string` | — | Hex chip background colour, e.g. `"#93c5fd"` |
| `placeholder` | `string` | — | Hint text inside the token input |
| `suffix` | `string` | — | Label appended after the input, e.g. `"KB"` or `"ms"` |
| `options` | `string[]` | — | Allowed values — required for `'select'` type |
| `multiple` | `boolean` | — | Allow this token to be added more than once |
| `min` | `number \| string` | — | Min constraint for `'number'` and `'date'` types |
| `max` | `number \| string` | — | Max constraint for `'number'` and `'date'` types |

---

## ActiveToken Shape

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Stable ID — generated automatically when a token is added |
| `slug` | `string` | Matches a `TokenDefinition` slug |
| `value` | `string \| number \| boolean` | Current value of the token input |
| `locked` | `boolean` | Hides the × button and prevents Escape dismissal |

---

## Theming

The default stylesheet is fully optional. Import it if you want the built-in styles:

```ts
import '@majesticfudgie/tokenized-search-bar/dist/index.css'
```

Override any variable on `.tsb` (the root element) or a parent selector:

```css
.my-search-bar {
  --tsb-bg:                       #ffffff;
  --tsb-border:                   #e2e8f0;
  --tsb-border-radius:            14px;
  --tsb-focus-ring:               #6366f1;
  --tsb-color:                    #1e293b;
  --tsb-font:                     inherit;
  --tsb-font-size:                0.875rem;
  --tsb-shadow:                   0 1px 3px rgba(0,0,0,0.07);

  --tsb-chip-text:                #1e1b4b;
  --tsb-chip-border-radius:       999px;
  --tsb-chip-input-bg:            rgba(255,255,255,0.5);
  --tsb-chip-input-border-radius: 10px;
  --tsb-chip-gradient:            linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 65%);

  --tsb-dropdown-bg:              #ffffff;
  --tsb-dropdown-border:          #e2e8f0;
  --tsb-dropdown-border-radius:   14px;
  --tsb-dropdown-hover:           #f8fafc;
  --tsb-dropdown-highlight:       #eef2ff;
  --tsb-dropdown-highlight-text:  #4338ca;
  --tsb-dropdown-shadow:          0 8px 24px rgba(0,0,0,0.12);

  --tsb-remove-btn-text:          rgba(0,0,0,0.55);
  --tsb-remove-btn-hover-bg:      rgba(0,0,0,0.12);
  --tsb-remove-btn-hover-text:    rgba(0,0,0,0.85);

  --tsb-disabled-opacity:         0.45;
}
```

---

## License

MIT
