'use strict'

const assert = require('assert').strict

module.exports = () => {

}

const re = /[a-zA-Z_][a-zA-Z_0-9.]*|[{}()=*+-/,]|yes|no|[0-9]+|\s+|\n/gm
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
      // console.log('tokens', {tokens,out})
      if (tok() === ',') {
        out.push(pop())
        while (/^\s+$/.test(tok())) pop()
      } else if ('*+-/'.includes(tok())) {
        out.push(pop())
      } else if (/^[0-9]+$/.test(tok())) {
        out.push(pop())
      } else if (/^[a-zA-Z0-9_.]+$/.test(tok())) {
        while (/^\s+$/.test(peek()) && peek() !== '\n') tokens.splice(1, 1)
        if (peek() === '\n') {
          out.push(pop())
          out.push('()')
          while (tok() === '\n') pop()
        } else if (isIf) {
          out.push(pop())
          while (/^\s+$/.test(tok())) pop()
          if (tok() === '{') { pop(); break }
        } else if (peek() === '(') {
          // Call
          out.push(pop())
          pop()
          if (tok() !== ')') readExpr()
          else pop()
          out.push(')')
        } else if (tok() === 'if') {
          pop()
          while (/^\s+$/.test(tok())) pop()
          out.push('if(')
          readExpr(/* isIf */ true)
          out.push('){')
          while (readExpr() !== '}');
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
        return '}'
      } else if (tok() === ')') {
        throw 'ok'
        pop()
        break
      } else if (tok() === '\n') {
        while (tok() === '\n') pop()
        break
      } else if (/^\s+$/.test(tok())) {
        pop()
      } else {
        assert(false, JSON.stringify(tokens))
      }
    }
  }
  while(tokens.length) readExpr()
  return out.join('')
}
