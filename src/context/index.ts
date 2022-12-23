import { createContext } from 'react'
import { CMD, IReceive } from '../type'

export interface DataType {
  [propName: string]: any
}

export interface contextType<T = IReceive> {
  data: T
  readyState: number
  sendMessage: (content: string) => void
  reconnect?: () => void
  closeWebsocket?: () => void
}
export const defaultValue = {
  data: {
    id: '',
    cmd: 'connect' as CMD,
  },
  readyState: 0,
  sendMessage: () => {},
}

export const WebSocketContext = createContext<contextType>(defaultValue)
