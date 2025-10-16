import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../app/session/PlatformSessionProvider';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/auth.css';

export default function Register() {
    const { register } = useSession();
    const navigate = useNavigate();
    const { t } = useTranslation('auth');

    // 进入/离开时切换 auth-page 类：隐藏全局 footbar/返回等
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('auth-page');
        return () => root.classList.remove('auth-page');
    }, []);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [pwd1, setPwd1] = useState('');
    const [pwd2, setPwd2] = useState('');
    const [agree, setAgree] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);

        if (!email || !username || !pwd1 || !pwd2) {
            setMsg(t('register.tips.fillAll', { defaultValue: '请完整填写表单' }));
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMsg(t('register.tips.invalidEmail', { defaultValue: '邮箱格式不正确' }));
            return;
        }
        if (pwd1.length < 8) {
            setMsg(t('register.tips.pwdTooShort', { defaultValue: '密码至少 8 位' }));
            return;
        }
        if (pwd1 !== pwd2) {
            setMsg(t('register.tips.pwdMismatch', { defaultValue: '两次输入的密码不一致' }));
            return;
        }
        if (!agree) {
            setMsg(t('register.tips.acceptTerms', { defaultValue: '请先阅读并同意条款' }));
            return;
        }

        setSubmitting(true);
        try {
            // 你的后端注册仅用 username + password
            await register(username, pwd1);
            setMsg(t('register.tips.registerOk', { defaultValue: '注册成功，请前往登录' }));
            setTimeout(() => navigate('/auth/login', { replace: true }), 1600);
        } catch (e: any) {
            setMsg(
                e?.message ||
                t('register.tips.registerFail', { defaultValue: '注册失败，请稍后再试' })
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-root auth-page">
            <div className="auth-card" role="region" aria-labelledby="reg-title">
                <div className="auth-head">
                    <div className="logo" aria-hidden>🧩</div>
                    <div className="titles">
                        <h2 id="reg-title" className="title">
                            {t('register.title', { defaultValue: '创建您的账户' })}
                        </h2>
                        <p className="subtitle">
                            {t('register.subtitle', {
                                defaultValue: '欢迎加入下一代数字资产管理平台',
                            })}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="form" noValidate>
                    {msg && <div className="alert" role="alert">{msg}</div>}

                    <div className="field">
                        <label className="bilabel" htmlFor="reg-email">
                            <span className="zh">{t('register.fields.email', { defaultValue: '电子邮件' })}</span>
                        </label>
                        <input
                            id="reg-email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('register.placeholders.email', { defaultValue: 'you@example.com' })!}
                            autoComplete="email"
                            inputMode="email"
                        />
                    </div>

                    <div className="field">
                        <label className="bilabel" htmlFor="reg-username">
                            <span className="zh">{t('register.fields.username', { defaultValue: '用户名' })}</span>
                        </label>
                        <input
                            id="reg-username"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={t('register.placeholders.username', { defaultValue: '选择一个独特的用户名' })!}
                            autoComplete="username"
                        />
                    </div>

                    <div className="field">
                        <label className="bilabel" htmlFor="reg-pwd1">
                            <span className="zh">{t('register.fields.password', { defaultValue: '密码' })}</span>
                        </label>
                        <input
                            id="reg-pwd1"
                            className="input"
                            type="password"
                            value={pwd1}
                            onChange={(e) => setPwd1(e.target.value)}
                            placeholder={t('register.placeholders.password', { defaultValue: '至少 8 位' })!}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="field">
                        <label className="bilabel" htmlFor="reg-pwd2">
                            <span className="zh">{t('register.fields.confirmPassword', { defaultValue: '确认密码' })}</span>
                        </label>
                        <input
                            id="reg-pwd2"
                            className="input"
                            type="password"
                            value={pwd2}
                            onChange={(e) => setPwd2(e.target.value)}
                            placeholder={t('register.placeholders.confirmPassword', { defaultValue: '再次输入' })!}
                            autoComplete="new-password"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') submit(e as unknown as React.FormEvent);
                            }}
                        />
                    </div>

                    <label className="row" style={{ gap: 8 }}>
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                            aria-checked={agree}
                        />
                        <span>
              {t('register.legal.consent', { defaultValue: '我已阅读并同意《条款》和《隐私政策》' })}
            </span>
                    </label>

                    <button className="btn-primary" disabled={submitting}>
                        {submitting
                            ? t('register.actions.registering', { defaultValue: '注册中…' })
                            : t('register.actions.signup', { defaultValue: '注册' })}
                    </button>

                    <div className="row center hint">
            <span className="secondary">
              {t('register.tips.hasAccount', { defaultValue: '已有账号？' })}{' '}
                <Link to="/auth/login" className="link strong">
                {t('register.actions.signin', { defaultValue: '立即登录' })}
              </Link>
            </span>
                    </div>
                </form>
            </div>
        </div>
    );
}
