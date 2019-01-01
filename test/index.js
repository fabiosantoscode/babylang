'use strict'

const assert = require('assert').strict
const babylang = require('..')

describe('babylang', () => {
  it('parses assignment', () => {
    assert.deepEqual(
      babylang.parse('foo = x'),
      'foo=x'
    )
  })
  it('parses code', () => {
    assert.deepEqual(
      babylang.parse('foo x'),
      'foo(x)'
    )
  })
  it('parses multiple fargs', () => {
    assert.deepEqual(
      babylang.parse('foo x, y'),
      'foo(x,y)'
    )
  })
  it('allows spaces before comma', () => {
    assert.deepEqual(
      babylang.parse('foo x , y'),
      'foo(x,y)'
    )
  })
  it('can do if', () => {
    assert.deepEqual(
      babylang.parse('if foo {\n foo \n}'),
      'if(foo){foo()}'
    )
  })
  it.skip('disallows nested functions', () => {
    assert.throws(() => { babylang.parse('foo bar baz') }, /Do not write/)
  })
  it('can do multiline programs', () => {
    assert.deepEqual(babylang.parse(`
        console.log 42, 123

        if 1 + 3 {
            console.log 1 + 3
        }
      `),
      'console.log(42,123)if(1+3){console.log(1+3)}'
    )
  })
})
