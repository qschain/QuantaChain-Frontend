// hooks/useTransfer.ts
import { useState } from 'react'
import { useSession } from '../../../../../../app/session/PlatformSessionProvider'
import { api } from '../shared/api/api'
import type { transferCrypto } from '../types'

type SuccessData = {
  beforeBalance: string
  laterBalance: string
  amount: string
  burn?: string
}

type FailState = { open: boolean; message: string | null }

export default function useTransfer() {
  const { user } = useSession()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)         // 表单级错误（未登录等）
  const [success, setSuccess] = useState<SuccessData | null>(null) // 成功结果（供成功弹窗）
  const [fail, setFail] = useState<FailState>({ open: false, message: null }) // ❗错误对话框状态

  /**
   * 提交转账：
   * - 成功：设置 success（由页面弹“成功结果”对话框）
   * - 失败：保留密码弹窗（页面不关），并触发 fail.open=true（页面据此叠加错误对话框）
   */
  async function handleTransfer(
    address: string,
    amount: string,
    password: string
  ): Promise<{ ok: boolean; error?: string }> {
    if (!user?.name) {
      const msg = 'Please login first'
      setError(msg)
      // 不打开错误对话框，这里是表单层错误
      return { ok: false, error: msg }
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      // 每次提交前先清空上一条错误弹层
      setFail({ open: false, message: null })

      const resp: transferCrypto = await api.transfer(
        user.name,
        password,                 // ✅ 用户输入的密码，而非 token
        address,
        Number(amount),
        { real: true }
      )

      const code = String(resp?.code ?? '')
      if (code === '200' && resp.data) {
        setSuccess({
          beforeBalance: resp.data.beforeBalance,
          laterBalance:  resp.data.laterBalance,
          amount:        resp.data.amount,
          burn:          resp.data.burn,
        })
        return { ok: true }
      } else {
         const msg = (resp.data as any)?.message || resp?.message || 'Transfer failed'
        // ❗失败：打开错误对话框
        setFail({ open: true, message: msg })
        return { ok: false, error: msg }
      }
    } catch (e: any) {
      const msg = e?.message || 'Server error'
      // ❗异常：同样打开错误对话框
      setFail({ open: true, message: msg })
      return { ok: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  // 页面关闭错误对话框时调用
  function closeFailDialog() {
    setFail({ open: false, message: null })
  }

  // （可选）关闭成功结果
  function clearSuccess() {
    setSuccess(null)
  }

  return {
    handleTransfer,
    loading,
    error,           // 表单层错误（未登录等）
    success,         // 成功结果（展示前/后余额）
    fail,            // ❗错误对话框状态 { open, message }
    closeFailDialog, // 关闭错误对话框
    clearSuccess,    // （可选）关闭成功结果
  }
}
