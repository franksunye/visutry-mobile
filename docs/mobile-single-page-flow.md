# VisuTry Mobile IA: Stateful Home + Lightweight Views

This branch changes the early mobile product direction away from tab navigation.

The product is not a multi-tab app, and it is also not a page that expands every possible function inline. It is a lightweight tool with one primary home state and a small set of focused secondary views.

## Product principle

The early version helps a user complete one job:

> Upload a face photo → get a face report → review recommended frames → preview try-on results.

## Core model

### Home is the main state surface

Home answers:

- What is my current state?
- What is the next best action?
- What core result do I already have?

### Secondary views are focused task/detail surfaces

Secondary views are allowed, but they must remain lightweight and always return directly to Home.

There is no bottom tab navigation.
There is no multi-level stack.
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
6. Every visible clickable item must either:
   - change `FlowState`,
   - change `ViewState`,
   - return to Home,
   - or display a clear feedback notice.
7. Labels such as `已生成` or `Top 4` are status text, not buttons.

## Review checklist

When reviewing locally, verify these flows:

- New user → start face analysis → photo check
- Photo check → start analysis → auto report ready
- Report summary → full report → 首页
- Report summary → recommended frames → 首页
- Recommended frames → try-on → 首页
- Try-on → save result → 首页 with feedback
- Try-on → poster placeholder → 首页
- Home → history → create new report
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
