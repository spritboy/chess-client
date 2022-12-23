export type CMD = 'connect' | 'send' | 'message'
export type MsgType = 'text' | 'image' | 'markdown'

export interface IConnect {
  cmd: CMD
  nickname?: string
}

export interface IConnectRece extends IConnect {
  id?: string
}

// 发送消息-send
export interface IMessSend {
  cmd: CMD
  id?: string
  msgType?: MsgType
  msgData?: string
}

// 接收消息-message
export interface IReceive extends IMessSend {
  timestamp?: number
  nickname?: string
}
