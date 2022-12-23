import Crypto from 'crypto-js'

// 默认的 KEY 与 iv 如果没有给
const key = Crypto.enc.Utf8.parse('ARWd2P0PEC4YXUKS') // 十六位十六进制数作为密钥
const iv = Crypto.enc.Utf8.parse('P3R2GVL1K2HNZ9Y7') // 十六位十六进制数作为密钥偏移量

// 解密方法
export function Decrypt(word: string) {
  const encryptedHexStr = Crypto.enc.Hex.parse(word)
  const srcs = Crypto.enc.Base64.stringify(encryptedHexStr)
  const decrypt = Crypto.AES.decrypt(srcs, key, {
    iv: iv,
    mode: Crypto.mode.CBC,
    padding: Crypto.pad.Pkcs7,
  })
  const decryptedStr = decrypt.toString(Crypto.enc.Utf8)
  return decryptedStr.toString()
}

// 加密方法
export function Encrypt(word: string) {
  const srcs = Crypto.enc.Utf8.parse(word)
  const encrypted = Crypto.AES.encrypt(srcs, key, {
    iv: iv,
    mode: Crypto.mode.CBC,
    padding: Crypto.pad.Pkcs7,
  })
  return encrypted.ciphertext.toString().toUpperCase()
}
