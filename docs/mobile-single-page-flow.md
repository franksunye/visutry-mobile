# VisuTry Mobile Single Page Flow

This branch changes the early mobile product direction from tab navigation to a single-page stateful tool.

## Product principle

The early version is not a multi-section mobile app. It is a lightweight tool that helps a user complete one job:

> Upload a face photo → get a face report → review recommended frames → preview try-on results.

## Flow states

```ts
type FlowState =
  | 'empty'
  | 'photo-ready'
  | 'analyzing'
  | 'report-ready'
  | 'tryon-ready'
```

## Inline panels

Secondary actions do not open new pages. They expand inline panels inside the same page.

```ts
type InlinePanel =
  | 'none'
  | 'details'
  | 'privacy'
  | 'history'
  | 'settings'
  | 'saved'
```

## User scenarios

### 1. New user

Show a simple hero and one primary action: start face analysis.

Available actions:

- Start analysis → `photo-ready`
- View sample report → `report-ready`
- View recommended frames → `tryon-ready`
- Open settings → inline settings panel

### 2. Photo ready

Show the selected photo, quality tips, privacy note, and start analysis CTA.

Available actions:

- Start analysis → `analyzing`
- Re-select photo → `photo-ready`
- Privacy note → inline privacy panel

### 3. Analyzing

Show inline progress and analysis steps on the same page.

No navigation controls are needed. When progress completes, the page automatically moves to `report-ready`.

### 4. Report ready

Show report summary, metrics, frame recommendations, and CTA to preview try-on.

Available actions:

- Try recommended frames → `tryon-ready`
- View detail / size / style / recommendation logic → inline details panel
- Privacy → inline privacy panel
- Reanalyze → `photo-ready`
- History → inline history panel
- Settings → inline settings panel

### 5. Try-on ready

Show the four recommended try-on previews and secondary actions.

Available actions:

- Select / save a result → inline saved panel
- Generate poster → inline saved/poster placeholder
- Reanalyze → `photo-ready`
- Return to report summary → `report-ready`

## Interaction rules

1. No bottom tabs.
2. No second-level page stack for the early version.
3. The page changes by state, not by navigation depth.
4. Every visible clickable item must either:
   - change `FlowState`,
   - open an `InlinePanel`,
   - close an `InlinePanel`, or
   - display a clear feedback notice.
5. Labels such as `已生成` or `Top 4` are status text, not buttons.
6. Secondary settings/history/privacy/details are inline panels, not separate pages.

## Next engineering step

Replace static prototype state with real SDK output from:

- `@visutry/tryon-web`
- `@visutry/tryon-core`

Then add persistence for returning users:

- latest report
- selected frames
- saved try-on result
- privacy / retention state
