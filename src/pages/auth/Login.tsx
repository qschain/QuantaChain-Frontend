import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '../../app/session/PlatformSessionProvider';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/auth.css';

export default function Login() {
    const { t } = useTranslation('auth'); // 使用 auth 命名空间
    const { login, authed } = useSession();
    const nav = useNavigate();
    const loc = useLocation();
    const from = (loc.state as any)?.from?.pathname || '/dashboard'; // 更稳妥用绝对路径

    const [id, setId] = useState('');
    const [pwd, setPwd] = useState('');
    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 已登录则直接跳转
    useEffect(() => {
        if (authed) {
            nav(from, { replace: true });
        }
    }, [authed, nav, from]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id || !pwd) {
            setError(
                t('login.tips.missingCreds', {
                    defaultValue: '请输入账户名和密码',
                })
            );
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await login(id, pwd);
            // 记住我（可选）：仅示例，你可自行接入真实 remember 实现
            if (remember) {
                localStorage.setItem('last_login_id', id);
            } else {
                localStorage.removeItem('last_login_id');
            }
            nav(from, { replace: true });
        } catch (err: any) {
            setError(
                err?.message ||
                t('login.tips.accessDenied', {
                    defaultValue: '登录失败，请检查账户或网络。',
                })
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-root">
            <div className="auth-stack">
            <h3 className="auth-slogan">
                {t('login.slogan', { defaultValue: '登录，创造更多可能…' })}
            </h3>
            {/* 返回首页：使用 ghost 风格，避免与主按钮抢视觉 */}
            <button
                type="button"
                className="back-home"
                onClick={() => nav('/')}
                style={{ position: 'absolute', top: '20px', left: '20px' }}
                aria-label={t('login.actions.backHome', { defaultValue: '返回首页' })}
            >
                {t('login.actions.backHome', { defaultValue: '返回首页' })}
            </button>

            <div className="auth-card">
                {/* 可选：暗角层，若你的 CSS 已包含可省略此占位 */}
                <div className="auth-vignette" aria-hidden="true" />

                <div className="auth-head">
                    <div className="logo">🔒</div>
                    <div className="titles">
                        <h2 className="title">
                            {t('login.title', { defaultValue: '登录系统' })}
                        </h2>
                        <p className="subtitle">
                            {t('login.subtitle', { defaultValue: '访问您的数字资产仪表盘' })}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="form" noValidate>
                    {error && <div className="alert">{error}</div>}

                    <div className="field">
                        <label className="bilabel" htmlFor="login-id">
              <span className="zh">
                {t('login.fields.username', { defaultValue: '账户名 / 邮箱' })}
              </span>
                        </label>
                        <input
                            id="login-id"
                            className="input"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder={t('login.fields.usernamePh', {
                                defaultValue: '请输入邮箱或用户名',
                            })}
                            autoComplete="username"
                        />
                    </div>

                    <div className="field">
                        <label className="bilabel" htmlFor="login-pwd">
              <span className="zh">
                {t('login.fields.password', { defaultValue: '密码' })}
              </span>
                        </label>
                        <input
                            id="login-pwd"
                            className="input"
                            type="password"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            placeholder={t('login.fields.passwordPh', {
                                defaultValue: '请输入密码',
                            })}
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="row between">
                        <label className="check">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            <span>{t('login.actions.remember', { defaultValue: '记住我' })}</span>
                        </label>

                        <Link to="/auth/forgot" className="link">
                            {t('login.actions.forgot', { defaultValue: '忘记密码？' })}
                        </Link>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading
                            ? t('login.actions.signingIn', { defaultValue: '登录中…' })
                            : t('login.actions.login', { defaultValue: '安全登录' })}
                    </button>

                    <div className="row center hint">
                        {t('login.tips.noAccount', { defaultValue: '还没有账户？' })}&nbsp;
                        <Link to="/auth/register" className="link strong">
                            {t('login.actions.register', { defaultValue: '立即注册' })}
                        </Link>
                    </div>

                    <div className="or">
                        <span>{t('login.actions.or', { defaultValue: '或' })}</span>
                    </div>

                    <div className="oauth">
                        <button type="button" className="btn-ghost" title="Google">
                            {t('login.actions.google', { defaultValue: '谷歌' })}
                        </button>
                        <button type="button" className="btn-ghost" title="Phone">
                            {t('login.actions.phone', { defaultValue: '手机号' })}
                        </button>
                        <button type="button" className="btn-ghost" title="WeChat">
                            {t('login.actions.wechat', { defaultValue: '微信' })}
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
}
