import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { FaceShapeResult, RecommendedGlasses } from '@visutry/tryon-core'
import type { FaceShapeAnalysisResult, FaceTryOnPlacement } from '@core/types'
import { GLASSES_INVENTORY, getGlassesPreset } from '@core/catalog/glasses-presets'
import { initWebPlatform } from './platform/web'
import { getPlatform } from '@core/platform'
import { Recommender } from '../packages/visutry-tryon-sdk/packages/recommender/dist/index.js'
import {
  ArrowLeft, ArrowRight, Camera, Check, ChevronRight, FileText, Glasses, Heart,
  Image as ImageIcon, LockKeyhole, MoreHorizontal, Ruler, Settings,
  ShieldCheck, Sparkles, Trash2, Wand2,
} from 'lucide-react'

type FlowState = 'empty' | 'photo-ready' | 'analyzing' | 'report-ready' | 'tryon-ready'
type ViewState = 'home' | 'report-detail' | 'frames' | 'tryon' | 'settings' | 'poster'

type FrameCard = {
  id: string
  name: string
  zh: string
  score: number
  kind: string
  thumbnailUrl: string
  reason: string
  caution?: string
}

const portrait = '/assets/face-model.png'

function recommendFrames(faceShape: FaceShapeResult): FrameCard[] {
  return new Recommender().recommend({
    faceShape,
    faceMetrics: faceShape.metrics,
    inventory: GLASSES_INVENTORY,
    preferences: {
      style: 'business',
      preferredMaterials: ['Acetate', 'Metal'],
    },
  }).map((recommendation: RecommendedGlasses) => {
    const preset = getGlassesPreset(recommendation.item.id)
    const firstReason = recommendation.reasons[0]
    const fallback = `${preset?.displayName ?? recommendation.item.name}与本次脸型及尺寸综合匹配`
    return {
      id: recommendation.item.id,
      name: recommendation.item.name,
      zh: preset?.displayName ?? recommendation.item.name,
      kind: preset?.overlayKind ?? recommendation.item.shapeCategory,
      thumbnailUrl: recommendation.item.thumbnailUrl,
      score: Math.round(recommendation.score * 100),
      reason: firstReason ? localizeReason(firstReason, fallback) : fallback,
      caution: recommendation.cautions?.[0],
    }
  })
}

const FACE_NAMES: Record<string, string> = {
  oval: '椭圆形脸', round: '圆形脸', square: '方形脸', heart: '心形脸',
  diamond: '菱形脸', oblong: '长形脸', triangle: '三角形脸', unknown: '未识别',
}

const FACE_SUMMARIES: Record<string, string> = {
  oval: '面部比例均衡，轮廓柔和，大多数镜框都能自然适配。',
  round: '面部线条柔和，长宽接近，利落的几何镜框更能增加层次。',
  square: '额头与下颌宽度接近，下颌线清晰，圆润镜框有助于平衡轮廓。',
  heart: '额头较宽、下巴较窄，轻盈或下缘柔和的镜框更协调。',
  diamond: '颧骨较突出、额头与下颌较窄，强调眉线的镜框更合适。',
  oblong: '脸部纵向比例较长，较高或略宽的镜框能改善视觉平衡。',
  triangle: '下颌宽于额头，上缘更有存在感的镜框能平衡面部重心。',
}

function localizeReason(reason: string, fallback?: string): string {
  if (reason.includes('complements')) return fallback ?? '脸型与镜框形状匹配'
  if (reason.includes('Frame width')) return '镜框宽度接近推荐尺寸'
  if (reason.includes('Lens width')) return '镜片宽度位于推荐范围'
  if (reason.includes('budget')) return '价格位于预算范围内'
  return fallback ?? reason
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="logo"><span className="logo-mark"><i /><i /><i /></span>{!compact && <b>VisuTry</b>}</div>
}

function PrimaryButton({ children, onClick, secondary = false }: { children: ReactNode; onClick?: () => void; secondary?: boolean }) {
  return <button className={`primary ${secondary ? 'secondary' : ''}`} onClick={onClick}>{children}</button>
}

function GlassOverlay({ frame, placement }: { frame: FrameCard; placement?: FaceTryOnPlacement }) {
  const assetWidth = placement ? placement.width * 1.08 : 0
  const style = placement ? {
    left: `${(placement.centerX - assetWidth / 2) * 100}%`,
    top: `${(placement.centerY - assetWidth * 0.306) * 100}%`,
    width: `${assetWidth * 100}%`,
    transform: `rotate(${placement.rotationDeg}deg)`,
  } : undefined
  return <img className="glasses-asset-overlay" src={frame.thumbnailUrl} alt="" aria-hidden="true" style={style} />
}

function Portrait({ glasses, className = '', src, placement }: { glasses?: FrameCard | false; className?: string; src?: string | null; placement?: FaceTryOnPlacement }) {
  const actual = Boolean(src)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [displayPlacement, setDisplayPlacement] = useState(placement)
  const [imageReady, setImageReady] = useState(0)

  useEffect(() => {
    const update = () => {
      const container = containerRef.current
      const image = imageRef.current
      if (!placement || !container || !image?.naturalWidth || !image.naturalHeight) {
        setDisplayPlacement(placement)
        return
      }
      const scale = Math.min(container.clientWidth / image.naturalWidth, container.clientHeight / image.naturalHeight)
      const renderedWidth = image.naturalWidth * scale
      const renderedHeight = image.naturalHeight * scale
      const offsetX = (container.clientWidth - renderedWidth) / 2
      const offsetY = (container.clientHeight - renderedHeight) / 2
      setDisplayPlacement({
        centerX: (offsetX + placement.centerX * renderedWidth) / container.clientWidth,
        centerY: (offsetY + placement.centerY * renderedHeight) / container.clientHeight,
        width: placement.width * renderedWidth / container.clientWidth,
        rotationDeg: placement.rotationDeg,
      })
    }
    update()
    const observer = new ResizeObserver(update)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [placement, src, imageReady])

  return <div ref={containerRef} className={`portrait ${actual ? 'actual-photo' : ''} ${className}`}><img ref={imageRef} onLoad={() => setImageReady((value) => value + 1)} src={src ?? portrait} alt={actual ? '本次分析照片' : '示例模特'} />{glasses && <GlassOverlay frame={glasses} placement={displayPlacement} />}</div>
}

function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return <div className="section-title"><strong>{title}</strong>{action && (onAction ? <button onClick={onAction}>{action}<ChevronRight /></button> : <span style={{ color: '#8792a5', fontSize: 12 }}>{action}</span>)}</div>
}

function AppHeader({ state, onReset, onSettings }: { state: FlowState; onReset: () => void; onSettings: () => void }) {
  return <div className="home-head">
    <Logo />
    <button className="capsule" onClick={state === 'empty' ? onSettings : onReset} aria-label={state === 'empty' ? '设置' : '重置流程'}>
      {state === 'empty' ? <MoreHorizontal /> : <Trash2 />}<span /><span />
    </button>
  </div>
}

function DetailTopBar({ title, onHome }: { title: string; onHome: () => void }) {
  return <header className="topbar"><button className="icon-btn" onClick={onHome} aria-label="回到首页"><ArrowLeft /></button><strong>{title}</strong><button className="capsule" onClick={onHome}>首页</button></header>
}

function StatusNotice({ message }: { message: string | null }) {
  if (!message) return null
  return <section className="content-section"><div className="success-note"><Check /> {message}</div></section>
}

function StateHero({ state, faceShape, frameCount, onUpload, onAnalyze, onShowReport, onTryOn }: { state: FlowState; faceShape?: FaceShapeResult; frameCount: number; onUpload: () => void; onAnalyze: () => void; onShowReport: () => void; onTryOn: () => void }) {
  if (state === 'empty') return <section className="hero-card">
    <div><span className="eyebrow"><Sparkles /> SDK Connected</span><h1>上传一张正面照，<br />找到更适合你的眼镜</h1><p>脸型分析 · SDK 推荐 · 试戴预览，首页完成主流程。</p></div>
    <div className="hero-art"><div className="gem">◆</div><Glasses /></div>
    <PrimaryButton onClick={onUpload}><Camera /> 开始脸型分析</PrimaryButton>
    <PrimaryButton secondary onClick={onShowReport}><ShieldCheck /> 查看隐私说明</PrimaryButton>
  </section>

  if (state === 'photo-ready') return <section className="hero-card">
    <div><span className="eyebrow"><ShieldCheck /> Photo Ready</span><h1>照片已准备好，<br />开始 AI 分析</h1><p>下一步将检测照片质量、识别面部关键点并生成 SDK 推荐。</p></div>
    <PrimaryButton onClick={onAnalyze}><Sparkles /> 开始分析</PrimaryButton>
    <PrimaryButton secondary onClick={onUpload}><ImageIcon /> 重新选择照片</PrimaryButton>
  </section>

  if (state === 'analyzing') return <section className="hero-card"><div><span className="eyebrow"><Sparkles /> On-device Analysis</span><h1>正在分析脸型</h1><p>正在设备端加载模型、识别面部关键点并计算镜框推荐。</p></div></section>

  if (state === 'report-ready') return <section className="hero-card">
    <div><span className="eyebrow"><Check /> Report Ready</span><h1>你的脸型报告<br />已经生成</h1><p>{FACE_NAMES[faceShape?.primary ?? 'unknown']} · {Math.round((faceShape?.confidence ?? 0) * 100)}% 置信度。结果来自本次照片的本地分析。</p></div>
    <PrimaryButton onClick={onTryOn}><Glasses /> 试戴推荐镜框</PrimaryButton>
    <PrimaryButton secondary onClick={onUpload}><Camera /> 重新分析</PrimaryButton>
  </section>

  return <section className="hero-card">
    <div><span className="eyebrow"><Glasses /> Try-on Ready</span><h1>已生成 {frameCount} 款<br />推荐试戴预览</h1><p>镜框位置来自本次照片的面部关键点，可保存真实预览图。</p></div>
    <PrimaryButton onClick={onTryOn}><Glasses /> 查看试戴结果</PrimaryButton>
    <PrimaryButton secondary onClick={onShowReport}><FileText /> 返回报告摘要</PrimaryButton>
  </section>
}

function PhotoCheckCard({ visible, photoUrl, onAnalyze, onPrivacy }: { visible: boolean; photoUrl: string | null; onAnalyze: () => void; onPrivacy: () => void }) {
  if (!visible) return null
  return <section className="content-section upload"><SectionTitle title="照片检查" />
    <div className="scan-photo"><Portrait src={photoUrl} /><span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" /><span className="face-guide" /></div>
    <div className="tips-row"><span>◉<small>不佩戴眼镜</small></span><span>☻<small>自然表情</small></span><span>♙<small>避免遮挡</small></span><span>☼<small>光线均匀</small></span></div>
    <div className="list-card"><button className="info-row" onClick={onPrivacy}><span><ShieldCheck /></span><div><b>隐私与权限</b><p>当前版本不保存历史记录，照片仅用于本次分析流程。</p></div></button></div>
    <PrimaryButton onClick={onAnalyze}><Sparkles /> 开始分析</PrimaryButton>
  </section>
}

function AnalysisCard({ visible, progress }: { visible: boolean; progress: number }) {
  if (!visible) return null
  const activeStep = Math.min(3, Math.floor(progress / 28))
  return <section className="content-section analysis-body"><h1>AI 分析中</h1><p>根据照片计算脸型比例与 SDK 推荐</p>
    <div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as CSSProperties}><span>{progress}<small>%</small></span></div>
    <div className="analysis-steps">{['照片质量检测', '脸型特征读取', 'SDK 推荐计算', '生成试戴入口'].map((s, i) => <div className={i < activeStep ? 'done' : i === activeStep ? 'doing' : ''} key={s}><span>{i < activeStep ? <Check /> : i === activeStep ? <i /> : ''}</span><b>{s}</b><small>{i < activeStep ? '已完成' : i === activeStep ? '进行中' : '等待中'}</small></div>)}</div>
  </section>
}

function ReportSummaryCard({ visible, faceShape, frames, photoUrl, onDetail, onFrames, onTryOn }: { visible: boolean; faceShape?: FaceShapeResult; frames: FrameCard[]; photoUrl: string | null; onDetail: () => void; onFrames: () => void; onTryOn: () => void }) {
  if (!visible) return null
  const topFrame = frames[0]
  if (!faceShape || !topFrame) return null
  return <section className="content-section report-page"><SectionTitle title="脸型报告" action="查看完整报告" onAction={onDetail} />
    <div className="result-card"><Portrait src={photoUrl} /><div><small>你的脸型：</small><h1>{FACE_NAMES[faceShape.primary]}</h1><span className="match"><Check /> {Math.round(faceShape.confidence * 100)}% 置信度</span><p>{FACE_SUMMARIES[faceShape.primary]}</p></div></div>
    <div className="summary-card"><Sparkles /><span><b>SDK 首选：{topFrame.zh}</b><small>{topFrame.reason} · {topFrame.score}% 匹配</small></span></div>
    <div className="quick-nav"><button onClick={onDetail}><Ruler />报告</button><button onClick={onFrames}><Glasses />镜框</button><button onClick={onTryOn}><Wand2 />试戴</button></div>
    <PrimaryButton onClick={onTryOn}>试戴推荐镜框</PrimaryButton>
  </section>
}

function FrameSummaryCard({ visible, frames, onFrames, onTryOn }: { visible: boolean; frames: FrameCard[]; onFrames: () => void; onTryOn: () => void }) {
  if (!visible) return null
  return <section className="content-section frames-page"><SectionTitle title="SDK 推荐镜框" action="查看全部" onAction={onFrames} />
    {frames.slice(0, 3).map((f) => <button className="frame-row" key={f.id} onClick={onFrames}><div className="frame-icon"><img className="frame-thumbnail" src={f.thumbnailUrl} alt={f.zh} /></div><div><b>{f.zh}</b><small>{f.reason}</small><span>{f.score}% SDK score</span></div><ChevronRight /></button>)}
    <PrimaryButton secondary onClick={onTryOn}>试戴这 {frames.length} 款</PrimaryButton>
  </section>
}

function TryOnSummaryCard({ visible, frames, photoUrl, placement, onTryOn, onPoster }: { visible: boolean; frames: FrameCard[]; photoUrl: string | null; placement?: FaceTryOnPlacement; onTryOn: () => void; onPoster: () => void }) {
  if (!visible) return null
  return <section className="content-section tryon-page"><SectionTitle title="试戴预览" action="查看结果" onAction={onTryOn} />
    <div className="tryon-grid">{frames.slice(0, 2).map((f) => <button key={f.id} onClick={onTryOn}><Portrait src={photoUrl} glasses={f} placement={placement} /><Heart /><b>{f.name}</b><span>{f.score}% 匹配</span></button>)}</div>
    <PrimaryButton onClick={onTryOn}>查看全部试戴结果</PrimaryButton><button className="text-link" onClick={onPoster}><ArrowRight /> 生成试戴海报</button>
  </section>
}

function HomeUtilities({ state, onUpload, onReport, onSettings }: { state: FlowState; onUpload: () => void; onReport: () => void; onSettings: () => void }) {
  return <section className="content-section profile-page"><SectionTitle title={state === 'empty' ? '你将获得' : '更多操作'} />
    {state === 'empty' ? <div className="feature-grid"><button onClick={onUpload}><span><Camera /></span><b>脸型分析</b><small>上传照片</small></button><button onClick={onReport}><span><FileText /></span><b>真实度量</b><small>SDK 分析</small></button><button onClick={onSettings}><span><ShieldCheck /></span><b>隐私说明</b><small>不保存历史</small></button></div> : <div className="menu-card"><button onClick={onReport}><FileText /><b>查看完整报告</b><ChevronRight /></button><button onClick={onUpload}><Camera /><b>重新分析照片</b><ChevronRight /></button><button onClick={onSettings}><Settings /><b>设置与隐私</b><ChevronRight /></button></div>}
  </section>
}

function HomeView({ state, progress, notice, faceShape, frames, photoUrl, placement, onUpload, onAnalyze, onReset, onView, onTryOn }: { state: FlowState; progress: number; notice: string | null; faceShape?: FaceShapeResult; frames: FrameCard[]; photoUrl: string | null; placement?: FaceTryOnPlacement; onUpload: () => void; onAnalyze: () => void; onReset: () => void; onView: (view: ViewState) => void; onTryOn: () => void }) {
  return <div className="screen home-screen"><AppHeader state={state} onReset={onReset} onSettings={() => onView('settings')} /><StateHero state={state} faceShape={faceShape} frameCount={frames.length} onUpload={onUpload} onAnalyze={onAnalyze} onShowReport={() => onView('settings')} onTryOn={onTryOn} /><StatusNotice message={notice} /><PhotoCheckCard visible={state === 'photo-ready'} photoUrl={photoUrl} onAnalyze={onAnalyze} onPrivacy={() => onView('settings')} /><AnalysisCard visible={state === 'analyzing'} progress={progress} /><ReportSummaryCard visible={state === 'report-ready' || state === 'tryon-ready'} faceShape={faceShape} frames={frames} photoUrl={photoUrl} onDetail={() => onView('report-detail')} onFrames={() => onView('frames')} onTryOn={onTryOn} /><FrameSummaryCard visible={state === 'report-ready' || state === 'tryon-ready'} frames={frames} onFrames={() => onView('frames')} onTryOn={onTryOn} /><TryOnSummaryCard visible={state === 'tryon-ready'} frames={frames} photoUrl={photoUrl} placement={placement} onTryOn={() => onView('tryon')} onPoster={() => onView('poster')} /><HomeUtilities state={state} onUpload={onUpload} onReport={() => faceShape ? onView('report-detail') : onView('settings')} onSettings={() => onView('settings')} /></div>
}

function ReportDetailView({ faceShape, frames, photoUrl, onHome, onFramesHome, onTryOnHome }: { faceShape: FaceShapeResult; frames: FrameCard[]; photoUrl: string | null; onHome: () => void; onFramesHome: () => void; onTryOnHome: () => void }) {
  const ratios = faceShape.metrics.visutry
  return <div className="screen"><DetailTopBar title="完整报告" onHome={onHome} /><div className="page-pad detail-page">
    <div className="result-card"><Portrait src={photoUrl} /><div><small>你的脸型：</small><h1>{FACE_NAMES[faceShape.primary]}</h1><span className="match"><Check /> {Math.round(faceShape.confidence * 100)}% 置信度</span><p>{FACE_SUMMARIES[faceShape.primary]}</p></div></div>
    <div className="metric-grid">{[
      ['脸长/脸宽比', ratios?.faceAspectRatio.toFixed(2) ?? faceShape.metrics.widthHeightRatio.toFixed(2), '实测'],
      ['SDK 推荐数', String(frames.length), 'Top picks'],
      ['颧骨/脸宽', ratios?.cheekToFaceWidth.toFixed(2) ?? '—', '实测'],
      ['下颌/颧骨', ratios?.jawToCheekWidth.toFixed(2) ?? faceShape.metrics.jawCheekRatio.toFixed(2), '实测'],
      ['额头/颧骨', ratios?.foreheadToCheekWidth.toFixed(2) ?? faceShape.metrics.foreheadCheekRatio?.toFixed(2) ?? '—', '实测'],
      ['对称偏移', `${((ratios?.symmetryOffset ?? faceShape.metrics.symmetryOffset ?? 0) * 100).toFixed(1)}%`, '越低越对称'],
    ].map(([a, b, c]) => <div key={a}><small>{a}</small><b>{b}</b><span>{c}</span></div>)}</div>
    <div className="list-card compact">{[['脸型特征', FACE_SUMMARIES[faceShape.primary]], ['照片质量', faceShape.warnings.length ? `分析提示：${faceShape.warnings.join('、')}` : '关键点完整，照片满足本次分析要求。'], ['推荐引擎', '@visutry/recommender 根据本次脸型度量、尺寸、材质与预算计算排序。']].map(([a, b]) => <div className="info-row" key={a}><span><Check /></span><div><b>{a}</b><p>{b}</p></div></div>)}</div>
    <PrimaryButton onClick={onFramesHome}>回首页查看推荐镜框</PrimaryButton><PrimaryButton secondary onClick={onTryOnHome}>生成试戴状态并回首页</PrimaryButton>
  </div></div>
}

function FramesView({ frames, onHome, onTryOnHome }: { frames: FrameCard[]; onHome: () => void; onTryOnHome: () => void }) {
  return <div className="screen"><DetailTopBar title="推荐镜框" onHome={onHome} /><div className="page-pad frames-page">
    <SectionTitle title={`16 款预置镜框 · SDK 排序`} action="@visutry/recommender" />
    {frames.map((f) => <button className="frame-row" key={f.id} onClick={onTryOnHome}><div className="frame-icon"><img className="frame-thumbnail" src={f.thumbnailUrl} alt={f.zh} /></div><div><b>{f.zh}</b><small>{f.reason}</small><span>{f.score}% SDK score</span>{f.caution && <small>{f.caution}</small>}</div><ChevronRight /></button>)}
    <PrimaryButton onClick={onTryOnHome}>生成试戴状态并回首页</PrimaryButton>
  </div></div>
}

function TryOnView({ frames, photoUrl, placement, onHome, onSave, onPosterHome, onUploadHome }: { frames: FrameCard[]; photoUrl: string | null; placement?: FaceTryOnPlacement; onHome: () => void; onSave: (frame: FrameCard) => void; onPosterHome: () => void; onUploadHome: () => void }) {
  return <div className="screen"><DetailTopBar title="试戴结果" onHome={onHome} /><div className="page-pad tryon-page">
    <span className="eyebrow"><ShieldCheck /> Landmark Fitted</span><h2>试戴你的推荐镜框</h2><p>镜框根据本次照片检测到的双眼位置、间距与倾斜角自动对齐。</p>
    <div className="tryon-grid">{frames.map((f) => <button key={f.id} onClick={() => onSave(f)}><Portrait src={photoUrl} glasses={f} placement={placement} /><Heart /><b>{f.name}</b><span>{f.score}% 匹配 · 点击保存</span></button>)}</div>
    <PrimaryButton onClick={() => frames[0] && onSave(frames[0])}>保存首选试戴图</PrimaryButton><button className="text-link" onClick={onPosterHome}><ArrowRight /> 生成试戴海报</button><button className="muted-link" onClick={onUploadHome}>重新分析一张照片</button>
  </div></div>
}

function SettingsView({ onHome, onUploadHome }: { onHome: () => void; onUploadHome: () => void }) {
  return <div className="screen"><DetailTopBar title="设置与隐私" onHome={onHome} /><div className="page-pad settings-page">
    <SectionTitle title="隐私与数据" /><div className="list-card compact"><div className="info-row"><span><ShieldCheck /></span><div><b>照片用途</b><p>照片仅用于本次脸型分析、推荐与试戴图生成，不上传到业务服务器。</p></div></div><div className="info-row"><span><Trash2 /></span><div><b>删除控制</b><p>点击首页右上角的删除按钮，会立即清除本次照片与分析结果。</p></div></div><div className="info-row"><span><LockKeyhole /></span><div><b>设备端处理</b><p>面部关键点识别和脸型计算均由浏览器内的 SDK 完成。</p></div></div></div>
    <SectionTitle title="操作" /><div className="menu-card"><button onClick={onUploadHome}><Camera /><b>选择一张新照片</b><ChevronRight /></button></div>
  </div></div>
}

function PosterView({ frames, photoUrl, placement, onHome, onSave }: { frames: FrameCard[]; photoUrl: string | null; placement?: FaceTryOnPlacement; onHome: () => void; onSave: (frame: FrameCard) => void }) {
  return <div className="screen"><DetailTopBar title="试戴海报" onHome={onHome} /><div className="page-pad tryon-page">
    <div className="summary-card"><Glasses /><span><b>可保存的真实预览</b><small>选择推荐镜框后生成包含本次照片与匹配分数的图片。</small></span></div><div className="tryon-grid">{frames.slice(0, 2).map((f) => <button key={f.id} onClick={() => onSave(f)}><Portrait src={photoUrl} glasses={f} placement={placement} /><b>{f.name}</b><span>{f.score}% 匹配</span></button>)}</div>
    <PrimaryButton onClick={() => frames[0] && onSave(frames[0])}>保存首选试戴海报</PrimaryButton>
  </div></div>
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('无法读取照片'))
    image.src = src
  })
}

function drawFrameAsset(ctx: CanvasRenderingContext2D, asset: HTMLImageElement, placement: FaceTryOnPlacement, photoWidth: number, photoHeight: number, offsetY: number) {
  const centerX = placement.centerX * photoWidth
  const centerY = offsetY + placement.centerY * photoHeight
  const assetWidth = placement.width * photoWidth * 1.08
  const assetHeight = assetWidth * asset.naturalHeight / asset.naturalWidth
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(placement.rotationDeg * Math.PI / 180)
  ctx.globalCompositeOperation = 'multiply'
  ctx.drawImage(asset, -assetWidth / 2, -assetHeight * 0.46, assetWidth, assetHeight)
  ctx.restore()
}

async function createTryOnPoster(photoUrl: string, placement: FaceTryOnPlacement, frame: FrameCard): Promise<Blob> {
  const [image, frameAsset] = await Promise.all([loadImage(photoUrl), loadImage(frame.thumbnailUrl)])
  const outputWidth = 1080
  const headerHeight = 190
  const photoHeight = Math.round(outputWidth * image.naturalHeight / image.naturalWidth)
  const canvas = document.createElement('canvas')
  canvas.width = outputWidth
  canvas.height = headerHeight + photoHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('当前浏览器不支持图片生成')

  ctx.fillStyle = '#f7f9fc'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#111827'
  ctx.font = '700 54px system-ui, sans-serif'
  ctx.fillText('VisuTry', 56, 76)
  ctx.font = '700 38px system-ui, sans-serif'
  ctx.fillText(`${frame.zh} · ${frame.score}% 匹配`, 56, 142)
  ctx.drawImage(image, 0, headerHeight, outputWidth, photoHeight)
  drawFrameAsset(ctx, frameAsset, placement, outputWidth, photoHeight, headerHeight)

  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('图片生成失败')), 'image/jpeg', 0.92))
}

export default function App() {
  // Initialize platform on app start
  useEffect(() => {
    initWebPlatform()
    return () => { void getPlatform().faceShapeAnalyzer.destroy() }
  }, [])

  const [flowState, setFlowState] = useState<FlowState>('empty')
  const [view, setView] = useState<ViewState>('home')
  const [notice, setNotice] = useState<string | null>(null)
  const [progress, setProgress] = useState(28)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<FaceShapeAnalysisResult | null>(null)
  const [frames, setFrames] = useState<FrameCard[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const analysisRunRef = useRef(0)

  const goHome = () => { setView('home'); window.scrollTo(0, 0) }
  const openViewFromHome = (next: ViewState) => { setView(next); setNotice(null); window.scrollTo(0, 0) }
  const updateFlowHome = (next: FlowState, message?: string) => { setFlowState(next); setView('home'); setNotice(message ?? null); window.scrollTo(0, 0) }
  const startTryOnHome = () => updateFlowHome('tryon-ready', '已按面部关键点生成试戴预览')

  const resetFlow = () => {
    analysisRunRef.current += 1
    if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl)
    setUploadedImage(null)
    setUploadedImageUrl(null)
    setAnalysis(null)
    setFrames([])
    updateFlowHome('empty')
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // Reset input value so selecting the same file again still fires onChange
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setNotice('请选择 JPG、PNG、WebP 等图片文件')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setNotice('照片不能超过 20MB')
      return
    }

    analysisRunRef.current += 1
    if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl)
    const url = URL.createObjectURL(file)
    setUploadedImage(file)
    setUploadedImageUrl(url)
    setAnalysis(null)
    setFrames([])
    updateFlowHome('photo-ready', '照片已上传，可以开始分析')
  }

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click()
  }

  const startAnalysis = () => {
    if (!uploadedImage) {
      setNotice('请先上传照片')
      return
    }
    updateFlowHome('analyzing')
    void performRealAnalysis(uploadedImage)
  }

  const performRealAnalysis = async (image: File) => {
    const runId = ++analysisRunRef.current
    try {
      const platform = getPlatform()
      const imageInput = {
        data: image,
        mimeType: image.type,
      }
      const result = await platform.faceShapeAnalyzer.analyze(imageInput)
      if (runId !== analysisRunRef.current) return
      if (result.geometry.status !== 'measured' || !result.sdkResult || !result.tryOnPlacement) {
        const detail = result.geometry.warnings.join(' ')
        throw new Error(detail.includes('No face detected') ? '没有检测到清晰人脸，请换一张正面、光线均匀的照片' : '分析模型暂时不可用，请检查网络后重试')
      }

      setProgress(100)
      setAnalysis(result)
      setFrames(recommendFrames(result.sdkResult))
      window.setTimeout(() => {
        if (runId === analysisRunRef.current) updateFlowHome('report-ready', '已使用本次照片完成本地 SDK 分析')
      }, 280)
    } catch (error) {
      if (runId !== analysisRunRef.current) return
      const message = error instanceof Error ? error.message : '分析失败，请重试'
      updateFlowHome('photo-ready', message)
    }
  }

  const saveTryOn = async (frame: FrameCard) => {
    if (!uploadedImageUrl || !analysis?.tryOnPlacement) {
      updateFlowHome('report-ready', '缺少试戴定位数据，请重新分析照片')
      return
    }
    try {
      const blob = await createTryOnPoster(uploadedImageUrl, analysis.tryOnPlacement, frame)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `visutry-${frame.id}.jpg`
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      updateFlowHome('tryon-ready', `已保存「${frame.zh}」试戴图`)
    } catch (error) {
      updateFlowHome('tryon-ready', error instanceof Error ? error.message : '保存失败，请重试')
    }
  }

  useEffect(() => {
    if (flowState !== 'analyzing') return undefined
    setProgress(28)

    // Progress bar is purely visual — real analysis is kicked off by startAnalysis()
    const analysisInterval = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          window.clearInterval(analysisInterval)
          return 100
        }
        return Math.min(92, value + 7)
      })
    }, 420)

    return () => window.clearInterval(analysisInterval)
  }, [flowState])

  if (view === 'report-detail' && analysis?.sdkResult) return <main className="app-shell"><div className="device-frame"><ReportDetailView faceShape={analysis.sdkResult} frames={frames} photoUrl={uploadedImageUrl} onHome={goHome} onFramesHome={() => updateFlowHome('report-ready', '已回到首页，可查看 SDK 推荐摘要')} onTryOnHome={startTryOnHome} /></div></main>
  if (view === 'frames') return <main className="app-shell"><div className="device-frame"><FramesView frames={frames} onHome={goHome} onTryOnHome={startTryOnHome} /></div></main>
  if (view === 'tryon') return <main className="app-shell"><div className="device-frame"><TryOnView frames={frames} photoUrl={uploadedImageUrl} placement={analysis?.tryOnPlacement} onHome={goHome} onSave={saveTryOn} onPosterHome={() => updateFlowHome('tryon-ready', '可从首页的试戴预览生成海报')} onUploadHome={triggerPhotoUpload} /></div></main>
  if (view === 'settings') return <main className="app-shell"><div className="device-frame"><SettingsView onHome={goHome} onUploadHome={triggerPhotoUpload} /></div></main>
  if (view === 'poster') return <main className="app-shell"><div className="device-frame"><PosterView frames={frames} photoUrl={uploadedImageUrl} placement={analysis?.tryOnPlacement} onHome={goHome} onSave={saveTryOn} /></div></main>

  return <>
    <main className="app-shell"><div className="device-frame"><HomeView state={flowState} progress={progress} notice={notice} faceShape={analysis?.sdkResult} frames={frames} photoUrl={uploadedImageUrl} placement={analysis?.tryOnPlacement} onUpload={triggerPhotoUpload} onAnalyze={startAnalysis} onReset={resetFlow} onView={openViewFromHome} onTryOn={startTryOnHome} /></div></main>

    {/* Hidden file upload for photo analysis */}
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      style={{ display: 'none' }}
      onChange={handlePhotoUpload}
    />
  </>
}
