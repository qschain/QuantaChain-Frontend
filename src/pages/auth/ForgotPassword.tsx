import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/auth.css';

export default function ForgotPassword() {
    const { t } = useTranslation('auth');

    // 进入/离开时切换 auth-page 类，用于隐藏全局 footbar/返回按钮
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('auth-page');
        return () => root.classList.remove('auth-page');
    }, []);

    const [account, setAccount] = useState('');
    const [code, setCode] = useState('');
    const [pwd1, setPwd1] = useState('');
    const [pwd2, setPwd2] = useState('');
    const [sending, setSending] = useState(false);
    const [sec, setSec] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    // 简易倒计时
    useEffect(() => {
        if (sec <= 0) return;
        const tmr = setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000);
        return () => clearInterval(tmr);
    }, [sec]);

    const sendCode = async () => {
        if (!account) {
            setMsg(
                t('forgot.tips.missingAccount', {
                    defaultValue: '请输入账户邮箱或手机号',
                })
            );
            return;
        }
        setMsg(null);
        setSending(true);
        try {
            // TODO: 调用后端发送验证码接口
            await new Promise((res) => setTimeout(res, 600));
            setSec(60);
        } finally {
            setSending(false);
        }
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);

        if (!account || !code || !pwd1 || !pwd2) {
            setMsg(
                t('forgot.tips.fillAll', {
                    defaultValue: '请完整填写表单',
                })
            );
            return;
        }
        if (pwd1.length < 8 || !/\d/.test(pwd1) || !/[A-Za-z]/.test(pwd1)) {
            setMsg(
                t('forgot.tips.pwdWeak', {
                    defaultValue: '新密码需至少8位且包含字母和数字',
                })
            );
            return;
        }
        if (pwd1 !== pwd2) {
            setMsg(
                t('forgot.tips.pwdMismatch', {
                    defaultValue: '两次输入的密码不一致',
                })
            );
            return;
        }

        setSubmitting(true);
        try {
            // TODO: 调用后端重置密码接口
            await new Promise((res) => setTimeout(res, 800));
            setMsg(
                t('forgot.tips.resetOk', {
                    defaultValue: '重置成功，请返回登录',
                })
            );
        } catch (e: any) {
            setMsg(
                e?.message ||
                t('forgot.tips.resetFail', { defaultValue: '重置失败，请稍后再试' })
            );
        } finally {
            setSubmitting(false);
        }
    };

    // 计算发送按钮文案
    const sendBtnText = sec > 0
        ? t('forgot.actions.resendIn', { sec, defaultValue: `重新发送 ${sec}s` })
        : (sending
            ? t('forgot.actions.sending', { defaultValue: '发送中…' })
            : t('forgot.actions.sendCode', { defaultValue: '发送验证码' }));

    return (
        <div className="auth-root auth-page">
            <div className="auth-card" role="region" aria-labelledby="fp-title">
                <div className="auth-head">
                    <div className="logo" aria-hidden>🔑</div>
                    <div className="titles">
                        <h2 id="fp-title" className="title">
                            {t('forgot.title', { defaultValue: '忘记密码' })}
                        </h2>
                        <p className="subtitle">
                            {t('forgot.subtitle', {
                                defaultValue: '输入账户邮箱或手机号，我们将发送验证码验证您的身份。',
                            })}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="form" noValidate>
                    {msg && <div className="alert" role="alert">{msg}</div>}

                    <div className="field">
                        <label className="bilabel" htmlFor="fp-account">
              <span className="zh">
                {t('forgot.fields.account', { defaultValue: '账户' })}
              </span>
                        </label>
                        <input
                            id="fp-account"
                            className="input"
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            placeholder={t('forgot.placeholders.account', {
                                defaultValue: '邮箱或手机号',
                            })!}
                            autoComplete="username"
                            inputMode="email"
                        />
                    </div>

                    <div className="row" style={{ gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <label className="bilabel" htmlFor="fp-code">
                <span className="zh">
                  {t('forgot.fields.code', { defaultValue: '验证码' })}
                </span>
                            </label>
                            <input
                                id="fp-code"
                                className="input"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder={t('forgot.placeholders.code', {
                                    defaultValue: '6位验证码',
                                })!}
                                inputMode="numeric"
                            />
                        </div>
                        <button
                            type="button"
                            className="btn-ghost strong"
                            style={{ alignSelf: 'end', minWidth: 128 }}
                            onClick={sendCode}
                            disabled={sending || sec > 0}
                            aria-disabled={sending || sec > 0}
                        >
                            {sendBtnText}
                        </button>
                    </div>

                    <div className="field">
                        <label className="bilabel" htmlFor="fp-pwd1">
              <span className="zh">
                {t('forgot.fields.newPassword', { defaultValue: '设置新密码' })}
              </span>
                        </label>
                        <input
                            id="fp-pwd1"
                            className="input"
                            type="password"
                            value={pwd1}
                            onChange={(e) => setPwd1(e.target.value)}
                            placeholder={t('forgot.placeholders.newPassword', {
                                defaultValue: '至少8位，包含字母和数字',
                            })!}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="field">
                        <label className="bilabel" htmlFor="fp-pwd2">
              <span className="zh">
                {t('forgot.fields.confirmNewPassword', { defaultValue: '确认新密码' })}
              </span>
                        </label>
                        <input
                            id="fp-pwd2"
                            className="input"
                            type="password"
                            value={pwd2}
                            onChange={(e) => setPwd2(e.target.value)}
                            placeholder={t('forgot.placeholders.confirmNewPassword', {
                                defaultValue: '再次输入新密码',
                            })!}
                            autoComplete="new-password"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') submit(e as unknown as React.FormEvent);
                            }}
                        />
                    </div>

                    <button className="btn-primary" disabled={submitting}>
                        {submitting
                            ? t('forgot.actions.resetting', { defaultValue: '重置中…' })
                            : t('forgot.actions.reset', { defaultValue: '重置密码' })}
                    </button>

                    <div className="row center hint">
                        <Link to="/auth/login" className="link strong">
                            ← {t('forgot.backToLogin', { defaultValue: '返回登录' })}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
