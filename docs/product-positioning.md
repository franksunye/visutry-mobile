# VisuTry Mobile Product Positioning

**Status:** Active positioning document  
**Created:** 2026-07-08  
**Owner:** Product / Engineering  
**Review cadence:** Monthly, or when mobile product scope changes  
**Scope:** Role of `visutry-mobile` within the broader VisuTry product system.

---

## 1. Purpose

This document defines what VisuTry Mobile is, how it relates to VisuTry Web and the VisuTry Try-On SDK, and what it should not become.

Working model:

> VisuTry Mobile is the camera-first mobile experience built on the VisuTry platform and SDK.

It is not a separate backend product and should not duplicate platform-owned commercial systems.

---

## 2. Relationship to VisuTry

VisuTry Mobile is one product surface within the broader VisuTry product system.

Short version:

```text
VisuTry             = product platform and commercial system
VisuTry Try-On SDK  = reusable face, recommendation, and try-on capability layer
VisuTry Mobile      = camera-first mobile product surface
```

Mobile should use:

- VisuTry platform APIs for account, credits, history, payment state, and persisted tasks;
- VisuTry Try-On SDK for local face analysis, camera-based try-on capabilities, and future mini-program adaptation.

---

## 3. Product Role

VisuTry Mobile should make the eyewear decision flow feel natural on a phone.

Primary mobile advantages:

- camera-first face capture;
- fast face-shape detection;
- mobile-friendly glasses advice;
- swipeable try-on and frame comparison;
- save and share results;
- lightweight retention through PWA installation;
- future WeChat Mini Program evolution.

Mobile should support the same core decision path as the web product:

```text
Face Shape Detector
→ Glasses Advisor
→ Virtual Try-On
→ Frame Compare
→ Save / Share / Buy
```

---

## 4. What Mobile Owns

Mobile should own the mobile-specific experience layer.

It owns:

- PWA shell;
- mobile navigation;
- camera-first photo capture flow;
- mobile upload experience;
- touch-first result viewer;
- mobile frame comparison interaction;
- mobile state management;
- offline-friendly UI where appropriate;
- future mini-program migration boundary;
- platform adapters that keep `core/` independent from DOM or runtime-specific APIs.

Mobile should optimize for:

- speed;
- one-handed use;
- clear photo capture guidance;
- simple result review;
- easy sharing;
- low-friction return visits.

---

## 5. What Mobile Does Not Own

Mobile should not become a separate business system.

Out of scope:

- independent user account system;
- independent billing;
- independent credits ledger;
- independent Stripe checkout system;
- independent AI generation backend;
- independent merchant dashboard;
- independent SEO/GEO strategy;
- independent product roadmap source of truth.

Those belong to the main VisuTry platform.

If Mobile needs any of those capabilities, it should call platform APIs or follow platform-defined product behavior.

---

## 6. Architecture Direction

Current layering should remain intentional:

```text
src/
├── core/          # platform-independent logic
│   ├── api/       # clients for VisuTry platform APIs
│   ├── types/     # business types aligned with the platform
│   ├── face-shape/# SDK-consuming face-shape recommendation logic
│   └── state/     # shared state management
├── platform/      # runtime/platform adapters
│   └── web/       # DOM, camera, PWA, IndexedDB
└── ui/            # React web UI components
```

Rules:

1. `core/` should not import DOM APIs directly.
2. Platform capabilities should be injected through adapters.
3. Business types should stay aligned with the main VisuTry platform.
4. SDK usage should be wrapped so future WeChat / mobile runtime changes do not rewrite business logic.
5. Mobile should not fork product rules such as credits, quota, or payment behavior.

---

## 7. Dependency Direction

Mobile should depend on platform and SDK capabilities. Platform and SDK should not depend on Mobile.

```text
visutry-mobile
  ├── calls VisuTry platform APIs
  └── uses @visutry/tryon-web / future @visutry/tryon-wechat

VisuTry platform
  └── owns accounts, credits, history, payments, commercial workflows

VisuTry SDK
  └── owns reusable face / recommendation / try-on capabilities
```

---

## 8. Product Priorities

### Near term

- Keep Mobile lightweight.
- Focus on camera-first face detection and try-on experience.
- Reuse SDK and platform APIs instead of creating new backend logic.
- Align mobile flows with the web product path.

### Medium term

- Improve mobile comparison UX.
- Add save/share flows aligned with platform account and history behavior.
- Support Credits Pack conversion only through platform-owned payment behavior.
- Prepare `core/` for future mini-program adaptation.

### Long term

- Evolve toward WeChat Mini Program if market need justifies it.
- Reuse `@visutry/tryon-wechat` where possible.
- Keep Mobile as a product surface, not a separate commercial platform.

---

## 9. Integration Questions

Before adding major features to Mobile, answer:

1. Does this belong in Mobile, the SDK, or the main platform?
2. Does this duplicate platform-owned account, credit, or payment logic?
3. Can the behavior be reused by Web or future Mini Program?
4. Does it preserve the `core/` / `platform/` boundary?
5. Does it align with the shared product path?

---

## 10. Related Repositories

- `franksunye/VisuTry` — main product platform and commercial source of truth.
- `franksunye/visutry-tryon-sdk` — reusable face, recommendation, and try-on capability layer.

---

## 11. Change Log

| Date | Change |
| --- | --- |
| 2026-07-08 | Created mobile product positioning and scope boundary document. |
