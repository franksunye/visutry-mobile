import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  ArrowRight, Camera, Check, ChevronRight, FileText, Glasses, Heart,
  Image as ImageIcon, LockKeyhole, MoreHorizontal, Ruler, Settings,
  ShieldCheck, Sparkles, Trash2, UserRound, Wand2,
} from 'lucide-react'

type FlowState = 'empty' | 'photo-ready' | 'analyzing' | 'report-ready' | 'tryon-ready'

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

function AppHeader({ state, onReset }: { state: FlowState; onReset: () => void }) {
  return <div className="home-head">
    <Logo />
    <button className="capsule" onClick={onReset} aria-label="重置流程">
      {state === 'empty' ? <MoreHorizontal /> : <Trash2 />}
      <span />
      <span />
    </button>
  </div>
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

function PhotoSection({ visible, onAnalyze }: { visible: boolean; onAnalyze: () => void }) {
  if (!visible) return null

  return <section className="content-section upload">
    <SectionTitle title="照片检查" />
    <div className="scan-photo"><Portrait /><span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" /><span className="face-guide" /></div>
    <div className="tips-row"><span>◉<small>不佩戴眼镜</small></span><span>☻<small>自然表情</small></span><span>♙<small>避免遮挡</small></span><span>☼<small>光线均匀</small></span></div>
    <div className="list-card">
      <div className="info-row"><span><ShieldCheck /></span><div><b>隐私与权限</b><p>照片仅用于本次脸型分析。正式发布版将提供删除与本地缓存控制。</p></div></div>
      <div className="info-row"><span><Sparkles /></span><div><b>SDK 接入点</b><p>下一轮会在这里调用 @visutry/tryon-web 完成质量检测、关键点识别和脸型评分。</p></div></div>
    </div>
    <PrimaryButton onClick={onAnalyze}><Sparkles /> 开始分析</PrimaryButton>
  </section>
}

function AnalysisSection({ visible, progress }: { visible: boolean; progress: number }) {
  if (!visible) return null

  return <section className="content-section analysis-body">
    <h1>AI 分析中</h1><p>根据照片计算脸型比例与镜框建议</p>
    <button className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as CSSProperties}><span>{progress}<small>%</small></span></button>
    <div className="analysis-steps">{['照片质量检测', '面部关键点识别', '脸型比例计算', '生成镜框推荐'].map((s, i) => <div className={i < Math.floor(progress / 28) ? 'done' : i === Math.floor(progress / 28) ? 'doing' : ''} key={s}><span>{i < Math.floor(progress / 28) ? <Check /> : i === Math.floor(progress / 28) ? <i /> : ''}</span><b>{s}</b><small>{i < Math.floor(progress / 28) ? '已完成' : i === Math.floor(progress / 28) ? '进行中' : '等待中'}</small></div>)}</div>
  </section>
}

function ReportSection({ visible, onTryOn }: { visible: boolean; onTryOn: () => void }) {
  if (!visible) return null

  return <section className="content-section report-page">
    <SectionTitle title="脸型报告" action="已生成" />
    <div className="result-card"><Portrait /><div><small>你的脸型：</small><h1>方形脸</h1><span className="match"><Check /> 92% 匹配</span><p>下颌角较明显，线条鲜明，整体轮廓偏方正。</p></div></div>
    <div className="metric-grid">{[['脸长/脸宽比', '1.23 : 1', '中等'], ['对称度', '高', '89%'], ['颧骨', '中等', '较突出'], ['下颌线', '强', '明显'], ['额头宽度', '中等', '适中'], ['下巴形状', '方形', '明显']].map(([a, b, c]) => <div key={a}><small>{a}</small><b>{b}</b><span>{c}</span></div>)}</div>
    <div className="summary-card"><Sparkles /><span><b>综合评估：方形脸</b><small>建议选择圆润边角、适中宽度、上缘略重的镜框。</small></span></div>
    <div className="quick-nav"><button><Ruler />尺寸</button><button><Wand2 />风格</button><button><Glasses />推荐</button><button><LockKeyhole />隐私</button></div>
    <PrimaryButton onClick={onTryOn}>试戴推荐镜框</PrimaryButton>
  </section>
}

function RecommendationsSection({ visible, onTryOn }: { visible: boolean; onTryOn: () => void }) {
  if (!visible) return null

  return <section className="content-section frames-page">
    <SectionTitle title="推荐镜框" action="Top 4" />
    {frames.map((f) => <button className="frame-row" key={f.name} onClick={onTryOn}><div className={`frame-icon ${f.kind}`}><GlassOverlay kind={f.kind} /></div><div><b>{f.zh}</b><small>{f.reason}</small><span>{f.score}% 适合度</span></div><ChevronRight /></button>)}
  </section>
}

function TryOnSection({ visible }: { visible: boolean }) {
  if (!visible) return null

  return <section className="content-section tryon-page">
    <span className="eyebrow"><ShieldCheck /> 来自脸型报告的推荐</span><h2>Try On Your Top Picks</h2><p>当前展示的是发布前静态预览。下一轮将替换为真实 SDK 试戴结果。</p>
    <div className="tryon-grid">{frames.map((f) => <button key={f.name}><Portrait glasses={f.kind} /><Heart /><b>{f.name}</b><span>{f.score}% 匹配</span></button>)}</div>
    <div className="summary-card"><Glasses /><span><b>已为你匹配 4 款最佳镜框</b><small>社交帮选与好友投票后置到 v1.5+</small></span></div>
    <PrimaryButton>保存当前结果</PrimaryButton><button className="text-link"><ArrowRight /> 生成试戴海报（后续接入）</button>
  </section>
}

function UtilitySection({ state, onUpload, onShowReport }: { state: FlowState; onUpload: () => void; onShowReport: () => void }) {
  return <section className="content-section profile-page">
    <SectionTitle title={state === 'empty' ? '你将获得' : '更多操作'} />
    {state === 'empty' ? <div className="feature-grid">
      <button onClick={onUpload}><span><Camera /></span><b>脸型分析</b><small>上传照片</small></button>
      <button onClick={onShowReport}><span><FileText /></span><b>示例报告</b><small>先看效果</small></button>
      <button><span><Glasses /></span><b>镜框推荐</b><small>Top picks</small></button>
    </div> : <div className="menu-card">
      <button onClick={onShowReport}><FileText /><b>查看报告摘要</b><ChevronRight /></button>
      <button onClick={onUpload}><Camera /><b>重新分析照片</b><ChevronRight /></button>
      <button><Settings /><b>设置与隐私</b><ChevronRight /></button>
      <button><UserRound /><b>历史记录</b><ChevronRight /></button>
    </div>}
  </section>
}

export default function App() {
  const [flowState, setFlowState] = useState<FlowState>('empty')
  const [progress, setProgress] = useState(28)

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
      <AppHeader state={flowState} onReset={() => setFlowState('empty')} />
      <StateHero state={flowState} onUpload={() => setFlowState('photo-ready')} onAnalyze={() => setFlowState('analyzing')} onShowReport={() => setFlowState('report-ready')} onTryOn={() => setFlowState('tryon-ready')} />
      <PhotoSection visible={visible.photo} onAnalyze={() => setFlowState('analyzing')} />
      <AnalysisSection visible={visible.analysis} progress={progress} />
      <ReportSection visible={visible.report} onTryOn={() => setFlowState('tryon-ready')} />
      <RecommendationsSection visible={visible.recommendations} onTryOn={() => setFlowState('tryon-ready')} />
      <TryOnSection visible={visible.tryon} />
      <UtilitySection state={flowState} onUpload={() => setFlowState('photo-ready')} onShowReport={() => setFlowState('report-ready')} />
    </div>
  </div></main>
}
