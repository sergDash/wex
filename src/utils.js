export const isNone = v => v === null || v === undefined
export const isFunction = v => typeof v === 'function'
export const isString = v => typeof v === 'string'
export const isObject = v => v !== null && typeof v === 'object'

export function isEqual(a, b, depth = 0) {
  if (a === b) return true
  if (depth > 6 || !a || !b || typeof a !== 'object' || typeof b !== 'object') return a !== a && b !== b
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const ka = Object.keys(a), kb = Object.keys(b)
  if (ka.length !== kb.length) return false
  for (const k of ka) if (!isEqual(a[k], b[k], depth + 1)) return false
  return true
}

export function getNodeAttrs(el) {
  const attrs = {}
  const list = el.attributes
  for (let i = 0; i < list.length; i++) attrs[list[i].name] = list[i].value
  return attrs
}

export function camelCase(str) {
  const items = str.split(/\W|_/).filter(item => !!item)
  return items.map((item, i) => (i === 0 ? item : item.replace(item[0], item[0].toUpperCase()))).join('')
}

export function parseKey(str) {
  const matched = str.match(/([a-zA-Z0-9_$]+)(\((.*?)\))?/)
  const [, name, , _params] = matched
  const params = isString(_params)
      ? _params.split(',').map(item => item.trim()).filter(item => !!item)
      : void 0
  return [name, params]
}

const mustacheCache = new Map()
// строка с {{ }} разбирается один раз: массив из строк и { expr }
export function parseMustache(str) {
  let parts = mustacheCache.get(str)
  if (!parts) {
    parts = []
    const re = /\{\{(.*?)\}\}(?!\})/g
    let last = 0, m
    while ((m = re.exec(str))) {
      if (m.index > last) parts.push(str.slice(last, m.index))
      parts.push({ expr: m[1].trim() })
      last = re.lastIndex
    }
    if (parts.length && last < str.length) parts.push(str.slice(last))
    if (mustacheCache.size > 5000) mustacheCache.clear()
    mustacheCache.set(str, parts)
  }
  return parts
}

export function sanitizeSvg(str) {
  const tpl = document.createElement('template')
  tpl.innerHTML = str
  tpl.content.querySelectorAll('script,foreignObject,iframe,object,embed,style,animate,set').forEach(n => n.remove())
  tpl.content.querySelectorAll('*').forEach((el) => {
    ;[...el.attributes].forEach(({ name, value }) => {
      const n = name.toLowerCase()
      const v = value.trim().toLowerCase()
      const badHref = (n === 'href' || n === 'xlink:href') && !v.startsWith('#')
      if (n.startsWith('on') || badHref) el.removeAttribute(name)
    })
  })
  return tpl.innerHTML
}

// ---- экспорты Wex 2 (на них могут опираться другие модули сборки) ----
export function getNodeName(node) {
  return node.nodeName.toLowerCase()
}

export function getOuterHTML(el) {
  const nodeName = el.nodeName.toLowerCase()
  const attrs = [...el.attributes].map((a) => {
    if (a.value === '') return a.name
    else if (a.value.indexOf('"') > -1) return `${a.name}='${a.value}'`
    return `${a.name}="${a.value}"`
  }).join(' ')
  return `<${nodeName} ${attrs}></${nodeName}>`
}

export function createAttrsText(attrs) {
  const texts = []
  Object.keys(attrs).forEach((key) => { texts.push(`${key}="${attrs[key]}"`) })
  return texts.join(' ')
}

export function tryParseJSON(v, callback) {
  try { return JSON.parse(v) }
  catch (e) { return callback(v) }
}

// путь до $element внутри $root в виде селектора (jQuery-объекты передаёт вызывающий)
export function getPath($element, $root, prefix = []) {
  let $parent = $element.parent()
  if (!$parent.length) return null

  const findIndex = ($parent, $child) => {
    const children = $parent[0].childNodes
    const child = $child[0]
    let index = 0
    for (let i = 0, len = children.length; i < len; i++) {
      const item = children[i]
      if (item.nodeName === child.nodeName) index++
      if (item === child) return index
    }
  }

  const index = findIndex($parent, $element)
  const name = $element[0].nodeName.toLowerCase()
  const path = [`${name}:nth-of-type(${index})`]

  let level = 0
  while ($parent[0] !== $root[0]) {
    const $el = $parent
    $parent = $parent.parent()
    if (!$parent.length) return null
    const idx = findIndex($parent, $el)
    path.unshift(`${$el[0].nodeName.toLowerCase()}:nth-of-type(${idx})`)
    level++
    if (level > 20) throw new Error('Cant get $element path in given $root.')
  }
  return '>' + [].concat(prefix).concat(path).join('>')
}