import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  ArrowLeft, ArrowRight, Camera, Check, ChevronRight, FileText, Glasses, Heart,
  Home, Image as ImageIcon, LockKeyhole, Maximize2, MoreHorizontal, Ruler,
  Search, Settings, ShieldCheck, Sparkles, Trash2, UserRound, Wand2,
} from 'lucide-react'

type Tab = 'home' | 'face' | 'profile'
type FlowStep = 'photo' | 'analyzing' | 'report' | 'report-detail' | 'recommendations' | 'tryon-session' | 'settings'
type FlowStage = 'photo' | 'analysis' | 'report' | 'picks'

const portrait = '/assets/face-model.png'

const frames = [
  { name: 'Round', zh: '圆形镜框', score: 92, kind: 'round', reason: '柔和轮廓，平衡脸部线条' },
  { name: 'Aviator', zh: '眉框 / 半框', score: 91, kind: 'brow', reason: '轻盈百搭，提升眉眼存在感' },
  { name: 'Browline', zh: '飞行员框', score: 88, kind: 'aviator', reason: '增强纵向比例，适合通勤场景' },
  { name: 'Wayfarer', zh: '方形镜框', score: 85, kind: 'square', reason: '经典利落，但需要控制框宽' },
]

const flowStages: Array<[FlowStage, string]> = [
  ['photo', '照片'],
  ['analysis', '分析'],
  ['report', '报告'],
  ['picks', '推荐'],
]

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="logo"><span className="logo-mark"><i /><i /><i /></span>{!compact && <b>VisuTry</b>}</div>
}

function TopBar({ title, back, right }: { title: string; back?: () => void; right?: ReactNode }) {
  return <header className="topbar">
    <button className={`icon-btn ${back ? '' : 'ghost'}`} onClick={back} aria-label="返回"><ArrowLeft /></button>
    <strong>{title}</strong>
    <div className="top-actions">{right ?? <button className="capsule"><MoreHorizontal /><span /><span /></button>}</div>
  </header>
}

function FlowProgress({ active }: { active: FlowStage }) {
  const activeIndex = flowStages.findIndex(([key]) => key === active)

  return <div style={{ padding: '10px 18px 0', background: '#fff' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, padding: 6, border: '1px solid var(--line)', borderRadius: 14, background: '#f8faff' }}>
      {flowStages.map(([key, label], index) => {
        const isActive = key === active
        const isDone = index < activeIndex
        return <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, height: 28, borderRadius: 10, fontSize: 11, fontWeight: isActive ? 800 : 600, color: isActive ? 'var(--blue)' : isDone ? '#19b55a' : '#8a96a9', background: isActive ? '#eef5ff' : 'transparent' }}>
          <span style={{ width: 14, height: 14, borderRadius: 99, display: 'grid', placeItems: 'center', border: `1.5px solid ${isActive ? 'var(--blue)' : isDone ? '#19b55a' : '#ccd5e1'}`, fontSize: 9 }}>{isDone ? '✓' : index + 1}</span>
          {label}
        </div>
      })}
    </div>
  </div>
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

function BottomNav({ tab, onTab }: { tab: Tab; onTab: (tab: Tab) => void }) {
  const items: Array<[Tab, string, ReactNode]> = [
    ['home', '首页', <Home />],
    ['face', '脸型', <FileText />],
    ['profile', '我的', <UserRound />],
  ]
  return <nav className="bottom-nav">{items.map(([key, label, icon]) =>
    <button key={key} className={tab === key ? 'active' : ''} onClick={() => onTab(key)}>{icon}<span>{label}</span></button>,
  )}</nav>
}

function HomeScreen({ go }: { go: (p: FlowStep) => void }) {
  return <div className="screen home-screen">
    <div className="home-head"><Logo /><button className="capsule"><MoreHorizontal /><span /><span /></button></div>
    <section className="hero-card">
      <div><span className="eyebrow"><Sparkles /> Early release flow</span><h1>先分析脸型，<br />再查看适合的镜框</h1><p>Photo → AI Analysis → Report → Picks</p></div>
      <div className="hero-art"><div className="gem">◆</div><Glasses /></div>
      <PrimaryButton onClick={() => go('photo')}><Camera /> 开始脸型分析</PrimaryButton>
      <PrimaryButton secondary onClick={() => go('report')}><FileText /> 查看示例报告</PrimaryButton>
    </section>
    <section className="content-section"><SectionTitle title="发布版核心路径" /><div className="feature-grid">
      <button onClick={() => go('photo')}><span><Camera /></span><b>上传照片</b><small>拍照或相册</small></button>
      <button onClick={() => go('report')}><span><Maximize2 /></span><b>脸型报告</b><small>结构化分析</small></button>
      <button onClick={() => go('recommendations')}><span><Glasses /></span><b>镜框推荐</b><small>Top picks</small></button>
    </div></section>
    <section className="content-section"><SectionTitle title="最近报告" action="查看全部" /><button className="recent-card" onClick={() => go('report')}><Portrait /><div><b>方形脸 · 中等脸宽</b><span>92% 匹配度</span><small>当前原型数据，等待 SDK 接入</small></div><ChevronRight /></button></section>
    <section className="content-section"><SectionTitle title="发布前说明" /><ul className="check-list compact"><li><Check />早期版本保留 3 个底部 Tab：首页、脸型、我的</li><li><Check />二级页面不放底部导航，改用顶部流程指示器</li><li><Check />Try-on 作为报告后的下一步，不作为独立 Tab</li></ul></section>
  </div>
}

function PhotoScreen({ go, back }: { go: (p: FlowStep) => void; back: () => void }) {
  return <div className="screen"><TopBar title="上传照片" back={back} /><FlowProgress active="photo" />
    <div className="page-pad upload"><h2>请上传清晰正面照</h2><p>确保人脸清晰可见，获得更准确的脸型分析与试戴推荐</p>
      <div className="scan-photo"><Portrait /><span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" /><span className="face-guide" /></div>
      <div className="tips-row"><span>◉<small>不佩戴眼镜</small></span><span>☻<small>自然表情</small></span><span>♙<small>避免遮挡</small></span><span>☼<small>光线均匀</small></span></div>
      <div className="list-card">
        <div className="info-row"><span><ShieldCheck /></span><div><b>隐私与权限</b><p>照片仅用于本次脸型分析。正式发布版将接入真实授权、错误处理与删除能力。</p></div></div>
        <div className="info-row"><span><Sparkles /></span><div><b>SDK 接入点</b><p>下一轮会在这里调用 @visutry/tryon-web 完成质量检测、关键点识别和脸型评分。</p></div></div>
      </div>
      <div className="sticky-actions"><PrimaryButton onClick={() => go('analyzing')}><Camera /> 拍照并分析</PrimaryButton><PrimaryButton secondary onClick={() => go('analyzing')}><ImageIcon /> 从相册选择</PrimaryButton></div>
    </div>
  </div>
}

function AnalyzingScreen({ go, back }: { go: (p: FlowStep) => void; back: () => void }) {
  const [progress, setProgress] = useState(28)
  useEffect(() => {
    const id = window.setInterval(() => setProgress((p) => (p >= 92 ? 92 : p + 7)), 500)
    return () => window.clearInterval(id)
  }, [])
  return <div className="screen analysis"><TopBar title="AI 检测中" back={back} /><FlowProgress active="analysis" /><div className="analysis-body"><h1>AI 分析中</h1><p>预计需要 10–15 秒</p>
    <button className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as CSSProperties} onClick={() => go('report')}><span>{progress}<small>%</small></span></button>
    <div className="analysis-steps">{['照片质量检测', '面部关键点识别', '脸型比例计算', '生成镜框推荐'].map((s, i) => <div className={i < 1 ? 'done' : i === 1 ? 'doing' : ''} key={s}><span>{i < 1 ? <Check /> : i === 1 ? <i /> : ''}</span><b>{s}</b><small>{i < 1 ? '已完成' : i === 1 ? '进行中' : '等待中'}</small></div>)}</div>
    <button className="security-note"><ShieldCheck /><span><b>本地优先处理</b><small>正式版将尽量在设备端完成 face geometry 分析</small></span><ChevronRight /></button>
    <PrimaryButton onClick={() => go('report')}>查看分析报告</PrimaryButton>
  </div></div>
}

function ReportOverview({ go, back }: { go: (p: FlowStep) => void; back?: () => void }) {
  return <div className="screen"><TopBar title="脸型报告" back={back} />{back && <FlowProgress active="report" />}<div className="page-pad report-page">
    <div className="result-card"><Portrait /><div><small>你的脸型：</small><h1>方形脸</h1><span className="match"><Check /> 92% 匹配</span><p>下颌角较明显，线条鲜明，整体轮廓偏方正。</p></div></div>
    <div className="metric-grid">{[['脸长/脸宽比', '1.23 : 1', '中等'], ['对称度', '高', '89%'], ['颧骨', '中等', '较突出'], ['下颌线', '强', '明显'], ['额头宽度', '中等', '适中'], ['下巴形状', '方形', '明显']].map(([a, b, c]) => <div key={a}><small>{a}</small><b>{b}</b><span>{c}</span></div>)}</div>
    <button className="summary-card" onClick={() => go('report-detail')}><Sparkles /><span><b>综合评估：方形脸</b><small>你的面部结构特征与方形脸高度匹配</small></span><ChevronRight /></button>
    <div className="quick-nav"><button onClick={() => go('report-detail')}><Maximize2 />详情</button><button onClick={() => go('recommendations')}><Glasses />推荐</button><button onClick={() => go('report-detail')}><Ruler />尺寸</button><button onClick={() => go('report-detail')}><Wand2 />风格</button></div>
    <PrimaryButton onClick={() => go('recommendations')}>查看镜框推荐</PrimaryButton><p className="legal"><LockKeyhole /> 结果仅供参考，不作为医疗诊断依据</p>
  </div></div>
}

function ReportDetail({ go, back }: { go: (p: FlowStep) => void; back: () => void }) {
  return <div className="screen"><TopBar title="报告详情" back={back} /><FlowProgress active="report" /><div className="subtabs"><button className="active">总览</button><button>脸型</button><button>尺寸</button><button>风格</button></div><div className="page-pad detail-page">
    <h3>脸型概览</h3><p>基于面部关键点与比例分析得出的结果。</p><div className="face-map"><div className="head-outline"><span /><i /><b /></div><ul><li>脸长</li><li>脸宽</li><li>颧骨宽度</li><li>下颌线</li></ul></div>
    <h3>分析解读</h3><div className="summary-card"><Sparkles /><span><b>下颌线较明显，整体轮廓偏利落</b><small>适合通过圆润镜框增加平衡感。</small></span></div>
    <div className="list-card compact">{[['脸型特征', '额头与下颌宽度相近，下颌角较明显'], ['尺寸建议', '镜框总宽建议 138–142 mm，镜片宽度 52–54 mm'], ['风格建议', '推荐圆形、椭圆形、飞行员或轻眉框款式']].map(([a, b]) => <div className="info-row" key={a}><span><Check /></span><div><b>{a}</b><p>{b}</p></div></div>)}</div>
    <PrimaryButton onClick={() => go('recommendations')}>进入镜框推荐</PrimaryButton>
  </div></div>
}

function RecommendationsScreen({ go, back }: { go: (p: FlowStep) => void; back?: () => void }) {
  return <div className="screen"><TopBar title="镜框推荐" back={back} />{back && <FlowProgress active="picks" />}<div className="segmented"><button className="active">推荐镜框</button><button>避免镜框</button></div><div className="page-pad frames-page"><SectionTitle title="为你推荐 TOP 4" />
    {frames.map((f) => <button className="frame-row" key={f.name} onClick={() => go('tryon-session')}><div className={`frame-icon ${f.kind}`}><GlassOverlay kind={f.kind} /></div><div><b>{f.zh}</b><small>{f.reason}</small><span>{f.score}% 适合度</span></div><ChevronRight /></button>)}
    <SectionTitle title="尽量避免" /><div className="avoid-grid"><div><GlassOverlay kind="tiny" /><b>窄矩形框</b><span>28% 适合度</span></div><div><GlassOverlay kind="tiny-round" /><b>小圆框</b><span>31% 适合度</span></div></div>
    <PrimaryButton onClick={() => go('tryon-session')}>试戴推荐镜框</PrimaryButton>
  </div></div>
}

function TryOnSession({ go, back }: { go: (p: FlowStep) => void; back?: () => void }) {
  return <div className="screen"><TopBar title="试戴预览" back={back} />{back && <FlowProgress active="picks" />}<div className="page-pad tryon-page"><span className="eyebrow"><ShieldCheck /> 来自脸型报告的推荐</span><h2>Try On Your Top Picks</h2><p>早期版本不把 Try On 做成独立 Tab；它作为报告推荐后的下一步，保持路径简单。</p>
    <div className="tryon-grid">{frames.map((f) => <button key={f.name}><Portrait glasses={f.kind} /><Heart /><b>{f.name}</b><span>{f.score}% 匹配</span></button>)}</div>
    <div className="summary-card"><Glasses /><span><b>已为你匹配 4 款最佳镜框</b><small>真实 SDK 试戴将在下一轮接入</small></span></div>
    <PrimaryButton onClick={() => go('recommendations')}>重新选择镜框</PrimaryButton><button className="text-link"><ArrowRight /> 生成试戴海报（后续接入）</button>
  </div></div>
}

function FaceTab({ go }: { go: (p: FlowStep) => void }) {
  return <div className="screen tab-screen"><TopBar title="脸型" /><div className="page-pad reports-list">
    <div className="search-row"><label><Search /><input placeholder="搜索报告" /></label><button>筛选</button></div>
    <button className="recent-card" onClick={() => go('report')}><Portrait /><div><b>方形脸 · 当前报告</b><span>92% 匹配度</span><small>点击查看完整报告与推荐镜框</small></div><ChevronRight /></button>
    <SectionTitle title="报告入口" />
    <div className="feature-grid">
      <button onClick={() => go('report')}><span><FileText /></span><b>报告</b><small>总览</small></button>
      <button onClick={() => go('report-detail')}><span><Ruler /></span><b>细节</b><small>尺寸/风格</small></button>
      <button onClick={() => go('recommendations')}><span><Glasses /></span><b>推荐</b><small>Top picks</small></button>
    </div>
  </div></div>
}

function ProfileScreen({ go }: { go: (p: FlowStep) => void }) {
  return <div className="screen tab-screen"><TopBar title="我的" /><div className="page-pad profile-page"><div className="profile-card"><Portrait /><div><h2>VisuTry 用户</h2><span>微信号：visutry_user</span></div><ChevronRight /></div><button className="unlock-banner" onClick={() => go('report')}><Sparkles /><span><b>完整报告 & 镜框推荐</b><small>早期版本聚焦分析与推荐闭环</small></span><b>查看</b></button><div className="menu-card">{[[<FileText />, '我的报告', 'report'], [<Heart />, '我的收藏', 'recommendations'], [<Settings />, '设置', 'settings'], [<Trash2 />, '数据与隐私', 'settings']].map(([icon, label, target]) => <button key={String(label)} onClick={() => go(target as FlowStep)}><span>{icon}</span><b>{label}</b><ChevronRight /></button>)}</div></div></div>
}

function SettingsScreen({ back }: { back: () => void }) {
  return <div className="screen"><TopBar title="设置与帮助" back={back} /><div className="page-pad settings-page"><SectionTitle title="账号与隐私" /><div className="menu-card"><button><UserRound /><b>账号与绑定</b><ChevronRight /></button><button><ShieldCheck /><span><b>隐私与数据</b><small>照片仅用于分析，可随时删除</small></span><ChevronRight /></button></div><SectionTitle title="发布版检查" /><div className="menu-card"><button><FileText /><b>检测记录</b><ChevronRight /></button><button><Settings /><b>SDK 与 PWA 状态</b><ChevronRight /></button></div><p className="version">当前版本 0.1.0<br /><span>《用户协议》　|　《隐私政策》</span></p></div></div>
}

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [stack, setStack] = useState<FlowStep[]>([])
  const page = stack[stack.length - 1]
  const go = (next: FlowStep) => { setStack((s) => [...s, next]); window.scrollTo(0, 0) }
  const back = () => { setStack((s) => s.slice(0, -1)); window.scrollTo(0, 0) }
  const openTab = (next: Tab) => { setTab(next); setStack([]); window.scrollTo(0, 0) }

  const content = useMemo(() => {
    if (!page) {
      if (tab === 'home') return <HomeScreen go={go} />
      if (tab === 'face') return <FaceTab go={go} />
      return <ProfileScreen go={go} />
    }
    const props = { go, back }
    switch (page) {
      case 'photo': return <PhotoScreen {...props} />
      case 'analyzing': return <AnalyzingScreen {...props} />
      case 'report': return <ReportOverview {...props} />
      case 'report-detail': return <ReportDetail {...props} />
      case 'recommendations': return <RecommendationsScreen {...props} />
      case 'tryon-session': return <TryOnSession {...props} />
      case 'settings': return <SettingsScreen back={back} />
    }
  }, [page, tab])

  return <main className="app-shell"><div className="device-frame">{content}{!page && <BottomNav tab={tab} onTab={openTab} />}</div></main>
}
