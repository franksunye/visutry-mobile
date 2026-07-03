import type { GlassesItem, GlassesShape } from '@visutry/tryon-core'

export interface GlassesPreset {
  id: string
  name: string
  displayName: string
  style: string
  assetPath: string
  promptHint: string
  shapeCategory: GlassesShape
  overlayKind: 'round' | 'aviator' | 'brow' | 'square'
  dimensions: NonNullable<GlassesItem['dimensions']>
  material: string
}

/**
 * Mobile copy of visutry/src/config/glasses-presets.ts, enriched only with the
 * metadata required by @visutry/recommender and the landmark overlay.
 */
export const GLASSES_PRESETS: GlassesPreset[] = [
  {
    id: 'round-classic', name: 'Round', displayName: '经典圆框', style: 'Round',
    assetPath: '/assets/glasses-presets/round-classic.jpg',
    promptHint: 'classic black round glasses with soft circular lenses',
    shapeCategory: 'round', overlayKind: 'round',
    dimensions: { frameWidthMm: 138, lensWidthMm: 48, lensHeightMm: 48, bridgeWidthMm: 22 }, material: 'Acetate',
  },
  {
    id: 'aviator-classic', name: 'Aviator', displayName: '经典飞行员框', style: 'Aviator',
    assetPath: '/assets/glasses-presets/aviator-classic.jpg',
    promptHint: 'thin black aviator glasses with teardrop lenses and a double bridge',
    shapeCategory: 'aviator', overlayKind: 'aviator',
    dimensions: { frameWidthMm: 142, lensWidthMm: 58, lensHeightMm: 50, bridgeWidthMm: 14 }, material: 'Metal',
  },
  {
    id: 'rectangle-classic', name: 'Rectangle', displayName: '经典矩形框', style: 'Rectangle',
    assetPath: '/assets/glasses-presets/rectangle-classic.jpg',
    promptHint: 'classic black rectangular acetate glasses with clean straight lines',
    shapeCategory: 'rectangle', overlayKind: 'square',
    dimensions: { frameWidthMm: 140, lensWidthMm: 52, lensHeightMm: 36, bridgeWidthMm: 18 }, material: 'Acetate',
  },
  {
    id: 'browline-classic', name: 'Browline', displayName: '经典眉线框', style: 'Browline',
    assetPath: '/assets/glasses-presets/browline-classic.jpg',
    promptHint: 'black browline glasses with a stronger upper rim and thin lower rim',
    shapeCategory: 'browline', overlayKind: 'brow',
    dimensions: { frameWidthMm: 141, lensWidthMm: 51, lensHeightMm: 39, bridgeWidthMm: 19 }, material: 'Mixed',
  },
  {
    id: 'wayfarer-classic', name: 'Wayfarer', displayName: '经典旅行者框', style: 'Wayfarer',
    assetPath: '/assets/glasses-presets/wayfarer-classic.jpg',
    promptHint: 'classic black wayfarer glasses with softly angled square lenses',
    shapeCategory: 'square', overlayKind: 'square',
    dimensions: { frameWidthMm: 143, lensWidthMm: 52, lensHeightMm: 41, bridgeWidthMm: 18 }, material: 'Acetate',
  },
  {
    id: 'geometric-classic', name: 'Geometric', displayName: '现代几何框', style: 'Geometric',
    assetPath: '/assets/glasses-presets/geometric-classic.jpg',
    promptHint: 'thin black geometric hexagonal glasses with modern angular lenses',
    shapeCategory: 'square', overlayKind: 'square',
    dimensions: { frameWidthMm: 139, lensWidthMm: 50, lensHeightMm: 43, bridgeWidthMm: 20 }, material: 'Metal',
  },
  {
    id: 'cat-eye-classic', name: 'Cat-Eye', displayName: '经典猫眼框', style: 'Cat-Eye',
    assetPath: '/assets/glasses-presets/cat-eye-classic.jpg',
    promptHint: 'black acetate cat-eye glasses with elegant upswept outer corners',
    shapeCategory: 'cat-eye', overlayKind: 'square',
    dimensions: { frameWidthMm: 140, lensWidthMm: 52, lensHeightMm: 38, bridgeWidthMm: 16 }, material: 'Acetate',
  },
  {
    id: 'oval-classic', name: 'Oval', displayName: '经典椭圆框', style: 'Oval',
    assetPath: '/assets/glasses-presets/oval-classic.jpg',
    promptHint: 'thin black metal oval glasses with soft oval lenses',
    shapeCategory: 'oval', overlayKind: 'round',
    dimensions: { frameWidthMm: 137, lensWidthMm: 49, lensHeightMm: 42, bridgeWidthMm: 20 }, material: 'Metal',
  },
  {
    id: 'rimless-light', name: 'Light Rimless', displayName: '轻盈无框', style: 'Rimless',
    assetPath: '/assets/glasses-presets/rimless-light.jpg',
    promptHint: 'light rimless glasses with subtle transparent lenses and thin dark metal bridge',
    shapeCategory: 'rimless', overlayKind: 'round',
    dimensions: { frameWidthMm: 136, lensWidthMm: 51, lensHeightMm: 38, bridgeWidthMm: 18 }, material: 'Titanium',
  },
  {
    id: 'oversized-classic', name: 'Oversized', displayName: '经典大框', style: 'Oversized',
    assetPath: '/assets/glasses-presets/oversized-classic.jpg',
    promptHint: 'black acetate oversized glasses with large softly square lenses',
    shapeCategory: 'square', overlayKind: 'square',
    dimensions: { frameWidthMm: 148, lensWidthMm: 57, lensHeightMm: 49, bridgeWidthMm: 17 }, material: 'Acetate',
  },
  {
    id: 'narrow-rectangle-classic', name: 'Narrow Rectangle', displayName: '窄矩形框', style: 'Narrow Rectangle',
    assetPath: '/assets/glasses-presets/narrow-rectangle-classic.jpg',
    promptHint: 'slim black narrow rectangular glasses with shallow lenses',
    shapeCategory: 'rectangle', overlayKind: 'square',
    dimensions: { frameWidthMm: 136, lensWidthMm: 50, lensHeightMm: 30, bridgeWidthMm: 18 }, material: 'Acetate',
  },
  {
    id: 'square-classic', name: 'Square', displayName: '经典方框', style: 'Square',
    assetPath: '/assets/glasses-presets/square-classic.jpg',
    promptHint: 'black acetate square glasses with slightly softened corners',
    shapeCategory: 'square', overlayKind: 'square',
    dimensions: { frameWidthMm: 144, lensWidthMm: 54, lensHeightMm: 45, bridgeWidthMm: 17 }, material: 'Acetate',
  },
  {
    id: 'top-accent-classic', name: 'Top-Accent', displayName: '上缘强调框', style: 'Top-Accent',
    assetPath: '/assets/glasses-presets/top-accent-classic.jpg',
    promptHint: 'black top-accent glasses with a stronger upper rim and lighter lower rim',
    shapeCategory: 'browline', overlayKind: 'brow',
    dimensions: { frameWidthMm: 142, lensWidthMm: 52, lensHeightMm: 40, bridgeWidthMm: 18 }, material: 'Mixed',
  },
  {
    id: 'bottom-weighted-classic', name: 'Bottom-Weighted', displayName: '下缘强调框', style: 'Bottom-Weighted',
    assetPath: '/assets/glasses-presets/bottom-weighted-classic.jpg',
    promptHint: 'bottom-weighted glasses with a slightly stronger lower rim and lighter upper rim',
    shapeCategory: 'oval', overlayKind: 'round',
    dimensions: { frameWidthMm: 140, lensWidthMm: 51, lensHeightMm: 42, bridgeWidthMm: 18 }, material: 'Mixed',
  },
  {
    id: 'large-round-classic', name: 'Large Round', displayName: '大圆框', style: 'Large Round',
    assetPath: '/assets/glasses-presets/large-round-classic.jpg',
    promptHint: 'large black round glasses with oversized circular lenses',
    shapeCategory: 'round', overlayKind: 'round',
    dimensions: { frameWidthMm: 146, lensWidthMm: 56, lensHeightMm: 54, bridgeWidthMm: 18 }, material: 'Acetate',
  },
  {
    id: 'oversized-square-classic', name: 'Oversized Square', displayName: '超大方框', style: 'Oversized Square',
    assetPath: '/assets/glasses-presets/oversized-square-classic.jpg',
    promptHint: 'black acetate oversized square glasses with large square lenses',
    shapeCategory: 'square', overlayKind: 'square',
    dimensions: { frameWidthMm: 150, lensWidthMm: 58, lensHeightMm: 51, bridgeWidthMm: 16 }, material: 'Acetate',
  },
]

export const GLASSES_INVENTORY: GlassesItem[] = GLASSES_PRESETS.map((preset) => ({
  id: preset.id,
  name: preset.name,
  brand: 'VisuTry Preset',
  thumbnailUrl: preset.assetPath,
  shapeCategory: preset.shapeCategory,
  dimensions: preset.dimensions,
  material: preset.material,
  colors: ['Black'],
}))

export function getGlassesPreset(id: string): GlassesPreset | undefined {
  return GLASSES_PRESETS.find((preset) => preset.id === id)
}
