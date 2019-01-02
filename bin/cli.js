#!/usr/bin/env node

'use strict'

const fs = require('fs')
const cp = require('child_process')
const assert = require('assert').strict
const babylang = require('..')
const withTempFile = require('with-temp-file')

const argv = require('minimist')(process.argv.slice(2))

async function main () {
  if (argv.help) {
    console.log(`Usage:

To run <file>:
    $ babylang <file> --exec

To compile <file> and put in <outfile>:
    $ babylang <file> --output <outfile>
`)

    return
  }
  assert.equal(argv._.length, 1, 'we only support a single file argument. do babylang [justonefile] ...')
  const script = babylang(fs.readFileSync(argv._[0]) + '')

  if (argv.exec) {
    await withTempFile(async (ws, filename) => {
      ws.end(script)
      await new Promise(resolve => setTimeout(resolve, 500))
      const result = cp.spawnSync('node', [filename])
      if (result.stderr.toString().length) {
        console.error(result.stderr.toString())
      } else {
        console.log(result.stdout.toString().replace(/\n$/m, ''))
        console.log('(end of output)')
      }
    })
  } else {
    assert(argv.output, 'provide --output option with a file')
    fs.writeFileSync(argv.output, script)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit()
})
