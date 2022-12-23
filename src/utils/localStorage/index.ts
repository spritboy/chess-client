import { Decrypt, Encrypt } from '../crypto'

export function getDataDao(key: string): string {
  try {
    let value = localStorage.getItem(key)
    // 将读取的数据进行解密
    if (value) {
      value = Decrypt(value)
    }
    return value || ''
  } catch (err) {
    console.log('读取localstorage失败: ', err)
    alert('localstorage不可用')
    return ''
  }
}

export function setDataDao(key: string, value: string): boolean {
  try {
    const _value = Encrypt(value)
    // 将加密后的数据存入localstorage中
    localStorage.setItem(key, _value)
    return true
  } catch (err) {
    console.log('写入localstorage失败: ', err)
    return false
  }
}
