import { WebSocketContext } from '@/context'
import { setDataDao } from '@/utils/localStorage'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface IProps {
  setUid: (uid: string) => void
}
export default function Login({ setUid }: IProps) {
  const [nickname, setNickname] = useState('')
  const { data, sendMessage } = useContext(WebSocketContext)
  const navigate = useNavigate()

  const submitLogin = () => {
    if (nickname.trim() === '') {
      alert('输入昵称不能为空')
      return
    }
    sendMessage(
      JSON.stringify({
        cmd: 'connect',
        nickname: nickname.trim(),
      }),
    )
  }

  useEffect(() => {
    if (data.cmd === 'connect' && data.id) {
      // console.log('get id: ', data.id)
      setUid(data.id || '')
      // 将用户id持久化到本地
      setDataDao('uid', data.id)
      // 将用户昵称持久化到本地
      setDataDao('nickname', data.nickname || '')
      //   alert('即将跳转到聊天页面')
      navigate('/')
    }
  }, [data, navigate, setUid])

  return (
    <div style={{ padding: '50px' }}>
      <div style={{ fontWeight: 'bold', fontSize: '25px' }}>请输入你的名字</div>
      <div style={{ marginTop: '20px' }}>
        <input type="text" onChange={(e) => setNickname(e.target.value)} />
        <button style={{ marginLeft: '5px' }} onClick={submitLogin}>
          登录
        </button>
      </div>
    </div>
  )
}
