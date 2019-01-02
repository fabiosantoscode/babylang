'use strict'

const assert = require('assert').strict
const babylang = require('..')

describe('babylang', () => {
  it('parses assignment', () => {
    assert.deepEqual(
      babylang('foo = x'),
      'foo=x'
    )
  })
  it('parses code', () => {
    assert.deepEqual(
      babylang('foo x'),
      'foo(x)'
    )
  })
  it('parses multiple fargs', () => {
    assert.deepEqual(
      babylang('foo x, y'),
      'foo(x,y)'
    )
  })
  it('allows spaces before comma', () => {
    assert.deepEqual(
      babylang('foo x , y'),
      'foo(x,y)'
    )
  })
  it('can do if', () => {
    assert.deepEqual(
      babylang('if foo {\n foo \n}'),
      'if(foo){foo()}'
    )
  })
  it.skip('disallows nested functions', () => {
    assert.throws(() => { babylang('foo bar baz') }, /Do not write/)
  })
  it('can do multiline programs', () => {
    assert.deepEqual(babylang(`
        console.log 42, 123

        if 1 + 3 {
            console.log 1 + 3
        }
      `),
      'console.log(42,123)if(1+3){console.log(1+3)}'
    )
  })
  it('can do a simple program', () => {
    assert.equal(babylang('console.log 123\n'), `console.log(123)`)
  })
  it('breaks with unknown characters', () => {
    assert.throws(() => {
      babylang('foo =>')
    }, /^Error: Unknown character ">"$/)
  })
})
