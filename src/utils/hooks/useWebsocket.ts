import { useCallback, useEffect, useRef, useState } from 'react'
import { IReceive } from '../../type'

interface IProps {
  url: string
}

/**
 * websocket.readyState
 * 0 ----- 正在连接中
 * 1 ----- 连接成功
 * 2 ----- 连接正在关闭
 * 3 ----- 连接已关闭或连接失败
 */

export default function useWebsocket({ url }: IProps) {
  const websocketRef = useRef<WebSocket | null>(null)
  const [data, setData] = useState<IReceive>({ cmd: 'connect' })
  const [readyState, setReadyState] = useState(0)

  const createWebsocket = () => {
    try {
      websocketRef.current = new WebSocket(url)
      websocketRef.current.onopen = () => {
        console.log('与websocket建立连接: ', websocketRef.current?.readyState)
        setReadyState(websocketRef.current?.readyState || 0)
      }
      websocketRef.current.onclose = () => {
        console.log('websocket已关闭 ', websocketRef.current?.readyState)
        setReadyState(websocketRef.current?.readyState || 0)
      }
      websocketRef.current.onerror = () => {
        console.log('websocket正在关闭 ', websocketRef.current?.readyState)
        setReadyState(websocketRef.current?.readyState || 0)
      }
      websocketRef.current.onmessage = (e: MessageEvent) => {
        console.log('接收消息: ', e.data)
        setData({ ...JSON.parse(e.data) })
      }
    } catch (err) {
      console.log('创建websocket失败: ', err)
    }
  }
  const initWebsocket = () => {
    if (!websocketRef.current || websocketRef.current.readyState === 3) {
      createWebsocket()
    }
  }

  const closeWebsocket = () => {
    websocketRef.current?.close()
  }

  const sendMessage = useCallback((content: string) => {
    try {
      websocketRef.current?.send(content)
    } catch (err) {}
  }, [])

  const reconnect = () => {
    console.log('重新连接')

    try {
      closeWebsocket()
      createWebsocket()
    } catch (err) {
      console.log('重连失败: ', err)
    }
  }

  useEffect(() => {
    initWebsocket()
    return () => {
      websocketRef.current?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    data,
    readyState,
    sendMessage,
    reconnect,
    closeWebsocket,
  }
}
