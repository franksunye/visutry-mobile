import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { FaceShapeResult, GlassesItem, RecommendedGlasses } from '@visutry/tryon-core'
import { Recommender } from '../packages/visutry-tryon-sdk/packages/recommender/dist/index.js'
import {
  ArrowLeft, ArrowRight, Bell, Camera, Check, ChevronRight, FileText, Glasses, Heart,
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
  reason: string
  caution?: string
}

const portrait = '/assets/face-model.png'

const demoFaceShape: FaceShapeResult = {
  primary: 'square',
  confidence: 0.92,
  version: 'mobile-demo-sdk-bridge',
  warnings: [],
  candidates: [
    { shape: 'square', score: 0.92, reasons: ['Jaw width is close to cheekbone width.'] },
    { shape: 'oval', score: 0.63, reasons: ['Face length is moderately longer than width.'] },
    { shape: 'round', score: 0.41, reasons: ['Cheek width is balanced.'] },
  ],
  metrics: {
    faceWidth: 0.62,
    faceHeight: 0.76,
    cheekboneWidth: 0.58,
    jawWidth: 0.55,
    foreheadWidth: 0.54,
    faceOutlineWidth: 0.62,
    eyeOuterDistance: 0.34,
    eyeInnerDistance: 0.12,
    eyeCenterDistance: 0.23,
    noseBridgeToEyeLine: 0.08,
    noseBridgeWidth: 0.055,
    widthHeightRatio: 0.82,
    jawCheekRatio: 0.95,
    foreheadCheekRatio: 0.93,
    eyeLineTiltDeg: 1.2,
    symmetryOffset: 0.03,
    faceSpan: 0.76,
    chinType: 'square',
    measurementQuality: 0.9,
    visutry: {
      faceAspectRatio: 1.23,
      cheekToFaceWidth: 0.94,
      jawToCheekWidth: 0.95,
      foreheadToCheekWidth: 0.93,
      eyeLineTiltDeg: 1.2,
      symmetryOffset: 0.03,
      noseBridgeToFaceWidth: 0.09,
    },
  },
}

const inventory: GlassesItem[] = [
  {
    id: 'round-soft-01',
    name: 'Round',
    brand: 'VisuTry',
    thumbnailUrl: '/assets/frames/round.png',
    shapeCategory: 'round',
    dimensions: { frameWidthMm: 140, lensWidthMm: 52, bridgeWidthMm: 19 },
    material: 'Acetate',
    colors: ['Black', 'Tortoise'],
    price: 89,
  },
  {
    id: 'browline-light-01',
    name: 'Aviator',
    brand: 'VisuTry',
    thumbnailUrl: '/assets/frames/browline.png',
    shapeCategory: 'browline',
    dimensions: { frameWidthMm: 141, lensWidthMm: 53, bridgeWidthMm: 18 },
    material: 'Metal',
    colors: ['Silver', 'Black'],
    price: 99,
  },
  {
    id: 'aviator-slim-01',
    name: 'Browline',
    brand: 'VisuTry',
    thumbnailUrl: '/assets/frames/aviator.png',
    shapeCategory: 'aviator',
    dimensions: { frameWidthMm: 142, lensWidthMm: 54, bridgeWidthMm: 17 },
    material: 'Metal',
    colors: ['Gold', 'Black'],
    price: 109,
  },
  {
    id: 'wayfarer-balanced-01',
    name: 'Wayfarer',
    brand: 'VisuTry',
    thumbnailUrl: '/assets/frames/wayfarer.png',
    shapeCategory: 'square',
    dimensions: { frameWidthMm: 143, lensWidthMm: 54, bridgeWidthMm: 18 },
    material: 'Acetate',
    colors: ['Black'],
    price: 79,
  },
]

const frameMeta: Record<string, { zh: string; kind: string; fallback: string }> = {
  'round-soft-01': { zh: '圆形镜框', kind: 'round', fallback: '柔和轮廓，平衡脸部线条' },
  'browline-light-01': { zh: '眉框 / 半框', kind: 'brow', fallback: '轻盈百搭，提升眉眼存在感' },
  'aviator-slim-01': { zh: '飞行员框', kind: 'aviator', fallback: '增强纵向比例，适合通勤场景' },
  'wayfarer-balanced-01': { zh: '方形镜框', kind: 'square', fallback: '经典利落，但需要控制框宽' },
}

const sdkRecommendations = new Recommender().recommend({
  faceShape: demoFaceShape,
  inventory,
  preferences: {
    style: 'business',
    preferredMaterials: ['Acetate', 'Metal'],
    maxPrice: 120,
  },
})

const frames: FrameCard[] = sdkRecommendations.slice(0, 4).map((recommendation: RecommendedGlasses) => {
  const meta = frameMeta[recommendation.item.id]
  const firstReason = recommendation.reasons[0]
  return {
    id: recommendation.item.id,
    name: recommendation.item.name,
    zh: meta?.zh ?? recommendation.item.name,
    kind: meta?.kind ?? recommendation.item.shapeCategory,
    score: Math.round(recommendation.score * 100),
    reason: firstReason ? localizeReason(firstReason, meta?.fallback) : (meta?.fallback ?? 'SDK 推荐结果'),
    caution: recommendation.cautions?.[0],
  }
})

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

function GlassOverlay({ kind = 'round' }: { kind?: string }) {
  return <div className={`glasses-overlay ${kind}`}><i /><i /><b /></div>
}

function Portrait({ glasses, className = '' }: { glasses?: string | false; className?: string }) {
  return <div className={`portrait ${className}`}><img src={portrait} alt="用于演示脸型分析的模特" />{glasses && <GlassOverlay kind={glasses} />}</div>
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

function StateHero({ state, onUpload, onAnalyze, onShowReport, onTryOn }: { state: FlowState; onUpload: () => void; onAnalyze: () => void; onShowReport: () => void; onTryOn: () => void }) {
  if (state === 'empty') return <section className="hero-card">
    <div><span className="eyebrow"><Sparkles /> SDK Connected</span><h1>上传一张正面照，<br />找到更适合你的眼镜</h1><p>脸型分析 · SDK 推荐 · 试戴预览，首页完成主流程。</p></div>
    <div className="hero-art"><div className="gem">◆</div><Glasses /></div>
    <PrimaryButton onClick={onUpload}><Camera /> 开始脸型分析</PrimaryButton>
    <PrimaryButton secondary onClick={onShowReport}><FileText /> 查看示例报告</PrimaryButton>
  </section>

  if (state === 'photo-ready') return <section className="hero-card">
    <div><span className="eyebrow"><ShieldCheck /> Photo Ready</span><h1>照片已准备好，<br />开始 AI 分析</h1><p>下一步将检测照片质量、识别面部关键点并生成 SDK 推荐。</p></div>
    <PrimaryButton onClick={onAnalyze}><Sparkles /> 开始分析</PrimaryButton>
    <PrimaryButton secondary onClick={onUpload}><ImageIcon /> 重新选择照片</PrimaryButton>
  </section>

  if (state === 'analyzing') return <section className="hero-card"><div><span className="eyebrow"><Sparkles /> AI Analysis</span><h1>正在分析脸型</h1><p>当前先使用 SDK recommender 的示例输入，下一步接入真实 face tracker 输出。</p></div></section>

  if (state === 'report-ready') return <section className="hero-card">
    <div><span className="eyebrow"><Check /> Report Ready</span><h1>你的脸型报告<br />已经生成</h1><p>方形脸 · {Math.round(demoFaceShape.confidence * 100)}% 置信度。推荐结果来自 @visutry/recommender。</p></div>
    <PrimaryButton onClick={onTryOn}><Glasses /> 试戴推荐镜框</PrimaryButton>
    <PrimaryButton secondary onClick={onUpload}><Camera /> 重新分析</PrimaryButton>
  </section>

  return <section className="hero-card">
    <div><span className="eyebrow"><Glasses /> Try-on Ready</span><h1>已生成 {frames.length} 款<br />推荐试戴预览</h1><p>推荐排序来自 SDK，试戴渲染下一步接入 @visutry/tryon-web。</p></div>
    <PrimaryButton onClick={onTryOn}><Glasses /> 查看试戴结果</PrimaryButton>
    <PrimaryButton secondary onClick={onShowReport}><FileText /> 返回报告摘要</PrimaryButton>
  </section>
}

function PhotoCheckCard({ visible, onAnalyze, onPrivacy }: { visible: boolean; onAnalyze: () => void; onPrivacy: () => void }) {
  if (!visible) return null
  return <section className="content-section upload"><SectionTitle title="照片检查" />
    <div className="scan-photo"><Portrait /><span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" /><span className="face-guide" /></div>
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

function ReportSummaryCard({ visible, onDetail, onFrames, onTryOn }: { visible: boolean; onDetail: () => void; onFrames: () => void; onTryOn: () => void }) {
  if (!visible) return null
  const topFrame = frames[0]
  return <section className="content-section report-page"><SectionTitle title="脸型报告" action="查看完整报告" onAction={onDetail} />
    <div className="result-card"><Portrait /><div><small>你的脸型：</small><h1>方形脸</h1><span className="match"><Check /> {Math.round(demoFaceShape.confidence * 100)}% 置信度</span><p>下颌角较明显，整体轮廓偏方正。</p></div></div>
    <div className="summary-card"><Sparkles /><span><b>SDK 首选：{topFrame.zh}</b><small>{topFrame.reason} · {topFrame.score}% 匹配</small></span></div>
    <div className="quick-nav"><button onClick={onDetail}><Ruler />报告</button><button onClick={onFrames}><Glasses />镜框</button><button onClick={onTryOn}><Wand2 />试戴</button></div>
    <PrimaryButton onClick={onTryOn}>试戴推荐镜框</PrimaryButton>
  </section>
}

function FrameSummaryCard({ visible, onFrames, onTryOn }: { visible: boolean; onFrames: () => void; onTryOn: () => void }) {
  if (!visible) return null
  return <section className="content-section frames-page"><SectionTitle title="SDK 推荐镜框" action="查看全部" onAction={onFrames} />
    {frames.slice(0, 3).map((f) => <button className="frame-row" key={f.id} onClick={onFrames}><div className={`frame-icon ${f.kind}`}><GlassOverlay kind={f.kind} /></div><div><b>{f.zh}</b><small>{f.reason}</small><span>{f.score}% SDK score</span></div><ChevronRight /></button>)}
    <PrimaryButton secondary onClick={onTryOn}>试戴这 {frames.length} 款</PrimaryButton>
  </section>
}

function TryOnSummaryCard({ visible, onTryOn, onPoster }: { visible: boolean; onTryOn: () => void; onPoster: () => void }) {
  if (!visible) return null
  return <section className="content-section tryon-page"><SectionTitle title="试戴预览" action="查看结果" onAction={onTryOn} />
    <div className="tryon-grid">{frames.slice(0, 2).map((f) => <button key={f.id} onClick={onTryOn}><Portrait glasses={f.kind} /><Heart /><b>{f.name}</b><span>{f.score}% 匹配</span></button>)}</div>
    <PrimaryButton onClick={onTryOn}>查看全部试戴结果</PrimaryButton><button className="text-link" onClick={onPoster}><ArrowRight /> 生成试戴海报</button>
  </section>
}

function HomeUtilities({ state, onUpload, onReport, onSettings }: { state: FlowState; onUpload: () => void; onReport: () => void; onSettings: () => void }) {
  return <section className="content-section profile-page"><SectionTitle title={state === 'empty' ? '你将获得' : '更多操作'} />
    {state === 'empty' ? <div className="feature-grid"><button onClick={onUpload}><span><Camera /></span><b>脸型分析</b><small>上传照片</small></button><button onClick={onReport}><span><FileText /></span><b>示例报告</b><small>SDK 推荐</small></button><button onClick={onSettings}><span><ShieldCheck /></span><b>隐私说明</b><small>不保存历史</small></button></div> : <div className="menu-card"><button onClick={onReport}><FileText /><b>查看完整报告</b><ChevronRight /></button><button onClick={onUpload}><Camera /><b>重新分析照片</b><ChevronRight /></button><button onClick={onSettings}><Settings /><b>设置与隐私</b><ChevronRight /></button></div>}
  </section>
}

function HomeView({ state, progress, notice, onUpload, onAnalyze, onReset, onView, onTryOn }: { state: FlowState; progress: number; notice: string | null; onUpload: () => void; onAnalyze: () => void; onReset: () => void; onView: (view: ViewState) => void; onTryOn: () => void }) {
  return <div className="screen home-screen"><AppHeader state={state} onReset={onReset} onSettings={() => onView('settings')} /><StateHero state={state} onUpload={onUpload} onAnalyze={onAnalyze} onShowReport={() => onView('report-detail')} onTryOn={onTryOn} /><StatusNotice message={notice} /><PhotoCheckCard visible={state === 'photo-ready'} onAnalyze={onAnalyze} onPrivacy={() => onView('settings')} /><AnalysisCard visible={state === 'analyzing'} progress={progress} /><ReportSummaryCard visible={state === 'report-ready' || state === 'tryon-ready'} onDetail={() => onView('report-detail')} onFrames={() => onView('frames')} onTryOn={onTryOn} /><FrameSummaryCard visible={state === 'report-ready' || state === 'tryon-ready'} onFrames={() => onView('frames')} onTryOn={onTryOn} /><TryOnSummaryCard visible={state === 'tryon-ready'} onTryOn={() => onView('tryon')} onPoster={() => onView('poster')} /><HomeUtilities state={state} onUpload={onUpload} onReport={() => onView('report-detail')} onSettings={() => onView('settings')} /></div>
}

function ReportDetailView({ onHome, onFramesHome, onTryOnHome }: { onHome: () => void; onFramesHome: () => void; onTryOnHome: () => void }) {
  return <div className="screen"><DetailTopBar title="完整报告" onHome={onHome} /><div className="page-pad detail-page">
    <div className="result-card"><Portrait /><div><small>你的脸型：</small><h1>方形脸</h1><span className="match"><Check /> {Math.round(demoFaceShape.confidence * 100)}% 置信度</span><p>下颌线明显，轮廓偏利落。</p></div></div>
    <div className="metric-grid">{[['脸长/脸宽比', '1.23 : 1', '中等'], ['SDK 推荐数', String(frames.length), 'Top picks'], ['颧骨', '中等', '较突出'], ['下颌线', '强', '明显'], ['额头宽度', '中等', '适中'], ['下巴形状', '方形', '明显']].map(([a, b, c]) => <div key={a}><small>{a}</small><b>{b}</b><span>{c}</span></div>)}</div>
    <div className="list-card compact">{[['脸型特征', '额头与下颌宽度相近，下颌角较明显。'], ['尺寸建议', '镜框总宽建议 138–142 mm，镜片宽度 52–54 mm。'], ['推荐引擎', '@visutry/recommender 根据脸型、尺寸、材质、预算计算排序。']].map(([a, b]) => <div className="info-row" key={a}><span><Check /></span><div><b>{a}</b><p>{b}</p></div></div>)}</div>
    <PrimaryButton onClick={onFramesHome}>回首页查看推荐镜框</PrimaryButton><PrimaryButton secondary onClick={onTryOnHome}>生成试戴状态并回首页</PrimaryButton>
  </div></div>
}

function FramesView({ onHome, onTryOnHome }: { onHome: () => void; onTryOnHome: () => void }) {
  return <div className="screen"><DetailTopBar title="推荐镜框" onHome={onHome} /><div className="page-pad frames-page">
    <SectionTitle title="SDK 推荐 TOP 4" action="@visutry/recommender" />
    {frames.map((f) => <button className="frame-row" key={f.id} onClick={onTryOnHome}><div className={`frame-icon ${f.kind}`}><GlassOverlay kind={f.kind} /></div><div><b>{f.zh}</b><small>{f.reason}</small><span>{f.score}% SDK score</span>{f.caution && <small>{f.caution}</small>}</div><ChevronRight /></button>)}
    <SectionTitle title="尽量避免" /><div className="avoid-grid"><div><GlassOverlay kind="tiny" /><b>窄矩形框</b><span>SDK caution</span></div><div><GlassOverlay kind="tiny-round" /><b>过小圆框</b><span>Size mismatch</span></div></div>
    <PrimaryButton onClick={onTryOnHome}>生成试戴状态并回首页</PrimaryButton>
  </div></div>
}

function TryOnView({ onHome, onSaveHome, onPosterHome, onUploadHome }: { onHome: () => void; onSaveHome: () => void; onPosterHome: () => void; onUploadHome: () => void }) {
  return <div className="screen"><DetailTopBar title="试戴结果" onHome={onHome} /><div className="page-pad tryon-page">
    <span className="eyebrow"><ShieldCheck /> 来自 SDK 推荐排序</span><h2>Try On Your Top Picks</h2><p>当前展示的是推荐驱动的静态预览。下一步接入 @visutry/tryon-web 渲染真实试戴。</p>
    <div className="tryon-grid">{frames.map((f) => <button key={f.id} onClick={onSaveHome}><Portrait glasses={f.kind} /><Heart /><b>{f.name}</b><span>{f.score}% 匹配</span></button>)}</div>
    <PrimaryButton onClick={onSaveHome}>保存结果并回首页</PrimaryButton><button className="text-link" onClick={onPosterHome}><ArrowRight /> 生成海报状态并回首页</button><button className="muted-link" onClick={onUploadHome}>重新分析一张照片</button>
  </div></div>
}

function SettingsView({ onHome, onUploadHome, onNotifyHome }: { onHome: () => void; onUploadHome: () => void; onNotifyHome: () => void }) {
  return <div className="screen"><DetailTopBar title="设置与隐私" onHome={onHome} /><div className="page-pad settings-page">
    <SectionTitle title="隐私与数据" /><div className="list-card compact"><div className="info-row"><span><ShieldCheck /></span><div><b>照片用途</b><p>照片仅用于本次脸型分析与镜框推荐。当前版本不保存历史记录。</p></div></div><div className="info-row"><span><Trash2 /></span><div><b>删除控制</b><p>退出或重新开始后清除当前原型状态；正式版再接入显式删除。</p></div></div><div className="info-row"><span><LockKeyhole /></span><div><b>本地优先</b><p>SDK 能在设备端完成的分析会优先在本地处理。</p></div></div></div>
    <SectionTitle title="操作" /><div className="menu-card"><button onClick={onNotifyHome}><Bell /><b>开启提醒并回首页</b><span className="switch on" /></button><button onClick={onUploadHome}><Camera /><b>重新开始并回首页</b><ChevronRight /></button></div>
  </div></div>
}

function PosterView({ onHome, onSaveHome }: { onHome: () => void; onSaveHome: () => void }) {
  return <div className="screen"><DetailTopBar title="试戴海报" onHome={onHome} /><div className="page-pad tryon-page">
    <div className="summary-card"><Glasses /><span><b>海报能力占位</b><small>正式版会生成可保存/分享的试戴结果图。</small></span></div><div className="tryon-grid">{frames.slice(0, 2).map((f) => <button key={f.id} onClick={onSaveHome}><Portrait glasses={f.kind} /><b>{f.name}</b><span>{f.score}% 匹配</span></button>)}</div>
    <PrimaryButton onClick={onSaveHome}>保存海报状态并回首页</PrimaryButton>
  </div></div>
}

export default function App() {
  const [flowState, setFlowState] = useState<FlowState>('empty')
  const [view, setView] = useState<ViewState>('home')
  const [notice, setNotice] = useState<string | null>(null)
  const [progress, setProgress] = useState(28)

  const goHome = () => { setView('home'); window.scrollTo(0, 0) }
  const openViewFromHome = (next: ViewState) => { setView(next); setNotice(null); window.scrollTo(0, 0) }
  const updateFlowHome = (next: FlowState, message?: string) => { setFlowState(next); setView('home'); setNotice(message ?? null); window.scrollTo(0, 0) }
  const startTryOnHome = () => updateFlowHome('tryon-ready', '已进入试戴状态')
  const saveResultHome = () => updateFlowHome('tryon-ready', '结果已保存到当前会话（未写入历史）')
  const posterHome = () => updateFlowHome('tryon-ready', '已生成海报占位')
  const enableNotifyHome = () => { setNotice('通知提醒已开启（原型状态）'); setView('home'); window.scrollTo(0, 0) }

  useEffect(() => {
    if (flowState !== 'analyzing') return undefined
    setProgress(28)
    const id = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          window.clearInterval(id)
          window.setTimeout(() => setFlowState('report-ready'), 360)
          return 100
        }
        return Math.min(100, value + 9)
      })
    }, 420)
    return () => window.clearInterval(id)
  }, [flowState])

  if (view === 'report-detail') return <main className="app-shell"><div className="device-frame"><ReportDetailView onHome={goHome} onFramesHome={() => updateFlowHome('report-ready', '已回到首页，可查看 SDK 推荐摘要')} onTryOnHome={startTryOnHome} /></div></main>
  if (view === 'frames') return <main className="app-shell"><div className="device-frame"><FramesView onHome={goHome} onTryOnHome={startTryOnHome} /></div></main>
  if (view === 'tryon') return <main className="app-shell"><div className="device-frame"><TryOnView onHome={goHome} onSaveHome={saveResultHome} onPosterHome={posterHome} onUploadHome={() => updateFlowHome('photo-ready')} /></div></main>
  if (view === 'settings') return <main className="app-shell"><div className="device-frame"><SettingsView onHome={goHome} onUploadHome={() => updateFlowHome('photo-ready')} onNotifyHome={enableNotifyHome} /></div></main>
  if (view === 'poster') return <main className="app-shell"><div className="device-frame"><PosterView onHome={goHome} onSaveHome={saveResultHome} /></div></main>

  return <main className="app-shell"><div className="device-frame"><HomeView state={flowState} progress={progress} notice={notice} onUpload={() => updateFlowHome('photo-ready')} onAnalyze={() => updateFlowHome('analyzing')} onReset={() => updateFlowHome('empty')} onView={openViewFromHome} onTryOn={startTryOnHome} /></div></main>
}
