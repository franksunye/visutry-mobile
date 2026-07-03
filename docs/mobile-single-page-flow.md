# VisuTry Mobile IA: Stateful Home + Strict Two-Level Views

This branch changes the early mobile product direction away from tab navigation.

The product is not a multi-tab app, and it is also not a page that expands every possible function inline. It is a lightweight tool with one primary home state and a small set of focused secondary views.

## Product principle

The early version helps a user complete one job:

> Upload a face photo → get a face report → review recommended frames → preview try-on results.

## Core model

### Home is the only navigation hub

Home answers:

- What is my current state?
- What is the next best action?
- What core result do I already have?

### Secondary views are terminal

Secondary views are allowed, but they are terminal task/detail surfaces.

There is no bottom tab navigation.
There is no multi-level stack.
There is no secondary-to-secondary navigation.

There is only:

`Home → focused view → Home`

## Flow states

```ts
type FlowState =
  | 'empty'
  | 'photo-ready'
  | 'analyzing'
  | 'report-ready'
  | 'tryon-ready'
```

## View states

```ts
type ViewState =
  | 'home'
  | 'report-detail'
  | 'frames'
  | 'tryon'
  | 'history'
  | 'settings'
  | 'poster'
```

## Home content rules

Home should show summaries and primary CTAs only.

Allowed on Home:

- current status hero
- photo check when photo is selected
- analysis progress when analyzing
- report summary when report exists
- top recommended frames summary
- try-on summary after try-on is ready
- small utility entry points

Avoid on Home:

- full report details
- full frame lists
- history lists
- settings content
- privacy explanation blocks
- poster generation content

Those belong in secondary views.

## Strict two-level navigation rule

The app has only two levels:

- Level 1: Home
- Level 2: one focused secondary view

Secondary views cannot open another secondary view.

Allowed secondary-view actions:

1. Return Home.
2. Update `FlowState` and return Home.
3. Show a simple feedback notice on Home.

Disallowed:

- `report-detail → frames`
- `report-detail → tryon`
- `frames → report-detail`
- `frames → tryon`
- `tryon → poster`
- `history → report-detail`
- `settings → report-detail`

Instead, these actions update Home state and return to Home.

Examples:

```ts
// History item selected
setFlowState('report-ready')
setView('home')
```

```ts
// Frames page try-on CTA
setFlowState('tryon-ready')
setView('home')
```

```ts
// Try-on page poster CTA
setFlowState('tryon-ready')
setView('home')
setNotice('已生成海报占位')
```

## Secondary view rules

Each secondary view has one clear top escape:

`← 首页`

This is intentionally different from generic back navigation. It stabilizes the user mental model: every secondary task returns to the main home state.

Secondary views should be shallow and focused:

- `report-detail`: full report, metrics, size/style explanation
- `frames`: complete recommended frame list and avoid list
- `tryon`: full try-on preview grid and save/poster actions
- `history`: recent reports and create-new-report action
- `settings`: privacy, data, notification placeholder, reset
- `poster`: poster/export placeholder

## Interaction rules

1. No bottom tabs.
2. No multi-level page stack.
3. Home changes by `FlowState`.
4. Secondary screens change by `ViewState`.
5. Every secondary view must offer a visible `首页` return action.
6. Secondary views are terminal and cannot navigate to other secondary views.
7. Every visible clickable item must either:
   - change `FlowState` and return Home,
   - change `ViewState` from Home only,
   - return to Home,
   - or display a clear feedback notice on Home.
8. Labels such as `已生成` or `Top 4` are status text, not buttons.

## Review checklist

When reviewing locally, verify these flows:

- New user → start face analysis → photo check
- Photo check → start analysis → auto report ready
- Home → full report → 首页
- Home → recommended frames → 首页
- Home → try-on → save result → 首页 with feedback
- Home → try-on → poster placeholder → 首页 with feedback
- Home → history → select report → 首页 with report state
- Home → history → create new report → 首页 with photo-ready state
- Home → settings/privacy → 首页
- Reset current flow → empty state

## Next engineering step

Replace static prototype state with real SDK output from:

- `@visutry/tryon-web`
- `@visutry/tryon-core`

Then add persistence for returning users:

- latest report
- selected frames
- saved try-on result
- privacy / retention state
