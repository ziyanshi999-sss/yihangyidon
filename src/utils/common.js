/**
 * 通用工具函数
 */

/**
 * 格式化金额
 * @param {number|string} amount 金额
 * @param {number} decimals 小数位数，默认2位
 * @param {string} separator 千分位分隔符，默认逗号
 */
export const formatMoney = (amount, decimals = 2, separator = ',') => {
  if (amount === null || amount === undefined || amount === '') return '0.00'
  
  const num = Number(amount)
  if (isNaN(num)) return '0.00'
  
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

/**
 * 格式化银行卡号
 * @param {string} cardNumber 银行卡号
 * @param {string} separator 分隔符，默认空格
 */
export const formatBankCard = (cardNumber, separator = ' ') => {
  if (!cardNumber) return ''
  return cardNumber.replace(/\s/g, '').replace(/(.{4})/g, `$1${separator}`).trim()
}

/**
 * 隐藏银行卡号中间部分
 * @param {string} cardNumber 银行卡号
 * @param {number} showStart 显示开始位数，默认4位
 * @param {number} showEnd 显示结尾位数，默认4位
 */
export const hideBankCard = (cardNumber, showStart = 4, showEnd = 4) => {
  if (!cardNumber) return ''
  const card = cardNumber.replace(/\s/g, '')
  if (card.length <= showStart + showEnd) return card
  
  const start = card.slice(0, showStart)
  const end = card.slice(-showEnd)
  const middle = '*'.repeat(card.length - showStart - showEnd)
  
  return formatBankCard(start + middle + end)
}

/**
 * 隐藏手机号中间部分
 * @param {string} phone 手机号
 */
export const hidePhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 验证手机号
 * @param {string} phone 手机号
 */
export const validatePhone = (phone) => {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证身份证号
 * @param {string} idCard 身份证号
 */
export const validateIdCard = (idCard) => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard)
}

/**
 * 验证银行卡号
 * @param {string} cardNumber 银行卡号
 */
export const validateBankCard = (cardNumber) => {
  const reg = /^\d{13,19}$/
  return reg.test(cardNumber.replace(/\s/g, ''))
}

/**
 * 防抖函数
 * @param {Function} fn 要防抖的函数
 * @param {number} delay 延迟时间，默认300ms
 */
export const debounce = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn 要节流的函数
 * @param {number} delay 延迟时间，默认300ms
 */
export const throttle = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, delay)
    }
  }
}

/**
 * 深拷贝
 * @param {any} obj 要拷贝的对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const copy = {}
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key])
    })
    return copy
  }
}

/**
 * 获取文件扩展名
 * @param {string} filename 文件名
 */
export const getFileExt = (filename) => {
  return filename.slice(filename.lastIndexOf('.') + 1).toLowerCase()
}

/**
 * 获取当前时间戳
 * @param {boolean} isMs 是否返回毫秒，默认返回秒
 */
export const getTimestamp = (isMs = false) => {
  return isMs ? Date.now() : Math.floor(Date.now() / 1000)
}

/**
 * 格式化时间
 * @param {Date|string|number} time 时间
 * @param {string} format 格式，默认 'YYYY-MM-DD HH:mm:ss'
 */
export const formatTime = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}