import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft, ArrowRight, Bell, Camera, Check, ChevronRight, HelpCircle,
  Clock3, FileText, Glasses, Heart, Home, Image as ImageIcon, Link2, LockKeyhole,
  Maximize2, MessageCircle, MoreHorizontal, Ruler, Search, Settings, Share2,
  ShieldCheck, Sparkles, Trash2, UserRound, Users, Wand2,
} from 'lucide-react'

type Tab = 'home' | 'reports' | 'profile'
type Page =
  | 'upload' | 'privacy' | 'analyzing' | 'report' | 'detail' | 'frames' | 'size'
  | 'unlock' | 'style' | 'tryon' | 'tryon-detail' | 'share-preview' | 'share'
  | 'social' | 'liked' | 'feedback' | 'messages' | 'decision' | 'settings'

const portrait = '/assets/face-model.png'

const frames = [
  { name: 'Round', zh: '圆形镜框', score: 92, kind: 'round' },
  { name: 'Aviator', zh: '眉框 / 半框', score: 91, kind: 'brow' },
  { name: 'Browline', zh: '飞行员框', score: 88, kind: 'aviator' },
  { name: 'Wayfarer', zh: '方形镜框', score: 85, kind: 'square' },
]

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="logo"><span className="logo-mark"><i /><i /><i /></span>{!compact && <b>VisuTry</b>}</div>
}

function TopBar({ title, back, right }: { title: string; back?: () => void; right?: React.ReactNode }) {
  return <header className="topbar">
    <button className={`icon-btn ${back ? '' : 'ghost'}`} onClick={back} aria-label="返回"><ArrowLeft /></button>
    <strong>{title}</strong>
    <div className="top-actions">{right ?? <button className="capsule"><MoreHorizontal /><span /><span /></button>}</div>
  </header>
}

function PrimaryButton({ children, onClick, secondary = false }: { children: React.ReactNode; onClick?: () => void; secondary?: boolean }) {
  return <button className={`primary ${secondary ? 'secondary' : ''}`} onClick={onClick}>{children}</button>
}

function GlassOverlay({ kind = 'round' }: { kind?: string }) {
  return <div className={`glasses-overlay ${kind}`}><i /><i /><b /></div>
}

function Portrait({ glasses, className = '' }: { glasses?: string | false; className?: string }) {
  return <div className={`portrait ${className}`}><img src={portrait} alt="用于演示脸型分析的模特" />{glasses && <GlassOverlay kind={glasses} />}</div>
}

function BottomNav({ tab, onTab }: { tab: Tab; onTab: (tab: Tab) => void }) {
  const items: Array<[Tab, string, React.ReactNode]> = [
    ['home', '首页', <Home />], ['reports', '报告', <FileText />], ['profile', '我的', <UserRound />],
  ]
  return <nav className="bottom-nav">{items.map(([key, label, icon]) =>
    <button key={key} className={tab === key ? 'active' : ''} onClick={() => onTab(key)}>{icon}<span>{label}</span></button>
  )}</nav>
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return <div className="section-title"><strong>{title}</strong>{action && <button>{action}<ChevronRight /></button>}</div>
}

function HomeScreen({ go }: { go: (p: Page) => void }) {
  return <div className="screen home-screen">
    <div className="home-head"><Logo /><button className="capsule"><MoreHorizontal /><span /><span /></button></div>
    <section className="hero-card">
      <div><span className="eyebrow"><Sparkles /> AI 智能识别</span><h1>AI 脸型分析，<br />找到更适合你的镜框</h1><p>专业算法 · 精准匹配 · 个性推荐</p></div>
      <div className="hero-art"><div className="gem">◆</div><Glasses /></div>
      <PrimaryButton onClick={() => go('upload')}><Camera /> 拍照分析</PrimaryButton>
      <PrimaryButton secondary onClick={() => go('upload')}><ImageIcon /> 从相册上传</PrimaryButton>
    </section>
    <section className="content-section"><SectionTitle title="功能亮点" action="查看全部" /><div className="feature-grid">
      <button onClick={() => go('detail')}><span><Maximize2 /></span><b>脸型分析</b><small>识别 6 种脸型</small></button>
      <button onClick={() => go('frames')}><span><Glasses /></span><b>镜框推荐</b><small>匹配最佳镜框</small></button>
      <button onClick={() => go('size')}><span><ShieldCheck /></span><b>尺寸建议</b><small>更合适的佩戴体验</small></button>
    </div></section>
    <section className="content-section"><SectionTitle title="最近报告" action="查看全部" /><button className="recent-card" onClick={() => go('report')}><Portrait /><div><b>方形脸 · 中等脸宽</b><span>78% 匹配度</span><small>2026-06-29 13:56</small></div><ChevronRight /></button></section>
    <section className="content-section"><SectionTitle title="检测说明" action="查看详情" /><ul className="check-list compact"><li><Check />仅需清晰正面照，约 10–15 秒完成分析</li><li><Check />基于专业算法，结果仅供参考</li><li><Check />保护隐私，照片仅用于本次分析</li></ul></section>
  </div>
}

function UploadScreen({ go, back }: { go: (p: Page) => void; back: () => void }) {
  return <div className="screen"><TopBar title="上传照片" back={back} />
    <div className="page-pad upload"><h2>请上传清晰正面照</h2><p>确保人脸清晰可见，获得更准确的分析结果</p>
      <div className="scan-photo"><Portrait /><span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" /><span className="face-guide" /></div>
      <div className="tips-row"><span>◉<small>不佩戴眼镜</small></span><span>☻<small>保持自然表情</small></span><span>♙<small>避免头发遮挡</small></span><span>☼<small>光线均匀明亮</small></span></div>
      <div className="example-card"><b><Check /> 正确示例</b><div>{[1,2,3,4].map(i => <Portrait key={i} />)}</div></div>
      <div className="sticky-actions"><button className="text-link" onClick={() => go('privacy')}><ShieldCheck /> 查看拍照说明与隐私保护</button><PrimaryButton onClick={() => go('analyzing')}>开始分析</PrimaryButton></div>
    </div>
  </div>
}

function PrivacyScreen({ go, back }: { go: (p: Page) => void; back: () => void }) {
  return <div className="screen"><TopBar title="拍照说明" back={back} /><div className="page-pad privacy">
    <div className="privacy-hero"><ShieldCheck /><h2>我们将保护你的隐私</h2><p>为保障分析效果，需访问以下权限</p></div>
    <div className="list-card">{[
      [<Camera />, '仅用于本次分析', '照片仅用于脸型分析与镜框推荐，分析完成后不会用于其他用途。'],
      [<Clock3 />, '照片默认不公开', '记录仅保存在你的设备，可随时查看或删除。'],
      [<Trash2 />, '可随时删除记录', '你可以在「我的」中管理全部分析记录。'],
    ].map(([icon,title,desc],i) => <div className="info-row" key={i}><span>{icon}</span><div><b>{title}</b><p>{desc}</p></div></div>)}</div>
    <div className="sticky-actions"><PrimaryButton onClick={() => go('analyzing')}><Camera /> 允许访问相机</PrimaryButton><PrimaryButton secondary onClick={() => go('analyzing')}><ImageIcon /> 从相册选择</PrimaryButton><button className="muted-link" onClick={back}>稍后再说</button></div>
  </div></div>
}

function AnalyzingScreen({ go, back }: { go: (p: Page) => void; back: () => void }) {
  const [progress, setProgress] = useState(28)
  useEffect(() => { const id = window.setInterval(() => setProgress(p => p >= 92 ? 92 : p + 7), 500); return () => window.clearInterval(id) }, [])
  return <div className="screen analysis"><TopBar title="AI 检测中" back={back} /><div className="analysis-body"><h1>AI 分析中</h1><p>预计需要 10–15 秒</p>
    <button className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties} onClick={() => go('report')}><span>{progress}<small>%</small></span></button>
    <div className="analysis-steps">{['识别面部关键点','分析脸型特征','计算比例与对称度','生成推荐结果'].map((s,i) => <div className={i < 1 ? 'done' : i === 1 ? 'doing' : ''} key={s}><span>{i < 1 ? <Check /> : i === 1 ? <i /> : ''}</span><b>{s}</b><small>{i < 1 ? '已完成' : i === 1 ? '进行中' : '等待中'}</small></div>)}</div>
    <button className="security-note" onClick={() => go('privacy')}><ShieldCheck /><span><b>数据安全保障</b><small>所有分析在本地加密处理，不会存储您的原始照片</small></span><ChevronRight /></button>
    <button className="skip-demo" onClick={() => go('report')}>演示模式：立即查看结果 <ArrowRight /></button>
  </div></div>
}

function ReportScreen({ go, back }: { go: (p: Page) => void; back?: () => void }) {
  return <div className="screen"><TopBar title="报告总览" back={back} /><div className="page-pad report-page">
    <div className="result-card"><Portrait /><div><small>你的脸型：</small><h1>方形脸</h1><span className="match"><Check /> 92% 匹配</span><p>下颌角较明显，线条鲜明，整体轮廓偏方正</p></div></div>
    <div className="metric-grid">{[['脸长/脸宽比','1.23 : 1','中等'],['对称度','高','89%'],['颧骨','中等','较突出'],['下颌线','强','明显'],['额头宽度','中等','适中'],['下巴形状','方形','明显']].map(([a,b,c]) => <div key={a}><small>{a}</small><b>{b}</b><span>{c}</span></div>)}</div>
    <button className="summary-card" onClick={() => go('detail')}><Sparkles /><span><b>综合评估：方形脸</b><small>你的面部骨骼结构特征与方形脸高度匹配</small></span><ChevronRight /></button>
    <div className="quick-nav"><button onClick={() => go('detail')}><Maximize2 />总览</button><button onClick={() => go('frames')}><Glasses />推荐</button><button onClick={() => go('size')}><Ruler />尺寸</button><button onClick={() => go('style')}><Wand2 />风格</button></div>
    <PrimaryButton onClick={() => go('frames')}>查看镜框推荐</PrimaryButton><p className="legal"><LockKeyhole /> 结果仅供参考，不作为医疗诊断依据</p>
  </div></div>
}

function DetailScreen({ go, back }: { go: (p: Page) => void; back: () => void }) {
  return <div className="screen"><TopBar title="报告详情" back={back} /><div className="subtabs"><button className="active">总览</button><button>脸型分析</button><button onClick={() => go('frames')}>推荐</button><button onClick={() => go('size')}>尺寸</button></div><div className="page-pad detail-page">
    <h3>脸型概览</h3><p>基于面部关键点与比例分析得出的结果</p><div className="face-map"><div className="head-outline"><span /><i /><b /></div><ul><li>脸长</li><li>脸宽</li><li>颧骨宽度</li><li>下颌线</li></ul></div>
    <h3>分析解读</h3><div className="summary-card"><Sparkles /><span><b>你的下颌线较明显，整体轮廓偏利落</b><small>适合通过圆润镜框增加平衡感。</small></span></div>
    <div className="list-card compact">{[['脸型特征','额头与下颌宽度相近，下颌角较明显'],['比例分析','脸长 / 脸宽比为 1.23 : 1'],['风格建议','推荐圆形、椭圆形或飞行员款镜框']].map(([a,b]) => <div className="info-row" key={a}><span><Check /></span><div><b>{a}</b><p>{b}</p></div></div>)}</div>
    <PrimaryButton onClick={() => go('frames')}>查看镜框推荐</PrimaryButton>
  </div></div>
}

function FrameRecommendations({ go, back }: { go: (p: Page) => void; back: () => void }) {
  return <div className="screen"><TopBar title="镜框推荐" back={back} /><div className="segmented"><button className="active">推荐镜框</button><button>避免镜框</button></div><div className="page-pad frames-page"><SectionTitle title="为你推荐 TOP 3" />
    {frames.slice(0,3).map((f,i) => <button className="frame-row" key={f.name} onClick={() => go('tryon-detail')}><div className={`frame-icon ${f.kind}`}><GlassOverlay kind={f.kind} /></div><div><b>{f.zh}</b><small>{i === 0 ? '柔和轮廓，平衡脸部线条' : i === 1 ? '轻盈百搭，提升气质' : '经典利落，增强立体感'}</small><span>{f.score}% 适合度</span></div><ChevronRight /></button>)}
    <SectionTitle title="尽量避免" /><div className="avoid-grid"><div><GlassOverlay kind="tiny" /><b>窄矩形框</b><span>28% 适合度</span></div><div><GlassOverlay kind="tiny-round" /><b>小圆框</b><span>31% 适合度</span></div></div>
    <PrimaryButton onClick={() => go('size')}>查看尺寸建议</PrimaryButton>
  </div></div>
}

function SizeScreen({ go, back }: { go: (p: Page) => void; back: () => void }) {
  return <div className="screen"><TopBar title="尺寸建议" back={back} /><div className="page-pad size-page"><p>基于你的脸型，推荐以下镜框尺寸</p><div className="measure-card"><div className="head-outline"><span /><i /><b /></div><div>{[['镜框总宽','138 – 142 mm'],['镜片宽度','52 – 54 mm'],['鼻梁宽度','18 – 20 mm'],['镜腿长度','145 – 150 mm']].map(([a,b]) => <p key={a}><small>{a}</small><b>{b}</b></p>)}</div></div>
    <div className="advice-card"><b><ShieldCheck /> 佩戴建议</b><ul className="check-list"><li><Check />镜框宽度应与脸宽接近，避免过宽或过窄</li><li><Check />镜片高度建议大于 38mm，避免遮挡眉毛</li><li><Check />鼻梁宽度匹配鼻梁，佩戴更稳固舒适</li><li><Check />镜腿长度适中，避免压迫耳后</li></ul></div>
    <PrimaryButton onClick={() => go('unlock')}>去试戴</PrimaryButton><p className="legal">以上尺寸为推荐范围，具体以试戴效果为准</p></div></div>
}

function UnlockScreen({ go, back }: { go: (p: Page) => void; back: () => void }) {
  const features = [['基础脸型分析','✓','✓'],['完整脸型报告','–','✓'],['个性化风格指南','–','✓'],['更多镜框推荐','限 TOP 3','✓'],['AI 虚拟试戴','–','✓'],['历史记录保存','最近 1 次','无限次']]
  return <div className="screen unlock"><TopBar title="解锁完整体验" back={back} /><div className="unlock-head"><Sparkles /><h2>获取完整分析报告</h2><p>AI 虚拟试戴与更多个性推荐</p></div><div className="page-pad"><div className="price-table"><div className="table-head"><b>功能权益</b><span>基础报告<small>免费</small></span><span>完整体验<small>PRO</small></span></div>{features.map(r => <div key={r[0]}><b>{r[0]}</b><span>{r[1]}</span><span>{r[2]}</span></div>)}</div>
    <div className="price-card"><small>限时特惠价</small><strong>¥ <b>19.9</b></strong><del>¥39.9</del><PrimaryButton onClick={() => go('style')}>立即解锁</PrimaryButton><PrimaryButton secondary onClick={() => go('report')}>先看基础报告</PrimaryButton></div><p className="legal"><ShieldCheck /> 安全支付保障 · 随时可查阅历史报告</p></div></div>
}

function StyleScreen({ go, back }: { go: (p: Page) => void; back: () => void }) {
  return <div className="screen"><TopBar title="风格指南" back={back} /><div className="page-pad style-page"><div className="pro-badge"><ShieldCheck /> 报告已解锁 <span>PRO</span></div><h3><Sparkles /> 为你量身定制的风格建议</h3><ol className="style-list"><li><b>平衡视角</b><span>选择圆润柔和边角的镜框，柔化面部棱角。</span></li><li><b>适中尺寸</b><span>中等宽度镜框更能平衡你的脸部比例。</span></li><li><b>突出眉眼</b><span>上方更重的框型能提升眉眼存在感。</span></li><li><b>材质推荐</b><span>推荐板材或混合材质，增加面部层次感。</span></li></ol><SectionTitle title="推荐镜框风格" /><div className="style-chips">{frames.map(f => <button key={f.name}><GlassOverlay kind={f.kind}/><span>{f.zh}</span></button>)}</div><SectionTitle title="风格预览（推荐示例）" /><button className="style-preview" onClick={() => go('tryon')}><Portrait glasses="square" /><div><b>眉线框 · 黑色</b><p>✓ 柔化脸部棱角</p><p>✓ 提升专业气质</p><p>✓ 百搭日常场景</p></div></button><PrimaryButton onClick={() => go('tryon')}>查看试戴推荐</PrimaryButton></div></div>
}

function TryOnScreen({ go, back }: { go: (p: Page) => void; back: () => void }) {
  return <div className="screen"><TopBar title="试戴推荐" back={back} /><div className="page-pad tryon-page"><span className="eyebrow"><ShieldCheck /> PRO 已解锁</span><h2>Try On Your Top Picks</h2><p>基于你的脸型与风格，精选最适合你的镜框</p><div className="tryon-grid">{frames.map(f => <button key={f.name} onClick={() => go('tryon-detail')}><Portrait glasses={f.kind}/><Heart /><b>{f.name}</b><span>{f.score}% 匹配</span></button>)}</div><div className="summary-card"><Glasses /><span><b>已为你匹配 4 款最佳镜框</b><small>去试戴看看更多效果</small></span></div><PrimaryButton onClick={() => go('tryon-detail')}>去试戴</PrimaryButton><button className="text-link">查看更多镜框 <ArrowRight /></button></div></div>
}

function TryOnDetail({ go, back }: { go: (p: Page) => void; back: () => void }) {
  return <div className="screen"><TopBar title="试戴详情" back={back} /><div className="page-pad tryon-detail"><div className="large-tryon"><Portrait glasses="round"/><button><Heart /></button><span>1 / 4</span></div><div className="item-heading"><div><h2>Round</h2><div className="tags"><span>通勤</span><span>显精神</span><span>百搭</span></div></div><b>92% 匹配</b></div><div className="ai-card"><b><Sparkles /> AI 分析</b><p>圆框柔和了面部轮廓，提升亲和力，适合日常通勤与休闲场景。</p>{[['脸型匹配','92%'],['比例协调','90%'],['风格契合','90%'],['整体评分','92%']].map(([a,b]) => <div key={a}><span>{a}</span><i><em style={{width:b}} /></i><b>{b}</b></div>)}</div><div className="action-row"><button><Heart /> 收藏</button><button onClick={() => go('share-preview')}><Share2 /> 分享</button><PrimaryButton onClick={() => go('tryon')}>再试一款</PrimaryButton></div></div></div>
}

function SharePreview({ go, back }: { go: (p: Page) => void; back: () => void }) {
  return <div className="screen"><TopBar title="分享预览" back={back} /><div className="page-pad share-preview"><div className="poster"><Logo /><small>AI 智能试戴</small><h1>帮我选一副<br />更适合我的眼镜</h1><p>点击进入为我点赞 👇</p><Portrait glasses="round"/><div><Glasses /><span><b>Round</b><small>92% 匹配</small></span><div className="qr">◫</div></div></div><p>长按保存或分享至微信</p><PrimaryButton onClick={() => go('share')}><Share2 /> 立即分享</PrimaryButton><button className="text-link">更换分享文案或样式 <ArrowRight /></button></div></div>
}

function ShareSheet({ go, back }: { go: (p: Page) => void; back: () => void }) {
  return <div className="screen"><TopBar title="分享" back={back} /><div className="page-pad"><div className="share-item"><Portrait /><div><b>Round</b><span>92% 匹配</span><small>通勤 · 显精神 · 百搭</small></div></div><SectionTitle title="选择分享方式" /><div className="share-options">{[[<MessageCircle/>,'分享给微信好友','推荐给好友，帮我选一选'],[<Users/>,'分享到群聊','发给家人/朋友一起讨论'],[<ImageIcon/>,'生成海报','生成精美海报，保存或分享'],[<Link2/>,'复制链接','复制小程序链接到任意平台']].map(([i,a,b]) => <button key={String(a)} onClick={() => go('social')}><span>{i}</span><div><b>{a}</b><small>{b}</small></div><ChevronRight /></button>)}</div><div className="privacy-note"><LockKeyhole /><div><b>隐私说明</b><p>分享内容仅包含试戴结果，不包含上传照片，保护你的隐私安全。</p></div></div><div className="success-note"><Check /> 已生成分享卡片 🎉</div></div></div>
}

function SocialLanding({ go, back }: { go: (p: Page) => void; back: () => void }) {
  return <div className="screen"><TopBar title="" back={back} /><div className="page-pad social"><h1>帮 TA 选一副更适合的眼镜</h1><div className="social-user"><Portrait/><div><b>VisuTry 用户 邀请你帮忙点赞</b><small>我试了几款，你觉得哪副更适合我？</small></div></div><div className="social-grid">{frames.map((f,i) => <button key={f.name} onClick={() => go('liked')}><span className="rank">{i+1}</span><Portrait glasses={f.kind}/><b>{f.name}</b><span><Heart/> 为这款点赞</span></button>)}</div><p className="legal"><LockKeyhole/> 你的选择仅对发起人可见</p><Logo /></div></div>
}

function LikedScreen({ go, back }: { go: (p: Page) => void; back: () => void }) {
  return <div className="screen"><TopBar title="点赞成功" back={back} /><div className="page-pad liked"><div className="success-orb"><Check /></div><h1>已为 <span>Wayfarer</span> 点赞</h1><p>感谢你的帮助，让我们一起帮 TA 选出最适合的眼镜！</p><div className="participant-card"><b>当前 12 位好友已参与</b><div className="avatars">{[1,2,3,4,5,6].map(i => <Portrait key={i}/>)}<span>+8</span></div></div><div className="choice-note"><Check/><span><b>你的选择已记录</b><small>可随时查看实时结果</small></span></div><PrimaryButton onClick={() => go('feedback')}>继续看看其他款</PrimaryButton><PrimaryButton secondary onClick={() => go('social')}>把链接转发给朋友</PrimaryButton><Logo /></div></div>
}

function FeedbackScreen({ go, back }: { go: (p: Page) => void; back: () => void }) {
  return <div className="screen"><TopBar title="点赞总览" back={back} /><div className="page-pad feedback"><div className="pro-badge"><Heart /> 社交反馈总览 <span>PRO</span></div><p>数据基于 4 款试戴效果的好友反馈</p>{frames.map((f,i) => <button key={f.name} className="ranking" onClick={() => go('decision')}><span className={`medal m${i+1}`}>{i+1}</span><Portrait glasses={f.kind}/><div><b>{f.name}</b><strong><Heart/> {[128,86,44,26][i]} <small>赞</small></strong><span>匹配度 {f.score}%</span><i><em style={{width:`${f.score}%`}} /></i></div></button>)}<button className="all-feedback" onClick={() => go('messages')}>查看所有好友参与情况 <ChevronRight/></button><div className="stats"><span><b>38</b><small>参与好友</small></span><span><b>284</b><small>总点赞数</small></span><span><b>12</b><small>评论数</small></span></div></div></div>
}

function MessagesScreen({ go, back }: { go: (p: Page) => void; back: () => void }) {
  const people = ['Lina','Mike','Emma','Jason','Tina']
  return <div className="screen"><TopBar title="消息" back={back} /><div className="page-pad messages"><div className="message-tabs"><button><Heart/><b>16</b><span>点赞</span></button><button><Share2/><b>5</b><span>分享</span></button><button><Users/><b>3</b><span>参与</span></button></div><SectionTitle title="最新动态" />{people.map((p,i) => <button className="notice" key={p} onClick={() => go('decision')}><span className="avatar-letter">{p[0]}</span><div><b>{p} {i%2 ? '转发了你的试戴链接' : '为 Round 点赞'}</b><small>{i+2} 分钟前</small></div><span>{i%2 ? <Share2/> : <Heart/>}</span></button>)}<SectionTitle title="更早的动态" /><button className="all-feedback" onClick={() => go('decision')}>查看全部消息 <ChevronRight/></button></div></div>
}

function DecisionScreen({ go, back }: { go: (p: Page) => void; back: () => void }) {
  return <div className="screen decision"><TopBar title="大家最推荐你佩戴 Wayfarer" back={back}/><div className="page-pad"><div className="confetti">✦　·　✦　·　✦</div><div className="winner"><span>你的最佳选择</span><Portrait glasses="square"/><small>Wayfarer</small><Heart /></div><div className="winner-stats"><span>总点赞数<b>128</b></span><span>匹配度<b>92%</b></span></div><div className="rank-one">🏆 在 4 款试戴中排名第 1</div><div className="advice-card"><b>好友推荐理由</b><ul className="check-list"><li><Check/>大多数好友认为最适合你的脸型</li><li><Check/>显脸小、气质提升、百搭好看</li><li><Check/>通勤与日常场景都很合适</li></ul></div><PrimaryButton onClick={() => go('tryon')}>继续试戴更多风格</PrimaryButton><PrimaryButton secondary>保存结果到我的报告</PrimaryButton><div className="split-actions"><button onClick={() => go('tryon-detail')}><Link2/> 查看镜框详情</button><button><LockKeyhole/> 去购买同款</button></div></div></div>
}

function ReportsScreen({ go }: { go: (p: Page) => void }) {
  return <div className="screen tab-screen"><TopBar title="报告"/><div className="page-pad reports-list"><div className="search-row"><label><Search/><input placeholder="搜索报告"/></label><button>筛选</button></div><div className="filter-chips"><button className="active">全部</button><button>方形脸</button><button>圆形脸</button><button>椭圆形脸</button></div>{['方形脸','圆形脸','椭圆形脸','心形脸'].map((name,i)=><div className="history-row" key={name}><Portrait/><div><b>{name}</b><small>2026-06-{29-i*3} 14:32</small></div><span>{92-i*2}% 匹配</span><button onClick={() => go('report')}>查看详情</button><button onClick={() => go('analyzing')}>再次分析</button></div>)}</div></div>
}

function ProfileScreen({ go }: { go: (p: Page) => void }) {
  return <div className="screen tab-screen"><TopBar title="我的"/><div className="page-pad profile-page"><div className="profile-card"><Portrait/><div><h2>VisuTry 用户</h2><span>微信号：visutry_user</span></div><ChevronRight/></div><button className="unlock-banner" onClick={() => go('unlock')}><Sparkles/><span><b>解锁完整报告 & 试戴功能</b><small>享受更多镜框推荐与风格建议</small></span><b>立即解锁</b></button><div className="menu-card">{[[<FileText/>,'我的报告','report'],[<Heart/>,'我的收藏','frames'],[<Settings/>,'设置','settings'],[<HelpCircle/>,'帮助与反馈','settings'],[<UserRound/>,'关于我们','settings']].map(([icon,label,target])=><button key={String(label)} onClick={() => go(target as Page)}><span>{icon}</span><b>{label}</b><ChevronRight/></button>)}</div></div></div>
}

function SettingsScreen({ back }: { back: () => void }) {
  return <div className="screen"><TopBar title="设置与帮助" back={back}/><div className="page-pad settings-page"><SectionTitle title="账号与隐私"/><div className="menu-card"><button><UserRound/><b>账号与绑定</b><ChevronRight/></button><button><ShieldCheck/><span><b>隐私与数据</b><small>照片仅用于分析，可随时删除</small></span><ChevronRight/></button></div><SectionTitle title="检测记录管理"/><div className="menu-card"><button><FileText/><b>检测记录</b><ChevronRight/></button><button><Trash2/><b>清空全部记录</b><ChevronRight/></button></div><SectionTitle title="通知设置"/><div className="menu-card"><button><Bell/><b>消息通知</b><span className="switch on"/></button></div><SectionTitle title="帮助与支持"/><div className="menu-card"><button><HelpCircle/><b>常见问题</b><ChevronRight/></button><button><MessageCircle/><span><b>联系我们</b><small>工作时间：9:00 – 18:00</small></span><ChevronRight/></button></div><p className="version">当前版本 1.2.0<br/><span>《用户协议》　|　《隐私政策》</span></p></div></div>
}

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [stack, setStack] = useState<Page[]>([])
  const page = stack[stack.length - 1]
  const go = (next: Page) => { setStack(s => [...s, next]); window.scrollTo(0,0) }
  const back = () => { setStack(s => s.slice(0,-1)); window.scrollTo(0,0) }
  const onTab = (next: Tab) => { setTab(next); setStack([]); window.scrollTo(0,0) }
  const content = useMemo(() => {
    if (!page) return tab === 'home' ? <HomeScreen go={go}/> : tab === 'reports' ? <ReportsScreen go={go}/> : <ProfileScreen go={go}/>
    const props = { go, back }
    switch(page) {
      case 'upload': return <UploadScreen {...props}/>
      case 'privacy': return <PrivacyScreen {...props}/>
      case 'analyzing': return <AnalyzingScreen {...props}/>
      case 'report': return <ReportScreen {...props}/>
      case 'detail': return <DetailScreen {...props}/>
      case 'frames': return <FrameRecommendations {...props}/>
      case 'size': return <SizeScreen {...props}/>
      case 'unlock': return <UnlockScreen {...props}/>
      case 'style': return <StyleScreen {...props}/>
      case 'tryon': return <TryOnScreen {...props}/>
      case 'tryon-detail': return <TryOnDetail {...props}/>
      case 'share-preview': return <SharePreview {...props}/>
      case 'share': return <ShareSheet {...props}/>
      case 'social': return <SocialLanding {...props}/>
      case 'liked': return <LikedScreen {...props}/>
      case 'feedback': return <FeedbackScreen {...props}/>
      case 'messages': return <MessagesScreen {...props}/>
      case 'decision': return <DecisionScreen {...props}/>
      case 'settings': return <SettingsScreen back={back}/>
    }
  }, [page, tab])
  return <main className="app-shell"><div className="device-frame">{content}{!page && <BottomNav tab={tab} onTab={onTab}/>}</div></main>
}
