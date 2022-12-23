import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Chat from './page/Chat'
import { WebSocketContext } from './context'
import WuziChess from './page/WuziChess'
import useWebsocket from './utils/hooks/useWebsocket'
import { getDataDao } from './utils/localStorage'
import Login from './page/Login'
import { message } from 'antd'

const url = 'ws://192.168.1.6:3000'
export default function App() {
  const [uid, setUid] = useState(getDataDao('uid'))

  const {
    data: wsData,
    readyState,
    sendMessage,
    reconnect,
    closeWebsocket,
  } = useWebsocket({ url })

  useEffect(() => {
    if (readyState === 3) {
      reconnect()
    }
  }, [readyState, reconnect])

  useEffect(() => {
    // 根据昵称重新连接
    const _uid = getDataDao('uid')
    if (_uid && readyState === 1) {
      console.log('根据昵称重新连接...')
      sendMessage(
        JSON.stringify({
          cmd: 'connect',
          nickname: getDataDao('nickname'),
        }),
      )
    }
    if (readyState === 0) {
      message.info('尝试连接中...', 1)
    }
  }, [readyState, sendMessage])

  window.addEventListener('offline', () => {
    // 断网时尝试重连ws
    reconnect()
  })

  window.addEventListener('online', () => {
    if (readyState !== 1) {
      reconnect()
    }
  })

  return (
    <BrowserRouter>
      <WebSocketContext.Provider
        value={{
          data: wsData,
          readyState,
          sendMessage,
          reconnect,
          closeWebsocket,
        }}>
        <Routes>
          <Route path="/" element={<WuziChess />}></Route>
          <Route path="/chat" element={<Chat uid={uid} />} />
          <Route path="/login" element={<Login setUid={setUid} />} />
        </Routes>
      </WebSocketContext.Provider>
    </BrowserRouter>
  )
}
