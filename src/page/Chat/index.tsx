import { WebSocketContext } from '@/context'
import { Button, Input, message } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface IProps {
  uid: string
}
export default function Chat({ uid }: IProps) {
  const [content, setContent] = useState('')
  const { data, readyState, sendMessage } = useContext(WebSocketContext)
  const navigate = useNavigate()

  const sendContent = () => {
    if (!content.trim()) {
      message.error('消息内容不能为空')
      return
    }
    if (readyState !== 1) {
      message.error('当前与聊天服务器处于断开状态...')
      return
    }
    sendMessage(
      JSON.stringify({
        cmd: 'send',
        msgData: content,
      }),
    )
    setContent('')
  }

  useEffect(() => {
    // 判断用户是否登录
    if (uid === '') {
      alert('您还未登录，即将跳转到登录页面')
      navigate('/login')
    }
  }, [navigate, uid])

  return (
    <div>
      <h2>大厅</h2>
      <Input value={content} onChange={(e) => setContent(e.target.value)} />
      <Button onClick={sendContent}>发送消息</Button>
    </div>
  )
}
