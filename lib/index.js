'use strict'

const assert = require('assert').strict

module.exports = () => {

}

const re = /[a-zA-Z_][a-zA-Z_0-9]*|[{}()=*+-/,]|yes|no|[0-9]+|\s+|\n/gm
function tokenise (code) {
  if (code === '') return []
  // console.log(code.match(re))
  return code.match(re).reduce((accum, item) => {
    if (/\n/m.test(item)) {
      item = '\n'
    }
    return accum.concat(item)
  }, [])
}

module.exports.parse = (code) => {
  const tokens = tokenise(code)
  const out = []
  const tok = () => tokens[0]
  const peek = (n = 0) => tokens[1 + n]
  const pop = () => tokens.shift()
  function readExpr (isIf) {
    while (tokens.length) {
      // console.log('tokens', {tokens})
      if (tok() === ',') {
        console.log({ tokens })
        assert(false)
        pop()
        while (/^\s+$/.test(tok())) pop()
        break
      } else if (/^[a-zA-Z0-9_.]+$/.test(tok())) {
        while (/^\s+$/.test(peek())) tokens.splice(1, 1)
        if (isIf) {
          out.push(pop())
          while (/^\s+$/.test(tok())) pop()
          if (tok() === '{') { pop(); break }
        } else if (peek() === '(') {
          // Call
          out.push(pop())
          pop()
          out.push('(')
          if (tok() !== ')') readExpr()
          else pop()
          out.push(')')
        } else if (tok() === 'if') {
          pop()
          while (/^\s+$/.test(tok())) pop()
          out.push('if(')
          readExpr(/* isIf */ true)
          out.push('){')
          readExpr()
          out.push('}')
          pop()
        } else if (peek() === ',') {
          out.push(pop())
          out.push(pop())
        } else if (peek() === '=') {
          out.push(pop())
          pop()
          out.push('=')
          readExpr()
        } else if (peek() && /^[a-zA-Z0-9_.]+$/.test(peek())) {
          out.push(pop())
          out.push('(')
          readExpr()
          out.push(')')
        } else {
          out.push(pop())
          while (/^\s+$/.test(tok())) pop()
        }
      } else if (/^[0-9]+$/.test(tok())) {
        out.push(tok())
      } else if (tok() === '{' || tok() === '}') {
        // out.push(pop())
        pop()
      } else if (/^\s+$/.test(tok())) {
        pop()
      } else {
        assert(false, JSON.stringify(tokens))
      }
    }
  }
  readExpr()
  return out.join('')
}
