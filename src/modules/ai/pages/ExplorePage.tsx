import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import '../styles/ai-explore.css'; // 下面会加样式

type Role = 'user' | 'assistant';
type MsgStatus = 'done' | 'streaming' | 'error' | 'thinking';

type ChatMsg = { id: string; role: Role; content: string; status: MsgStatus };

export default function ExplorePage() {
    const { t } = useTranslation('ai');
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [input, setInput]   = useState('');
    const [loading, setLoading] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);
    const hasText = input.trim().length > 0;
    // 自动滚动
    useEffect(() => {
        if (!listRef.current) return;
        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages.length]);

    const send = async () => {
        if (!input.trim() || loading) return;
        const uid = crypto.randomUUID();
        const aid = crypto.randomUUID();

        setMessages(prev => [
            ...prev,
            { id: uid, role: 'user', content: input.trim(), status: 'done' },
            { id: aid, role: 'assistant', content: '', status: 'thinking' }
        ]);
        setInput('');
        setLoading(true);

        // 这里先用假流，等你给 API 我把流接上
        for (const chunk of ['正在思考', '，请稍候', '……\n\n', '支持 **Markdown**、`code`、列表等。']) {
            await new Promise(r => setTimeout(r, 260));
            setMessages(prev => prev.map(m => m.id === aid
                ? { ...m, status: 'streaming', content: (m.content + chunk) }
                : m));
        }
        setMessages(prev => prev.map(m => m.id === aid ? ({ ...m, status: 'done' }) : m));
        setLoading(false);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    };

    const EmptyHero = (
        <section className="ai-hero">
            <h1 className="ai-hero-title">{t('hero.title') || '今天有什么计划？'}</h1>

            <div className="ai-hero-input">
                <AttachmentMenu />
                <input
                    className="ai-hero-input__field"
                    placeholder={t('placeholder.message') || '询问任何问题'}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') send(); }}
                />
                <button className="ai-hero-icon" aria-label="语音输入" title="语音输入（占位）">
                    <MicIcon />
                </button>
                <button
                    className={`ai-hero-send ${hasText ? 'active' : ''}`}
                    aria-label={hasText ? '发送' : '发送（不可用）'}
                    title="发送"
                    onClick={hasText ? send : undefined}
                    disabled={!hasText || loading}
                >
                    {/* 两个图标叠放，用 CSS 切换可见性 */}
                    <span className="ic ic-arrow"><ArrowUpIcon /></span>
                    <span className="ic ic-wave"><WaveIcon /></span>
                </button>
            </div>

            {/* 快捷建议：可选 */}
            <div className="ai-hero-suggest">
                <button className="ai-chip" onClick={()=>setInput('帮我写一个周计划')}>周计划</button>
                <button className="ai-chip" onClick={()=>setInput('解释一下DV01并给例子')}>解释DV01</button>
                <button className="ai-chip" onClick={()=>setInput('把这段文字改得更专业')}>润色文字</button>
            </div>
        </section>
    );

    const ChatUI = (
        <section className="ai-panel" style={{ padding: 0 }}>
            <div className="ai-chat-list" ref={listRef}>
                {messages.map(m => (
                    <div key={m.id} className={`ai-chat-row ${m.role==='user'?'right':''}`}>
                        <div className={`ai-bubble ${m.role==='user'?'ai-bubble-user':'ai-bubble-assistant'}`}>
                            {m.status === 'thinking'
                                ? <Thinking />
                                :
                                <div className="ai-md">
                                    <ReactMarkdown>{m.content}</ReactMarkdown>
                                </div>
                            }
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="ai-chat-row">
                        <div className="ai-bubble ai-bubble-assistant"><Thinking /></div>
                    </div>
                )}
            </div>

            <div className="ai-chat-input-wrap">
                <div className="ai-row ai-gap-8 ai-align-center">
                    <AttachmentMenu compact />
                    <textarea
                        className="ai-input ai-chat-input"
                        placeholder={t('placeholder.message') || '随便问点什么…（Shift+Enter 换行）'}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        rows={3}
                    />
                    <button
                        className={`ai-send ${hasText ? 'active' : ''}`}
                        onClick={send}
                        disabled={!hasText || loading}
                    >
                        <span className="ic ic-arrow"><ArrowUpIcon /></span>
                        <span className="ic ic-wave"><WaveIcon /></span>
                    </button>
                </div>
            </div>
        </section>
    );

    return (
        <div className="ai-col ai-gap-16">
            {messages.length === 0 ? EmptyHero : ChatUI}
        </div>
    );
}

/* ---------- 附件/功能菜单 ---------- */
function AttachmentMenu({ compact = false }: { compact?: boolean }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="ai-attach" onBlur={(e)=>{ if(!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}>
            <button
                className="ai-attach-btn"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={()=>setOpen(v=>!v)}
            >
                +
            </button>
            {open && (
                <div className={`ai-attach-menu ${compact ? 'compact' : ''}`} role="menu">
                    <MenuItem icon={<PaperclipIcon />} text="添加照片和文件" />
                    <MenuItem icon={<DriveIcon />} text="从 Google Drive 添加" />
                    <hr />
                    <MenuItem icon={<ResearchIcon />} text="深度研究" />
                    <MenuItem icon={<ImageIcon />} text="创建图片" />
                    <MenuItem icon={<AgentIcon />} text="代理模式" />
                    <MenuItem icon={<ReasonIcon />} text="使用推理器" />
                    <MenuItem icon={<MoreIcon />} text="更多" trailing="›" />
                </div>
            )}
        </div>
    );
}
function MenuItem({ icon, text, trailing }: { icon: React.ReactNode; text: string; trailing?: React.ReactNode }) {
    return (
        <button className="ai-attach-item" role="menuitem">
            <span className="ai-attach-ic">{icon}</span>
            <span className="ai-attach-txt">{text}</span>
            {trailing && <span className="ai-attach-tail">{trailing}</span>}
        </button>
    );
}

/* ---------- Thinking 动效 ---------- */
function Thinking() {
    return (
        <div className="ai-thinking">
            <span className="ai-dots">•••</span>
            <span className="ai-line" />
        </div>
    );
}

/* ---------- 简单图标（currentColor） ---------- */
function MicIcon(){return(<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>)}
function WaveIcon(){return(<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12h2l1 4 2-8 2 12 2-8 2 4 1-6 2 10h2"/></svg>)}
function PaperclipIcon(){return(<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M16.5 6.5 7.6 15.4a4 4 0 1 0 5.7 5.6l8.2-8.2a6 6 0 0 0-8.5-8.5L4.7 8.1"/></svg>)}
function DriveIcon(){return(<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 4h5l5 8-5 8H7L2 12z"/><path d="M7 4l10 16"/></svg>)}
function ResearchIcon(){return(<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="6"/><path d="m20 20-3-3"/></svg>)}
function ImageIcon(){return(<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m8 13 2-2 3 3 3-3 3 3"/></svg>)}
function AgentIcon(){return(<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="7" r="3"/><path d="M5 21a7 7 0 0 1 14 0"/><path d="M15 12h4l1 3"/></svg>)}
function ReasonIcon(){return(<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3v4"/><path d="M5 12h4"/><path d="M12 17v4"/><path d="M15 12h4"/><circle cx="12" cy="12" r="3"/></svg>)}
function MoreIcon(){return(<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>)}
function ArrowUpIcon(){
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14" />
            <path d="M5 12l7-7 7 7" />
        </svg>
    );
}