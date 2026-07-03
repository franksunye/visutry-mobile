import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  ArrowLeft, ArrowRight, Bell, Camera, Check, ChevronRight, FileText, Glasses, Heart,
  Image as ImageIcon, LockKeyhole, MoreHorizontal, Ruler, Settings,
  ShieldCheck, Sparkles, Trash2, Wand2,
} from 'lucide-react'

type FlowState = 'empty' | 'photo-ready' | 'analyzing' | 'report-ready' | 'tryon-ready'
type ViewState = 'home' | 'report-detail' | 'frames' | 'tryon' | 'history' | 'settings' | 'poster'

const portrait = '/assets/face-model.png'

const frames = [
  { name: 'Round', zh: '圆形镜框', score: 92, kind: 'round', reason: '柔和轮廓，平衡脸部线条' },
  { name: 'Aviator', zh: '眉框 / 半框', score: 91, kind: 'brow', reason: '轻盈百搭，提升眉眼存在感' },
  { name: 'Browline', zh: '飞行员框', score: 88, kind: 'aviator', reason: '增强纵向比例，适合通勤场景' },
  { name: 'Wayfarer', zh: '方形镜框', score: 85, kind: 'square', reason: '经典利落，但需要控制框宽' },
]

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
    <div><span className="eyebrow"><Sparkles /> AI Glasses Fit</span><h1>上传一张正面照，<br />找到更适合你的眼镜</h1><p>脸型分析 · 镜框推荐 · 试戴预览，首页完成主流程。</p></div>
    <div className="hero-art"><div className="gem">◆</div><Glasses /></div>
    <PrimaryButton onClick={onUpload}><Camera /> 开始脸型分析</PrimaryButton>
    <PrimaryButton secondary onClick={onShowReport}><FileText /> 查看示例报告</PrimaryButton>
  </section>

  if (state === 'photo-ready') return <section className="hero-card">
    <div><span className="eyebrow"><ShieldCheck /> Photo Ready</span><h1>照片已准备好，<br />开始 AI 分析</h1><p>下一步将检测照片质量、识别面部关键点并生成推荐。</p></div>
    <PrimaryButton onClick={onAnalyze}><Sparkles /> 开始分析</PrimaryButton>
    <PrimaryButton secondary onClick={onUpload}><ImageIcon /> 重新选择照片</PrimaryButton>
  </section>

  if (state === 'analyzing') return <section className="hero-card"><div><span className="eyebrow"><Sparkles /> AI Analysis</span><h1>正在分析脸型</h1><p>预计需要 10–15 秒，正式版会接入 VisuTry SDK 实时结果。</p></div></section>

  if (state === 'report-ready') return <section className="hero-card">
    <div><span className="eyebrow"><Check /> Report Ready</span><h1>你的脸型报告<br />已经生成</h1><p>方形脸 · 92% 匹配。推荐优先试戴圆形、眉框和飞行员款。</p></div>
    <PrimaryButton onClick={onTryOn}><Glasses /> 试戴推荐镜框</PrimaryButton>
    <PrimaryButton secondary onClick={onUpload}><Camera /> 重新分析</PrimaryButton>
  </section>

  return <section className="hero-card">
    <div><span className="eyebrow"><Glasses /> Try-on Ready</span><h1>已生成 4 款<br />推荐试戴预览</h1><p>早期版本先展示推荐对比，下一轮接入真实 SDK 试戴。</p></div>
    <PrimaryButton onClick={onTryOn}><Glasses /> 查看试戴结果</PrimaryButton>
    <PrimaryButton secondary onClick={onShowReport}><FileText /> 返回报告摘要</PrimaryButton>
  </section>
}

function PhotoCheckCard({ visible, onAnalyze, onPrivacy }: { visible: boolean; onAnalyze: () => void; onPrivacy: () => void }) {
  if (!visible) return null
  return <section className="content-section upload"><SectionTitle title="照片检查" />
    <div className="scan-photo"><Portrait /><span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" /><span className="face-guide" /></div>
    <div className="tips-row"><span>◉<small>不佩戴眼镜</small></span><span>☻<small>自然表情</small></span><span>♙<small>避免遮挡</small></span><span>☼<small>光线均匀</small></span></div>
    <div className="list-card"><button className="info-row" onClick={onPrivacy}><span><ShieldCheck /></span><div><b>隐私与权限</b><p>照片仅用于本次脸型分析。点击进入设置与隐私。</p></div></button></div>
    <PrimaryButton onClick={onAnalyze}><Sparkles /> 开始分析</PrimaryButton>
  </section>
}

function AnalysisCard({ visible, progress }: { visible: boolean; progress: number }) {
  if (!visible) return null
  const activeStep = Math.min(3, Math.floor(progress / 28))
  return <section className="content-section analysis-body"><h1>AI 分析中</h1><p>根据照片计算脸型比例与镜框建议</p>
    <div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as CSSProperties}><span>{progress}<small>%</small></span></div>
    <div className="analysis-steps">{['照片质量检测', '面部关键点识别', '脸型比例计算', '生成镜框推荐'].map((s, i) => <div className={i < activeStep ? 'done' : i === activeStep ? 'doing' : ''} key={s}><span>{i < activeStep ? <Check /> : i === activeStep ? <i /> : ''}</span><b>{s}</b><small>{i < activeStep ? '已完成' : i === activeStep ? '进行中' : '等待中'}</small></div>)}</div>
  </section>
}

function ReportSummaryCard({ visible, onDetail, onFrames, onTryOn }: { visible: boolean; onDetail: () => void; onFrames: () => void; onTryOn: () => void }) {
  if (!visible) return null
  return <section className="content-section report-page"><SectionTitle title="脸型报告" action="查看完整报告" onAction={onDetail} />
    <div className="result-card"><Portrait /><div><small>你的脸型：</small><h1>方形脸</h1><span className="match"><Check /> 92% 匹配</span><p>下颌角较明显，整体轮廓偏方正。</p></div></div>
    <div className="summary-card"><Sparkles /><span><b>适合圆润、轻眉框和飞行员款</b><small>镜框总宽建议 138–142mm。</small></span></div>
    <div className="quick-nav"><button onClick={onDetail}><Ruler />报告</button><button onClick={onFrames}><Glasses />镜框</button><button onClick={onTryOn}><Wand2 />试戴</button></div>
    <PrimaryButton onClick={onTryOn}>试戴推荐镜框</PrimaryButton>
  </section>
}

function FrameSummaryCard({ visible, onFrames, onTryOn }: { visible: boolean; onFrames: () => void; onTryOn: () => void }) {
  if (!visible) return null
  return <section className="content-section frames-page"><SectionTitle title="推荐镜框" action="查看全部" onAction={onFrames} />
    {frames.slice(0, 3).map((f) => <button className="frame-row" key={f.name} onClick={onFrames}><div className={`frame-icon ${f.kind}`}><GlassOverlay kind={f.kind} /></div><div><b>{f.zh}</b><small>{f.reason}</small><span>{f.score}% 适合度</span></div><ChevronRight /></button>)}
    <PrimaryButton secondary onClick={onTryOn}>试戴这 4 款</PrimaryButton>
  </section>
}

function TryOnSummaryCard({ visible, onTryOn, onPoster }: { visible: boolean; onTryOn: () => void; onPoster: () => void }) {
  if (!visible) return null
  return <section className="content-section tryon-page"><SectionTitle title="试戴预览" action="查看结果" onAction={onTryOn} />
    <div className="tryon-grid">{frames.slice(0, 2).map((f) => <button key={f.name} onClick={onTryOn}><Portrait glasses={f.kind} /><Heart /><b>{f.name}</b><span>{f.score}% 匹配</span></button>)}</div>
    <PrimaryButton onClick={onTryOn}>查看全部试戴结果</PrimaryButton><button className="text-link" onClick={onPoster}><ArrowRight /> 生成试戴海报</button>
  </section>
}

function HomeUtilities({ state, onUpload, onHistory, onSettings }: { state: FlowState; onUpload: () => void; onHistory: () => void; onSettings: () => void }) {
  return <section className="content-section profile-page"><SectionTitle title={state === 'empty' ? '你将获得' : '更多操作'} />
    {state === 'empty' ? <div className="feature-grid"><button onClick={onUpload}><span><Camera /></span><b>脸型分析</b><small>上传照片</small></button><button onClick={onSettings}><span><ShieldCheck /></span><b>隐私说明</b><small>数据安全</small></button><button onClick={onHistory}><span><FileText /></span><b>历史记录</b><small>查看报告</small></button></div> : <div className="menu-card"><button onClick={onHistory}><FileText /><b>历史记录</b><ChevronRight /></button><button onClick={onUpload}><Camera /><b>重新分析照片</b><ChevronRight /></button><button onClick={onSettings}><Settings /><b>设置与隐私</b><ChevronRight /></button></div>}
  </section>
}

function HomeView({ state, progress, notice, onUpload, onAnalyze, onReset, onView, onTryOn }: { state: FlowState; progress: number; notice: string | null; onUpload: () => void; onAnalyze: () => void; onReset: () => void; onView: (view: ViewState) => void; onTryOn: () => void }) {
  return <div className="screen home-screen"><AppHeader state={state} onReset={onReset} onSettings={() => onView('settings')} /><StateHero state={state} onUpload={onUpload} onAnalyze={onAnalyze} onShowReport={() => onView('report-detail')} onTryOn={onTryOn} /><StatusNotice message={notice} /><PhotoCheckCard visible={state === 'photo-ready'} onAnalyze={onAnalyze} onPrivacy={() => onView('settings')} /><AnalysisCard visible={state === 'analyzing'} progress={progress} /><ReportSummaryCard visible={state === 'report-ready' || state === 'tryon-ready'} onDetail={() => onView('report-detail')} onFrames={() => onView('frames')} onTryOn={onTryOn} /><FrameSummaryCard visible={state === 'report-ready' || state === 'tryon-ready'} onFrames={() => onView('frames')} onTryOn={onTryOn} /><TryOnSummaryCard visible={state === 'tryon-ready'} onTryOn={() => onView('tryon')} onPoster={() => onView('poster')} /><HomeUtilities state={state} onUpload={onUpload} onHistory={() => onView('history')} onSettings={() => onView('settings')} /></div>
}

function ReportDetailView({ onHome, onFramesHome, onTryOnHome }: { onHome: () => void; onFramesHome: () => void; onTryOnHome: () => void }) {
  return <div className="screen"><DetailTopBar title="完整报告" onHome={onHome} /><div className="page-pad detail-page">
    <div className="result-card"><Portrait /><div><small>你的脸型：</small><h1>方形脸</h1><span className="match"><Check /> 92% 匹配</span><p>下颌线明显，轮廓偏利落。</p></div></div>
    <div className="metric-grid">{[['脸长/脸宽比', '1.23 : 1', '中等'], ['对称度', '高', '89%'], ['颧骨', '中等', '较突出'], ['下颌线', '强', '明显'], ['额头宽度', '中等', '适中'], ['下巴形状', '方形', '明显']].map(([a, b, c]) => <div key={a}><small>{a}</small><b>{b}</b><span>{c}</span></div>)}</div>
    <div className="list-card compact">{[['脸型特征', '额头与下颌宽度相近，下颌角较明显。'], ['尺寸建议', '镜框总宽建议 138–142 mm，镜片宽度 52–54 mm。'], ['风格建议', '推荐圆形、椭圆形、飞行员或轻眉框款式。']].map(([a, b]) => <div className="info-row" key={a}><span><Check /></span><div><b>{a}</b><p>{b}</p></div></div>)}</div>
    <PrimaryButton onClick={onFramesHome}>回首页查看推荐镜框</PrimaryButton><PrimaryButton secondary onClick={onTryOnHome}>生成试戴状态并回首页</PrimaryButton>
  </div></div>
}

function FramesView({ onHome, onTryOnHome }: { onHome: () => void; onTryOnHome: () => void }) {
  return <div className="screen"><DetailTopBar title="推荐镜框" onHome={onHome} /><div className="page-pad frames-page">
    <SectionTitle title="为你推荐 TOP 4" action="完整列表" />
    {frames.map((f) => <button className="frame-row" key={f.name} onClick={onTryOnHome}><div className={`frame-icon ${f.kind}`}><GlassOverlay kind={f.kind} /></div><div><b>{f.zh}</b><small>{f.reason}</small><span>{f.score}% 适合度</span></div><ChevronRight /></button>)}
    <SectionTitle title="尽量避免" /><div className="avoid-grid"><div><GlassOverlay kind="tiny" /><b>窄矩形框</b><span>28% 适合度</span></div><div><GlassOverlay kind="tiny-round" /><b>小圆框</b><span>31% 适合度</span></div></div>
    <PrimaryButton onClick={onTryOnHome}>生成试戴状态并回首页</PrimaryButton>
  </div></div>
}

function TryOnView({ onHome, onSaveHome, onPosterHome, onUploadHome }: { onHome: () => void; onSaveHome: () => void; onPosterHome: () => void; onUploadHome: () => void }) {
  return <div className="screen"><DetailTopBar title="试戴结果" onHome={onHome} /><div className="page-pad tryon-page">
    <span className="eyebrow"><ShieldCheck /> 来自脸型报告的推荐</span><h2>Try On Your Top Picks</h2><p>当前展示的是发布前静态预览。下一轮将替换为真实 SDK 试戴结果。</p>
    <div className="tryon-grid">{frames.map((f) => <button key={f.name} onClick={onSaveHome}><Portrait glasses={f.kind} /><Heart /><b>{f.name}</b><span>{f.score}% 匹配</span></button>)}</div>
    <PrimaryButton onClick={onSaveHome}>保存结果并回首页</PrimaryButton><button className="text-link" onClick={onPosterHome}><ArrowRight /> 生成海报状态并回首页</button><button className="muted-link" onClick={onUploadHome}>重新分析一张照片</button>
  </div></div>
}

function HistoryView({ onHome, onRestoreHome, onUploadHome }: { onHome: () => void; onRestoreHome: () => void; onUploadHome: () => void }) {
  return <div className="screen"><DetailTopBar title="历史记录" onHome={onHome} /><div className="page-pad profile-page">
    <div className="menu-card"><button onClick={onRestoreHome}><FileText /><span><b>方形脸 · 当前报告</b><small>选择后回到首页展示报告状态</small></span><ChevronRight /></button><button onClick={onUploadHome}><Camera /><span><b>创建新报告</b><small>回到首页并重新上传照片</small></span><ChevronRight /></button></div>
  </div></div>
}

function SettingsView({ onHome, onUploadHome, onNotifyHome }: { onHome: () => void; onUploadHome: () => void; onNotifyHome: () => void }) {
  return <div className="screen"><DetailTopBar title="设置与隐私" onHome={onHome} /><div className="page-pad settings-page">
    <SectionTitle title="隐私与数据" /><div className="list-card compact"><div className="info-row"><span><ShieldCheck /></span><div><b>照片用途</b><p>照片仅用于本次脸型分析与镜框推荐，不进入公开内容。</p></div></div><div className="info-row"><span><Trash2 /></span><div><b>删除控制</b><p>正式版会提供清除当前照片、报告与本地缓存的入口。</p></div></div><div className="info-row"><span><LockKeyhole /></span><div><b>本地优先</b><p>SDK 能在设备端完成的分析会优先在本地处理。</p></div></div></div>
    <SectionTitle title="操作" /><div className="menu-card"><button onClick={onNotifyHome}><Bell /><b>开启提醒并回首页</b><span className="switch on" /></button><button onClick={onUploadHome}><Camera /><b>重新开始并回首页</b><ChevronRight /></button></div>
  </div></div>
}

function PosterView({ onHome, onSaveHome }: { onHome: () => void; onSaveHome: () => void }) {
  return <div className="screen"><DetailTopBar title="试戴海报" onHome={onHome} /><div className="page-pad tryon-page">
    <div className="summary-card"><Glasses /><span><b>海报能力占位</b><small>正式版会生成可保存/分享的试戴结果图。</small></span></div><div className="tryon-grid"><button onClick={onSaveHome}><Portrait glasses="round" /><b>Round</b><span>92% 匹配</span></button><button onClick={onSaveHome}><Portrait glasses="brow" /><b>Aviator</b><span>91% 匹配</span></button></div>
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
  const saveResultHome = () => updateFlowHome('tryon-ready', '结果已保存到当前会话')
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

  if (view === 'report-detail') return <main className="app-shell"><div className="device-frame"><ReportDetailView onHome={goHome} onFramesHome={() => updateFlowHome('report-ready', '已回到首页，可查看推荐镜框摘要')} onTryOnHome={startTryOnHome} /></div></main>
  if (view === 'frames') return <main className="app-shell"><div className="device-frame"><FramesView onHome={goHome} onTryOnHome={startTryOnHome} /></div></main>
  if (view === 'tryon') return <main className="app-shell"><div className="device-frame"><TryOnView onHome={goHome} onSaveHome={saveResultHome} onPosterHome={posterHome} onUploadHome={() => updateFlowHome('photo-ready')} /></div></main>
  if (view === 'history') return <main className="app-shell"><div className="device-frame"><HistoryView onHome={goHome} onRestoreHome={() => updateFlowHome('report-ready', '已载入历史报告')} onUploadHome={() => updateFlowHome('photo-ready')} /></div></main>
  if (view === 'settings') return <main className="app-shell"><div className="device-frame"><SettingsView onHome={goHome} onUploadHome={() => updateFlowHome('photo-ready')} onNotifyHome={enableNotifyHome} /></div></main>
  if (view === 'poster') return <main className="app-shell"><div className="device-frame"><PosterView onHome={goHome} onSaveHome={saveResultHome} /></div></main>

  return <main className="app-shell"><div className="device-frame"><HomeView state={flowState} progress={progress} notice={notice} onUpload={() => updateFlowHome('photo-ready')} onAnalyze={() => updateFlowHome('analyzing')} onReset={() => updateFlowHome('empty')} onView={openViewFromHome} onTryOn={startTryOnHome} /></div></main>
}
