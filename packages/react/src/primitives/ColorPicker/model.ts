import { colorToCSS, okhclToRGBA, rgba255ToColor } from '@open-pencil/core/color'
import type { OkHCLColor } from '@open-pencil/core/color'
import type { Fill, Stroke } from '@open-pencil/core/scene-graph'
import type { Color } from '@open-pencil/core/types'

export interface ColorPickerModel {
  color: Color
  rgb: { r: number; g: number; b: number; a: number }
  hsl: { h: number; s: number; l: number; a: number }
  hsb: { h: number; s: number; b: number; a: number }
}

export interface SliderPreviewModel {
  hue: Color
  hslSaturation: Color
  hslLightness: Color
  hsbSaturation: Color
  hsbBrightness: Color
}

export interface OkHCLSliderPreviewModel {
  okhclHue: Color
  okhclChroma: Color
  okhclLightness: Color
}

export interface SliderGradientModel {
  hslSaturation: string
  hslLightness: string
  hsbSaturation: string
  hsbBrightness: string
}

export interface OkHCLSliderGradientModel {
  okhclChroma: string
  okhclLightness: string
}

const OKHCL_CHROMA_MAX = 0.4
const OKHCL_LIGHTNESS_MID = 0.5
const OKHCL_HUE_PREVIEW_MIN_CHROMA = 0.15
const OKHCL_HUE_PREVIEW_FALLBACK_LIGHTNESS = 0.7

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0))
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h *= 60
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function rgbToHsb(r: number, g: number, b: number): { h: number; s: number; b: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const d = max - min
  const b2 = Math.round(max * 100)
  let h = 0
  const s = max === 0 ? 0 : Math.round((d / max) * 100)
  if (max !== min) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0))
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h *= 60
  }
  return { h: Math.round(h), s, b: b2 }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100
  let r, g, b
  if (s === 0) { r = g = b = l }
  else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

function hsbToRgb(h: number, s: number, b: number): { r: number; g: number; bb: number } {
  h /= 360; s /= 100; b /= 100
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = b * (1 - s)
  const q = b * (1 - f * s)
  const t = b * (1 - (1 - f) * s)
  let r, g, bb
  switch (i % 6) {
    case 0: r = b; g = t; bb = p; break
    case 1: r = q; g = b; bb = p; break
    case 2: r = p; g = b; bb = t; break
    case 3: r = p; g = q; bb = b; break
    case 4: r = t; g = p; bb = b; break
    default: r = b; g = p; bb = q; break
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), bb: Math.round(bb * 255) }
}

export function createColorPickerModel(color: Color): ColorPickerModel {
  const r = Math.round(color.r * 255), g = Math.round(color.g * 255), b = Math.round(color.b * 255)
  const hsl = rgbToHsl(r, g, b)
  const hsb = rgbToHsb(r, g, b)
  return {
    color,
    rgb: { r, g, b, a: color.a },
    hsl: { ...hsl, a: color.a },
    hsb: { ...hsb, a: color.a }
  }
}

export function rekaToAppColor(hsb: { h: number; s: number; b: number; a: number }): Color {
  const { r, g, bb } = hsbToRgb(hsb.h, hsb.s, hsb.b)
  return rgba255ToColor(r, g, bb, hsb.a)
}

export function updateHue(model: ColorPickerModel, hue: number): Color {
  const nextSaturation = model.hsb.s === 0 ? 100 : model.hsb.s
  const nextBrightness = model.hsb.b === 0 ? 100 : model.hsb.b
  const { r, g, bb } = hsbToRgb(hue, nextSaturation, nextBrightness)
  return rgba255ToColor(r, g, bb, model.hsb.a)
}

export function updateAlpha(color: Color, alpha: number): Color {
  return { ...color, a: clampUnit(alpha) }
}

export function updateRGBChannel(color: Color, channel: 'r' | 'g' | 'b', value255: number): Color {
  return { ...color, [channel]: clampUnit(value255 / 255) }
}

export function updateHSLChannel(model: ColorPickerModel, channel: 'h' | 's' | 'l', value: number): Color {
  const next = { ...model.hsl, [channel]: channel === 'h' ? value : clampPercent(value) }
  if (channel === 's' && model.hsl.s === 0 && clampPercent(value) > 0) {
    next.h = model.hsl.h
    if (model.hsl.l >= 100) next.l = 50
    if (model.hsl.l <= 0) next.l = 50
  }
  const { r, g, b } = hslToRgb(next.h, next.s, next.l)
  return rgba255ToColor(r, g, b, next.a)
}

export function updateHSBChannel(model: ColorPickerModel, channel: 'h' | 's' | 'b', value: number): Color {
  const next = { ...model.hsb, [channel]: channel === 'h' ? value : clampPercent(value) }
  const { r, g, bb } = hsbToRgb(next.h, next.s, next.b)
  return rgba255ToColor(r, g, bb, next.a)
}

export function createSliderPreviewModel(model: ColorPickerModel): SliderPreviewModel {
  const { r, g, bb } = hsbToRgb(model.hsb.h, 100, 100)
  return {
    hue: rgba255ToColor(r, g, bb, model.hsb.a),
    hslSaturation: rgba255ToColor(...Object.values(hslToRgb(model.hsl.h, model.hsl.s, model.hsl.l)).map((v) => v as number) as [number, number, number], model.hsl.a),
    hslLightness: rgba255ToColor(...Object.values(hslToRgb(model.hsl.h, model.hsl.s, model.hsl.l)).map((v) => v as number) as [number, number, number], model.hsl.a),
    hsbSaturation: model.color,
    hsbBrightness: model.color
  }
}

export function createOkHCLSliderPreviewModel(color: OkHCLColor): OkHCLSliderPreviewModel {
  return {
    okhclHue: okhclToRGBA({ ...color, c: Math.max(color.c, OKHCL_HUE_PREVIEW_MIN_CHROMA), l: color.l <= 0 || color.l >= 1 ? OKHCL_HUE_PREVIEW_FALLBACK_LIGHTNESS : color.l }),
    okhclChroma: okhclToRGBA(color),
    okhclLightness: okhclToRGBA(color)
  }
}

export function createOkHCLSliderGradientModel(color: OkHCLColor): OkHCLSliderGradientModel {
  const lowChroma = okhclToRGBA({ ...color, c: 0 })
  const highChroma = okhclToRGBA({ ...color, c: OKHCL_CHROMA_MAX })
  const lowLightness = okhclToRGBA({ ...color, l: 0 })
  const midLightness = okhclToRGBA({ ...color, l: OKHCL_LIGHTNESS_MID })
  const highLightness = okhclToRGBA({ ...color, l: 1 })
  return {
    okhclChroma: `background: linear-gradient(to right, ${colorToCSS(lowChroma)}, ${colorToCSS(highChroma)});`,
    okhclLightness: `background: linear-gradient(to right, ${colorToCSS(lowLightness)}, ${colorToCSS(midLightness)}, ${colorToCSS(highLightness)});`
  }
}

export function createSliderGradientModel(model: ColorPickerModel): SliderGradientModel {
  const hslGray = rgba255ToColor(...Object.values(hslToRgb(model.hsl.h, 0, model.hsl.l)).map((v) => v as number) as [number, number, number], model.hsl.a)
  const hslColor = rgba255ToColor(...Object.values(hslToRgb(model.hsl.h, 100, model.hsl.l)).map((v) => v as number) as [number, number, number], model.hsl.a)
  const hslBlack = rgba255ToColor(...Object.values(hslToRgb(model.hsl.h, model.hsl.s, 0)).map((v) => v as number) as [number, number, number], model.hsl.a)
  const hslMid = rgba255ToColor(...Object.values(hslToRgb(model.hsl.h, model.hsl.s, 50)).map((v) => v as number) as [number, number, number], model.hsl.a)
  const hslWhite = rgba255ToColor(...Object.values(hslToRgb(model.hsl.h, model.hsl.s, 100)).map((v) => v as number) as [number, number, number], model.hsl.a)
  const hsbGray = rgba255ToColor(...Object.values(hsbToRgb(model.hsb.h, 0, model.hsb.b)).map((v) => v as number) as [number, number, number], model.hsb.a)
  const hsbColor = rgba255ToColor(...Object.values(hsbToRgb(model.hsb.h, 100, model.hsb.b)).map((v) => v as number) as [number, number, number], model.hsb.a)
  const hsbBlack = rgba255ToColor(...Object.values(hsbToRgb(model.hsb.h, model.hsb.s, 0)).map((v) => v as number) as [number, number, number], model.hsb.a)
  const hsbBright = rgba255ToColor(...Object.values(hsbToRgb(model.hsb.h, model.hsb.s, 100)).map((v) => v as number) as [number, number, number], model.hsb.a)
  return {
    hslSaturation: `background: linear-gradient(to right, ${colorToCSS(hslGray)}, ${colorToCSS(hslColor)});`,
    hslLightness: `background: linear-gradient(to right, ${colorToCSS(hslBlack)}, ${colorToCSS(hslMid)}, ${colorToCSS(hslWhite)});`,
    hsbSaturation: `background: linear-gradient(to right, ${colorToCSS(hsbGray)}, ${colorToCSS(hsbColor)});`,
    hsbBrightness: `background: linear-gradient(to right, ${colorToCSS(hsbBlack)}, ${colorToCSS(hsbBright)});`
  }
}

export function toPercent(value: number): number { return Math.round(value * 100) }
export function fromPercent(value: number): number { return clampUnit(value / 100) }

function clampUnit(value: number): number { return Math.max(0, Math.min(1, value)) }
function clampPercent(value: number): number { return Math.max(0, Math.min(100, value)) }

export function applySolidFillColor(fill: Fill, color: Color): Fill {
  return { ...fill, color, opacity: color.a }
}

export function applySolidStrokeColor(color: Color): Partial<Stroke> {
  return { color, opacity: color.a }
}