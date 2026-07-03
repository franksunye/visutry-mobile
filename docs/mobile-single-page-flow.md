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

## User scenarios

### 1. New user

Show a simple hero and one primary action: start face analysis.

### 2. Photo ready

Show the selected photo, quality tips, privacy note, and start analysis CTA.

### 3. Analyzing

Show inline progress and analysis steps on the same page.

### 4. Report ready

Show report summary, metrics, frame recommendations, and CTA to preview try-on.

### 5. Try-on ready

Show the four recommended try-on previews and secondary actions.

## Navigation rule

No bottom tabs. No second-level page stack.

The page changes by state, not by navigation depth.

## Next engineering step

Replace static prototype state with real SDK output from:

- `@visutry/tryon-web`
- `@visutry/tryon-core`
