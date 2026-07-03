import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  ArrowRight, Bell, Camera, Check, ChevronRight, FileText, Glasses, Heart,
  Image as ImageIcon, LockKeyhole, MoreHorizontal, Ruler, Settings,
  ShieldCheck, Sparkles, Trash2, UserRound, Wand2,
} from 'lucide-react'

type FlowState = 'empty' | 'photo-ready' | 'analyzing' | 'report-ready' | 'tryon-ready'
type InlinePanel = 'none' | 'details' | 'privacy' | 'history' | 'settings' | 'saved'

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

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return <div className="section-title"><strong>{title}</strong>{action && <button>{action}<ChevronRight /></button>}</div>
}

function AppHeader({ state, onReset, onSettings }: { state: FlowState; onReset: () => void; onSettings: () => void }) {
  return <div className="home-head">
    <Logo />
    <button className="capsule" onClick={state === 'empty' ? onSettings : onReset} aria-label={state === 'empty' ? '设置' : '重置流程'}>
      {state === 'empty' ? <MoreHorizontal /> : <Trash2 />}
      <span />
      <span />
    </button>
  </div>
}

function StatusNotice({ message }: { message: string | null }) {
  if (!message) return null
  return <section className="content-section"><div className="success-note"><Check /> {message}</div></section>
}

function StateHero({ state, onUpload, onAnalyze, onShowReport, onTryOn }: { state: FlowState; onUpload: () => void; onAnalyze: () => void; onShowReport: () => void; onTryOn: () => void }) {
  if (state === 'empty') {
    return <section className="hero-card">
      <div><span className="eyebrow"><Sparkles /> AI Glasses Fit</span><h1>上传一张正面照，<br />找到更适合你的眼镜</h1><p>脸型分析 · 镜框推荐 · 试戴预览，一页完成。</p></div>
      <div className="hero-art"><div className="gem">◆</div><Glasses /></div>
      <PrimaryButton onClick={onUpload}><Camera /> 开始脸型分析</PrimaryButton>
      <PrimaryButton secondary onClick={onShowReport}><FileText /> 查看示例报告</PrimaryButton>
    </section>
  }

  if (state === 'photo-ready') {
    return <section className="hero-card">
      <div><span className="eyebrow"><ShieldCheck /> Photo Ready</span><h1>照片已准备好，<br />开始 AI 分析</h1><p>下一步将检测照片质量、识别面部关键点并生成推荐。</p></div>
      <PrimaryButton onClick={onAnalyze}><Sparkles /> 开始分析</PrimaryButton>
      <PrimaryButton secondary onClick={onUpload}><ImageIcon /> 重新选择照片</PrimaryButton>
    </section>
  }

  if (state === 'analyzing') {
    return <section className="hero-card">
      <div><span className="eyebrow"><Sparkles /> AI Analysis</span><h1>正在分析脸型</h1><p>预计需要 10–15 秒，正式版会接入 VisuTry SDK 实时结果。</p></div>
    </section>
  }

  if (state === 'report-ready') {
    return <section className="hero-card">
      <div><span className="eyebrow"><Check /> Report Ready</span><h1>你的脸型报告<br />已经生成</h1><p>方形脸 · 92% 匹配。推荐优先试戴圆形、眉框和飞行员款。</p></div>
      <PrimaryButton onClick={onTryOn}><Glasses /> 试戴推荐镜框</PrimaryButton>
      <PrimaryButton secondary onClick={onUpload}><Camera /> 重新分析</PrimaryButton>
    </section>
  }

  return <section className="hero-card">
    <div><span className="eyebrow"><Glasses /> Try-on Ready</span><h1>已生成 4 款<br />推荐试戴预览</h1><p>早期版本先展示推荐对比，下一轮接入真实 SDK 试戴。</p></div>
    <PrimaryButton onClick={onTryOn}><Glasses /> 查看试戴结果</PrimaryButton>
    <PrimaryButton secondary onClick={onShowReport}><FileText /> 返回报告摘要</PrimaryButton>
  </section>
}

function PhotoSection({ visible, onAnalyze, onPrivacy }: { visible: boolean; onAnalyze: () => void; onPrivacy: () => void }) {
  if (!visible) return null

  return <section className="content-section upload">
    <SectionTitle title="照片检查" />
    <div className="scan-photo"><Portrait /><span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" /><span className="face-guide" /></div>
    <div className="tips-row"><span>◉<small>不佩戴眼镜</small></span><span>☻<small>自然表情</small></span><span>♙<small>避免遮挡</small></span><span>☼<small>光线均匀</small></span></div>
    <div className="list-card">
      <button className="info-row" onClick={onPrivacy}><span><ShieldCheck /></span><div><b>隐私与权限</b><p>照片仅用于本次脸型分析。点击查看数据说明。</p></div></button>
      <div className="info-row"><span><Sparkles /></span><div><b>SDK 接入点</b><p>下一轮会在这里调用 @visutry/tryon-web 完成质量检测、关键点识别和脸型评分。</p></div></div>
    </div>
    <PrimaryButton onClick={onAnalyze}><Sparkles /> 开始分析</PrimaryButton>
  </section>
}

function AnalysisSection({ visible, progress }: { visible: boolean; progress: number }) {
  if (!visible) return null

  const activeStep = Math.min(3, Math.floor(progress / 28))

  return <section className="content-section analysis-body">
    <h1>AI 分析中</h1><p>根据照片计算脸型比例与镜框建议</p>
    <button className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as CSSProperties}><span>{progress}<small>%</small></span></button>
    <div className="analysis-steps">{['照片质量检测', '面部关键点识别', '脸型比例计算', '生成镜框推荐'].map((s, i) => <div className={i < activeStep ? 'done' : i === activeStep ? 'doing' : ''} key={s}><span>{i < activeStep ? <Check /> : i === activeStep ? <i /> : ''}</span><b>{s}</b><small>{i < activeStep ? '已完成' : i === activeStep ? '进行中' : '等待中'}</small></div>)}</div>
  </section>
}

function ReportSection({ visible, onTryOn, onDetails, onPrivacy }: { visible: boolean; onTryOn: () => void; onDetails: () => void; onPrivacy: () => void }) {
  if (!visible) return null

  return <section className="content-section report-page">
    <SectionTitle title="脸型报告" action="已生成" />
    <div className="result-card"><Portrait /><div><small>你的脸型：</small><h1>方形脸</h1><span className="match"><Check /> 92% 匹配</span><p>下颌角较明显，线条鲜明，整体轮廓偏方正。</p></div></div>
    <div className="metric-grid">{[['脸长/脸宽比', '1.23 : 1', '中等'], ['对称度', '高', '89%'], ['颧骨', '中等', '较突出'], ['下颌线', '强', '明显'], ['额头宽度', '中等', '适中'], ['下巴形状', '方形', '明显']].map(([a, b, c]) => <div key={a}><small>{a}</small><b>{b}</b><span>{c}</span></div>)}</div>
    <button className="summary-card" onClick={onDetails}><Sparkles /><span><b>综合评估：方形脸</b><small>建议选择圆润边角、适中宽度、上缘略重的镜框。</small></span><ChevronRight /></button>
    <div className="quick-nav"><button onClick={onDetails}><Ruler />尺寸</button><button onClick={onDetails}><Wand2 />风格</button><button onClick={onTryOn}><Glasses />推荐</button><button onClick={onPrivacy}><LockKeyhole />隐私</button></div>
    <PrimaryButton onClick={onTryOn}>试戴推荐镜框</PrimaryButton>
  </section>
}

function RecommendationsSection({ visible, onTryOn, onDetails }: { visible: boolean; onTryOn: () => void; onDetails: () => void }) {
  if (!visible) return null

  return <section className="content-section frames-page">
    <SectionTitle title="推荐镜框" action="Top 4" />
    {frames.map((f) => <button className="frame-row" key={f.name} onClick={onTryOn}><div className={`frame-icon ${f.kind}`}><GlassOverlay kind={f.kind} /></div><div><b>{f.zh}</b><small>{f.reason}</small><span>{f.score}% 适合度</span></div><ChevronRight /></button>)}
    <button className="text-link" onClick={onDetails}>查看推荐逻辑 <ArrowRight /></button>
  </section>
}

function TryOnSection({ visible, onSave, onShare, onRetry }: { visible: boolean; onSave: () => void; onShare: () => void; onRetry: () => void }) {
  if (!visible) return null

  return <section className="content-section tryon-page">
    <span className="eyebrow"><ShieldCheck /> 来自脸型报告的推荐</span><h2>Try On Your Top Picks</h2><p>当前展示的是发布前静态预览。下一轮将替换为真实 SDK 试戴结果。</p>
    <div className="tryon-grid">{frames.map((f) => <button key={f.name} onClick={onSave}><Portrait glasses={f.kind} /><Heart /><b>{f.name}</b><span>{f.score}% 匹配</span></button>)}</div>
    <div className="summary-card"><Glasses /><span><b>已为你匹配 4 款最佳镜框</b><small>社交帮选与好友投票后置到 v1.5+</small></span></div>
    <PrimaryButton onClick={onSave}>保存当前结果</PrimaryButton><button className="text-link" onClick={onShare}><ArrowRight /> 生成试戴海报（后续接入）</button>
    <button className="muted-link" onClick={onRetry}>重新分析一张照片</button>
  </section>
}

function InlinePanelSection({ panel, onClose, onUpload, onShowReport }: { panel: InlinePanel; onClose: () => void; onUpload: () => void; onShowReport: () => void }) {
  if (panel === 'none') return null

  const titleMap: Record<Exclude<InlinePanel, 'none'>, string> = {
    details: '报告细节',
    privacy: '隐私与数据',
    history: '历史记录',
    settings: '设置',
    saved: '已保存',
  }

  return <section className="content-section profile-page">
    <SectionTitle title={titleMap[panel]} action="关闭" />
    {panel === 'details' && <div className="list-card compact">
      {[
        ['脸型特征', '额头与下颌宽度相近，下颌角较明显，整体轮廓偏方正。'],
        ['尺寸建议', '镜框总宽建议 138–142 mm，镜片宽度 52–54 mm。'],
        ['风格建议', '推荐圆形、椭圆形、飞行员或轻眉框款式。'],
        ['推荐逻辑', '用圆润或上缘略重的框型平衡下颌线，避免过窄矩形框。'],
      ].map(([a, b]) => <div className="info-row" key={a}><span><Check /></span><div><b>{a}</b><p>{b}</p></div></div>)}
    </div>}
    {panel === 'privacy' && <div className="list-card compact">
      <div className="info-row"><span><ShieldCheck /></span><div><b>照片用途</b><p>照片仅用于本次脸型分析与镜框推荐，不进入公开内容。</p></div></div>
      <div className="info-row"><span><Trash2 /></span><div><b>删除控制</b><p>正式版会提供清除当前照片、报告与本地缓存的入口。</p></div></div>
      <div className="info-row"><span><LockKeyhole /></span><div><b>本地优先</b><p>SDK 能在设备端完成的分析会优先在本地处理。</p></div></div>
    </div>}
    {panel === 'history' && <div className="menu-card">
      <button onClick={onShowReport}><FileText /><span><b>方形脸 · 当前报告</b><small>92% 匹配 · 推荐 4 款镜框</small></span><ChevronRight /></button>
      <button onClick={onUpload}><Camera /><span><b>创建新报告</b><small>重新上传照片并分析</small></span><ChevronRight /></button>
    </div>}
    {panel === 'settings' && <div className="menu-card">
      <button><Bell /><b>通知提醒</b><span className="switch on" /></button>
      <button onClick={onUpload}><Camera /><b>重新开始</b><ChevronRight /></button>
      <button onClick={onShowReport}><FileText /><b>查看示例报告</b><ChevronRight /></button>
    </div>}
    {panel === 'saved' && <div className="success-note"><Check /> 当前试戴结果已保存。正式版会写入历史记录并支持图片导出。</div>}
    <button className="muted-link" onClick={onClose}>收起</button>
  </section>
}

function UtilitySection({ state, onUpload, onShowReport, onTryOn, onPanel }: { state: FlowState; onUpload: () => void; onShowReport: () => void; onTryOn: () => void; onPanel: (panel: InlinePanel) => void }) {
  return <section className="content-section profile-page">
    <SectionTitle title={state === 'empty' ? '你将获得' : '更多操作'} />
    {state === 'empty' ? <div className="feature-grid">
      <button onClick={onUpload}><span><Camera /></span><b>脸型分析</b><small>上传照片</small></button>
      <button onClick={onShowReport}><span><FileText /></span><b>示例报告</b><small>先看效果</small></button>
      <button onClick={onTryOn}><span><Glasses /></span><b>镜框推荐</b><small>Top picks</small></button>
    </div> : <div className="menu-card">
      <button onClick={onShowReport}><FileText /><b>查看报告摘要</b><ChevronRight /></button>
      <button onClick={onUpload}><Camera /><b>重新分析照片</b><ChevronRight /></button>
      <button onClick={() => onPanel('settings')}><Settings /><b>设置与隐私</b><ChevronRight /></button>
      <button onClick={() => onPanel('history')}><UserRound /><b>历史记录</b><ChevronRight /></button>
    </div>}
  </section>
}

export default function App() {
  const [flowState, setFlowState] = useState<FlowState>('empty')
  const [activePanel, setActivePanel] = useState<InlinePanel>('none')
  const [notice, setNotice] = useState<string | null>(null)
  const [progress, setProgress] = useState(28)

  const updateFlow = (next: FlowState) => {
    setFlowState(next)
    setActivePanel('none')
    setNotice(null)
    window.scrollTo(0, 0)
  }

  const showPanel = (panel: InlinePanel) => {
    setActivePanel(panel)
    setNotice(null)
  }

  const saveResult = () => {
    setFlowState('tryon-ready')
    setActivePanel('saved')
    setNotice('结果已保存到当前会话')
  }

  const shareResult = () => {
    setFlowState('tryon-ready')
    setActivePanel('saved')
    setNotice('已生成海报占位，等待正式分享能力接入')
  }

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

  const visible = useMemo(() => ({
    photo: flowState === 'photo-ready',
    analysis: flowState === 'analyzing',
    report: flowState === 'report-ready' || flowState === 'tryon-ready',
    recommendations: flowState === 'report-ready' || flowState === 'tryon-ready',
    tryon: flowState === 'tryon-ready',
  }), [flowState])

  return <main className="app-shell"><div className="device-frame">
    <div className="screen home-screen">
      <AppHeader state={flowState} onReset={() => updateFlow('empty')} onSettings={() => showPanel('settings')} />
      <StateHero state={flowState} onUpload={() => updateFlow('photo-ready')} onAnalyze={() => updateFlow('analyzing')} onShowReport={() => updateFlow('report-ready')} onTryOn={() => updateFlow('tryon-ready')} />
      <StatusNotice message={notice} />
      <PhotoSection visible={visible.photo} onAnalyze={() => updateFlow('analyzing')} onPrivacy={() => showPanel('privacy')} />
      <AnalysisSection visible={visible.analysis} progress={progress} />
      <ReportSection visible={visible.report} onTryOn={() => updateFlow('tryon-ready')} onDetails={() => showPanel('details')} onPrivacy={() => showPanel('privacy')} />
      <RecommendationsSection visible={visible.recommendations} onTryOn={() => updateFlow('tryon-ready')} onDetails={() => showPanel('details')} />
      <TryOnSection visible={visible.tryon} onSave={saveResult} onShare={shareResult} onRetry={() => updateFlow('photo-ready')} />
      <InlinePanelSection panel={activePanel} onClose={() => setActivePanel('none')} onUpload={() => updateFlow('photo-ready')} onShowReport={() => updateFlow('report-ready')} />
      <UtilitySection state={flowState} onUpload={() => updateFlow('photo-ready')} onShowReport={() => updateFlow('report-ready')} onTryOn={() => updateFlow('tryon-ready')} onPanel={showPanel} />
    </div>
  </div></main>
}
