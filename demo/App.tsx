import { useEffect, useState } from 'react'
import { TokenizedSearchBar } from '../src'
import type { ActiveToken, SearchResult, Theme, TokenDefinition } from '../src'

const EMAIL_TOKENS: TokenDefinition[] = [
  {
    slug: 'subject',
    label: 'Subject',
    description: 'The email subject line',
    colour: '#93c5fd',
    type: 'text',
  },
  {
    slug: 'from',
    label: 'From',
    description: 'Sender email address or name',
    colour: '#6ee7b7',
    type: 'text',
  },
  {
    slug: 'to',
    label: 'To',
    description: 'Recipient email address or name',
    colour: '#86efac',
    type: 'text',
    multiple: true,
  },
  {
    slug: 'cc',
    label: 'CC',
    description: 'CC recipient email address or name',
    colour: '#bbf7d0',
    type: 'text',
    multiple: true,
  },
  {
    slug: 'bcc',
    label: 'BCC',
    description: 'BCC recipient email address or name',
    colour: '#a7f3d0',
    type: 'text',
    multiple: true,
  },
  {
    slug: 'mailbox',
    label: 'Mailbox',
    description: 'The mailbox or folder to search in',
    colour: '#fcd34d',
    type: 'select',
    options: ['Inbox', 'Sent', 'Drafts', 'Spam', 'Trash', 'Archive'],
    placeholder: 'Select mailbox…',
  },
  {
    slug: 'has_attachment',
    label: 'Has Attachment',
    description: 'Filter emails that have file attachments',
    colour: '#f9a8d4',
    type: 'boolean',
  },
  {
    slug: 'received_after',
    label: 'Received After',
    description: 'Only emails received after this date',
    colour: '#c4b5fd',
    type: 'date',
  },
  {
    slug: 'received_before',
    label: 'Received Before',
    description: 'Only emails received before this date',
    colour: '#a5b4fc',
    type: 'date',
  },
  {
    slug: 'size_kb',
    label: 'Size',
    description: 'Minimum email size in kilobytes',
    colour: '#fdba74',
    type: 'number',
    placeholder: '0',
    min: 0,
    suffix: 'KB',
  },
  {
    slug: 'label',
    label: 'Label',
    description: 'A tag or label applied to the email',
    colour: '#818cf8',
    type: 'text',
    multiple: true,
  },
  {
    slug: 'highlight_colour',
    label: 'Highlight',
    description: 'Emails highlighted with this colour',
    colour: '#f0abfc',
    type: 'colour',
  },
]

const DEFAULT_TOKENS: ActiveToken[] = [
  {
    id: 'locked-mailbox',
    slug: 'mailbox',
    value: 'Inbox',
    locked: true,
  },
]

const THEMES: Theme[] = ['light', 'dark', 'auto']

export default function App() {
  const [tokenDefs, setTokenDefs] = useState<TokenDefinition[]>(EMAIL_TOKENS)
  const [tokens, setTokens] = useState<ActiveToken[]>(DEFAULT_TOKENS)
  const [lastSearch, setLastSearch] = useState<SearchResult[] | null>(null)
  const [theme, setTheme] = useState<Theme>('light')
  const [osIsDark, setOsIsDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setOsIsDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const isDark = theme === 'dark' || (theme === 'auto' && osIsDark)

  function handleReset() {
    setTokens(DEFAULT_TOKENS)
    setLastSearch(null)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#13131f' : '#f1f5f9',
      transition: 'background 0.2s',
    }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: isDark ? '#e2e8f0' : '#0f172a' }}>
            Tokenized Search Bar
          </h1>
          <div style={{ display: 'flex', gap: 4 }}>
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 6,
                  border: `1px solid ${theme === t ? '#6366f1' : (isDark ? '#334155' : '#e2e8f0')}`,
                  background: theme === t ? '#6366f1' : (isDark ? '#1e1e2e' : '#fff'),
                  color: theme === t ? '#fff' : (isDark ? '#94a3b8' : '#475569'),
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  transition: 'all 0.15s',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <p style={{ color: isDark ? '#64748b' : '#64748b', marginBottom: 24, marginTop: 0, fontSize: '0.875rem' }}>
          An email inbox search demo. The <strong>Mailbox</strong> token is locked — it can be edited but not removed.
        </p>

        <TokenizedSearchBar
          tokenDefinitions={tokenDefs}
          value={tokens}
          onChange={setTokens}
          onSearch={setLastSearch}
          placeholder="Add a search filter…"
          theme={theme}
        />

        <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center' }}>
          <button
            onClick={handleReset}
            style={{
              padding: '5px 14px',
              borderRadius: 6,
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              background: isDark ? '#1e1e2e' : '#fff',
              color: isDark ? '#94a3b8' : '#475569',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            Reset
          </button>
          <span style={{ color: isDark ? '#475569' : '#94a3b8', fontSize: '0.78rem' }}>
            Press Enter or click the search button to fire onSearch
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 28 }}>
          <section>
            <h2 style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 8, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              onChange — active tokens
            </h2>
            <pre style={preStyle}>{JSON.stringify(tokens, null, 2)}</pre>
          </section>
          <section>
            <h2 style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 8, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              onSearch — last result
            </h2>
            <pre style={preStyle}>
              {lastSearch === null ? '(not fired yet)' : JSON.stringify(lastSearch, null, 2)}
            </pre>
          </section>
        </div>

        <section style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 12, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Token definitions passed to{' '}
            <code style={{ background: isDark ? '#1e293b' : '#f1f5f9', padding: '1px 5px', borderRadius: 4, textTransform: 'none', letterSpacing: 'normal' }}>
              tokenDefinitions
            </code>
          </h2>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', color: isDark ? '#94a3b8' : '#374151' }}>
              <thead>
                <tr style={{ background: isDark ? '#1e1e2e' : '#f8fafc', borderBottom: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}` }}>
                  {(['slug', 'label', 'type', 'description', 'colour', 'placeholder', 'options', 'multiple', 'min', 'max', 'suffix'] as const).map((col) => (
                    <th key={col} style={{ padding: '7px 12px', textAlign: 'left', fontWeight: 600, color: isDark ? '#475569' : '#6b7280', whiteSpace: 'nowrap' }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tokenDefs.map((def, i) => (
                  <tr key={def.slug} style={{ borderBottom: `1px solid ${isDark ? '#1e293b' : '#f1f5f9'}`, background: i % 2 === 0 ? (isDark ? '#13131f' : '#fff') : (isDark ? '#0f0f1a' : '#fafafa') }}>
                    <td style={{ padding: '7px 12px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{def.slug}</td>
                    <td style={{ padding: '7px 12px', whiteSpace: 'nowrap' }}>
                      <span style={{ background: def.colour ?? '#e5e7eb', padding: '2px 8px', borderRadius: 5, fontWeight: 700, fontSize: '0.75rem', color: '#1e1b4b' }}>
                        {def.label}
                      </span>
                    </td>
                    <td style={{ padding: '7px 12px', fontFamily: 'monospace', color: '#7c3aed' }}>{def.type}</td>
                    <td style={{ padding: '7px 12px', color: isDark ? '#64748b' : '#6b7280' }}>{def.description ?? <em style={{ opacity: 0.4 }}>—</em>}</td>
                    <td style={{ padding: '7px 12px' }}>
                      {def.colour
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ width: 13, height: 13, borderRadius: 3, background: def.colour, border: '1px solid rgba(0,0,0,0.12)', flexShrink: 0 }} />
                            <code style={{ fontFamily: 'monospace' }}>{def.colour}</code>
                          </span>
                        : <em style={{ opacity: 0.4 }}>—</em>}
                    </td>
                    <td style={{ padding: '7px 12px', fontFamily: 'monospace', color: '#059669' }}>{def.placeholder ?? <em style={{ opacity: 0.4 }}>—</em>}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: '0.73rem' }}>
                      {def.options ? `[${def.options.join(', ')}]` : <em style={{ opacity: 0.4 }}>—</em>}
                    </td>
                    <td style={{ padding: '7px 12px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={def.multiple ?? false}
                        onChange={(e) =>
                          setTokenDefs((prev) =>
                            prev.map((d) => d.slug === def.slug ? { ...d, multiple: e.target.checked } : d)
                          )
                        }
                        style={{ cursor: 'pointer', accentColor: '#6366f1', width: 14, height: 14 }}
                      />
                    </td>
                    <td style={{ padding: '7px 12px', fontFamily: 'monospace' }}>{def.min ?? <em style={{ opacity: 0.4 }}>—</em>}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'monospace' }}>{def.max ?? <em style={{ opacity: 0.4 }}>—</em>}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'monospace', color: '#0891b2' }}>{def.suffix ?? <em style={{ opacity: 0.4 }}>—</em>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== DOCUMENTATION ===== */}
        <div style={{ marginTop: 64, paddingTop: 48, borderTop: `2px solid ${isDark ? '#1e293b' : '#e2e8f0'}` }}>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: isDark ? '#e2e8f0' : '#0f172a', marginBottom: 4, marginTop: 0 }}>
            Documentation
          </h2>
          <p style={{ color: isDark ? '#64748b' : '#64748b', fontSize: '0.875rem', marginTop: 0, marginBottom: 20 }}>
            A fully typesafe, styleable tokenized search bar for React. Zero runtime dependencies.
          </p>

          {/* Table of contents */}
          <nav style={{
            display: 'flex', flexWrap: 'wrap', gap: '6px 4px', marginBottom: 40,
            padding: '14px 16px', borderRadius: 10,
            background: isDark ? '#0f0f1a' : '#f8fafc',
            border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
          }}>
            {[
              ['Installation', 'installation'],
              ['Quick Start', 'quick-start'],
              ['Locked Tokens', 'locked-tokens'],
              ['Component Props', 'component-props'],
              ['TokenDefinition', 'tokendefinition-fields'],
              ['ActiveToken', 'activetoken-shape'],
              ['CSS Custom Properties', 'css-custom-properties'],
            ].map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                style={{
                  padding: '3px 10px', borderRadius: 999,
                  fontSize: '0.78rem', fontWeight: 500, textDecoration: 'none',
                  background: isDark ? '#1e1e2e' : '#fff',
                  border: `1px solid ${isDark ? '#313244' : '#e2e8f0'}`,
                  color: isDark ? '#818cf8' : '#4338ca',
                }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Installation */}
          <DocSection id="installation" heading="Installation" isDark={isDark}>
            <pre style={preStyle}>{'npm install @majesticfudgie/tokenized-search-bar'}</pre>
            <pre style={{ ...preStyle, marginTop: 8 }}>{'yarn add @majesticfudgie/tokenized-search-bar'}</pre>
          </DocSection>

          {/* Quick Start */}
          <DocSection id="quick-start" heading="Quick Start" isDark={isDark}>
            <pre style={preStyle}>{`import { useState } from 'react'
import { TokenizedSearchBar } from '@majesticfudgie/tokenized-search-bar'
import '@majesticfudgie/tokenized-search-bar/dist/index.css'
import type { ActiveToken, TokenDefinition } from '@majesticfudgie/tokenized-search-bar'

const TOKEN_DEFS: TokenDefinition[] = [
  { slug: 'subject', label: 'Subject', type: 'text',   colour: '#93c5fd' },
  { slug: 'from',    label: 'From',    type: 'text',   colour: '#6ee7b7' },
  { slug: 'unread',  label: 'Unread',  type: 'boolean',colour: '#f9a8d4' },
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
}`}</pre>
          </DocSection>

          {/* Pre-populating a locked token */}
          <DocSection id="locked-tokens" heading="Pre-populating a Locked Token" isDark={isDark}>
            <p style={docBodyStyle(isDark)}>
              Pass a token with <Code isDark={isDark}>locked: true</Code> via <Code isDark={isDark}>value</Code> or <Code isDark={isDark}>defaultValue</Code>.
              A locked token renders with no × button and cannot be dismissed with Escape — it can only be edited.
            </p>
            <pre style={preStyle}>{`const [tokens, setTokens] = useState<ActiveToken[]>([
  {
    id: 'default-mailbox',
    slug: 'mailbox',
    value: 'Inbox',
    locked: true,   // user can change the value but not remove the chip
  },
])`}</pre>
          </DocSection>

          {/* Component Props */}
          <DocSection id="component-props" heading="Component Props" isDark={isDark}>
            <ApiTable isDark={isDark} rows={[
              ['tokenDefinitions', 'TokenDefinition[]', 'Yes', 'Tokens available for the user to pick from'],
              ['value', 'ActiveToken[]', '—', 'Controlled list of active tokens'],
              ['defaultValue', 'ActiveToken[]', '—', 'Initial tokens for uncontrolled usage'],
              ['onChange', '(tokens: ActiveToken[]) => void', '—', 'Fires on every structural change (add / remove / update)'],
              ['onSearch', '(results: SearchResult[]) => void', '—', 'Fires when the user triggers a search (Enter or search button)'],
              ['theme', "'light' | 'dark' | 'auto'", "'light'", "Colour theme. 'auto' follows the OS prefers-color-scheme"],
              ['placeholder', 'string', "'Search…'", 'Placeholder for the main typeahead input'],
              ['className', 'string', '—', 'Extra class applied to the root element for custom styles'],
              ['disabled', 'boolean', 'false', 'Disables all interaction'],
            ]} />
          </DocSection>

          {/* TokenDefinition */}
          <DocSection id="tokendefinition-fields" heading="TokenDefinition Fields" isDark={isDark}>
            <ApiTable isDark={isDark} rows={[
              ['slug', 'string', 'Yes', 'Unique identifier — returned in onChange / onSearch results'],
              ['label', 'string', 'Yes', 'Displayed on the chip and in the suggestion dropdown'],
              ['type', "'text'|'number'|'date'|'colour'|'boolean'|'select'", 'Yes', 'Governs the input rendered inside the chip'],
              ['description', 'string', '—', 'Subtitle shown in the suggestion dropdown'],
              ['colour', 'string', '—', 'Hex chip background colour, e.g. "#93c5fd"'],
              ['placeholder', 'string', '—', 'Hint text inside the token input'],
              ['suffix', 'string', '—', 'Label appended after the input, e.g. "KB" or "ms"'],
              ['options', 'string[]', '—', "Allowed values — required for 'select' type"],
              ['multiple', 'boolean', 'false', 'Allow this token to be added more than once'],
              ['min', 'number | string', '—', "Min constraint for 'number' and 'date' types"],
              ['max', 'number | string', '—', "Max constraint for 'number' and 'date' types"],
            ]} />
          </DocSection>

          {/* ActiveToken */}
          <DocSection id="activetoken-shape" heading="ActiveToken Shape" isDark={isDark}>
            <p style={docBodyStyle(isDark)}>This is the shape of each item in the <Code isDark={isDark}>value</Code> / <Code isDark={isDark}>onChange</Code> array.</p>
            <ApiTable isDark={isDark} rows={[
              ['id', 'string', 'Yes', 'Stable ID — generated automatically when a token is added'],
              ['slug', 'string', 'Yes', 'Matches a TokenDefinition slug'],
              ['value', 'string | number | boolean', 'Yes', 'Current value of the token input'],
              ['locked', 'boolean', 'false', 'Hides the × button and prevents Escape dismissal'],
            ]} />
          </DocSection>

          {/* CSS Custom Properties */}
          <DocSection id="css-custom-properties" heading="CSS Custom Properties" isDark={isDark}>
            <p style={docBodyStyle(isDark)}>
              Import <Code isDark={isDark}>@majesticfudgie/tokenized-search-bar/dist/index.css</Code> for default styles,
              then override any variable on the <Code isDark={isDark}>.tsb</Code> root element or a parent selector.
            </p>
            <pre style={preStyle}>{`.my-search-bar {
  --tsb-bg:                    #ffffff;
  --tsb-border:                #e2e8f0;
  --tsb-border-radius:         14px;       /* fixed radius — stays consistent as bar grows */
  --tsb-focus-ring:            #6366f1;
  --tsb-color:                 #1e293b;    /* main input text */
  --tsb-font:                  inherit;
  --tsb-font-size:             0.875rem;
  --tsb-shadow:                0 1px 3px rgba(0,0,0,0.07);

  --tsb-chip-text:             #1e1b4b;    /* always dark — chip backgrounds are bright */
  --tsb-chip-border-radius:    999px;      /* pill chips */
  --tsb-chip-input-bg:         rgba(255,255,255,0.5);
  --tsb-chip-input-border-radius: 10px;
  --tsb-chip-gradient:         linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 65%);

  --tsb-dropdown-bg:           #ffffff;
  --tsb-dropdown-border:       #e2e8f0;
  --tsb-dropdown-border-radius:14px;
  --tsb-dropdown-hover:        #f8fafc;
  --tsb-dropdown-highlight:    #eef2ff;
  --tsb-dropdown-highlight-text:#4338ca;
  --tsb-dropdown-shadow:       0 8px 24px rgba(0,0,0,0.12);

  --tsb-remove-btn-text:       rgba(0,0,0,0.55);
  --tsb-remove-btn-hover-bg:   rgba(0,0,0,0.12);
  --tsb-remove-btn-hover-text: rgba(0,0,0,0.85);

  --tsb-disabled-opacity:      0.45;
}`}</pre>
          </DocSection>

        </div>
      </div>
    </div>
  )
}

/* ---- Documentation helpers ---- */

function DocSection({ id, heading, isDark, children }: { id: string; heading: string; isDark: boolean; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 40, scrollMarginTop: 16 }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#c7d2fe' : '#4338ca', marginBottom: 12, marginTop: 0, letterSpacing: '0.01em' }}>
        <a href={`#${id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {heading}
          <span style={{ marginLeft: 8, opacity: 0.35, fontWeight: 400, fontSize: '0.85em' }}>#</span>
        </a>
      </h3>
      {children}
    </section>
  )
}

function Code({ children, isDark }: { children: React.ReactNode; isDark: boolean }) {
  return (
    <code style={{ background: isDark ? '#1e293b' : '#f1f5f9', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: '0.85em' }}>
      {children}
    </code>
  )
}

function ApiTable({ rows, isDark }: { rows: string[][]; isDark: boolean }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 10, border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', color: isDark ? '#94a3b8' : '#374151' }}>
        <thead>
          <tr style={{ background: isDark ? '#1e1e2e' : '#f8fafc', borderBottom: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}` }}>
            {['Prop', 'Type', 'Default', 'Description'].map((h) => (
              <th key={h} style={{ padding: '7px 12px', textAlign: 'left', fontWeight: 600, color: isDark ? '#475569' : '#6b7280', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([prop, type, def, desc], i) => (
            <tr key={prop} style={{ borderBottom: `1px solid ${isDark ? '#1e293b' : '#f1f5f9'}`, background: i % 2 === 0 ? (isDark ? '#13131f' : '#fff') : (isDark ? '#0f0f1a' : '#fafafa') }}>
              <td style={{ padding: '7px 12px', fontFamily: 'monospace', whiteSpace: 'nowrap', color: isDark ? '#c7d2fe' : '#4338ca', fontWeight: 600 }}>{prop}</td>
              <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: '0.73rem', color: isDark ? '#64748b' : '#7c3aed', whiteSpace: 'nowrap' }}>{type}</td>
              <td style={{ padding: '7px 12px', fontFamily: 'monospace', color: isDark ? '#475569' : '#94a3b8', whiteSpace: 'nowrap' }}>{def}</td>
              <td style={{ padding: '7px 12px', color: isDark ? '#64748b' : '#6b7280' }}>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function docBodyStyle(isDark: boolean): React.CSSProperties {
  return { fontSize: '0.875rem', color: isDark ? '#64748b' : '#475569', marginTop: 0, marginBottom: 12, lineHeight: 1.6 }
}

const preStyle: React.CSSProperties = {
  background: '#0f172a',
  color: '#94a3b8',
  borderRadius: 8,
  padding: '14px 16px',
  fontSize: '0.75rem',
  lineHeight: 1.65,
  overflowX: 'auto',
  minHeight: 80,
  margin: 0,
  border: '1px solid #1e293b',
}
