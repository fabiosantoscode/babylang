'use strict'

const fs = require('fs').promises
const cp = require('child_process')
const assert = require('assert')
const babylang = require('..')
const withTempFile = require('with-temp-file')

const argv = require('minimist')(process.argv.slice(2))

async function main() {
  assert(argv.output, 'provide --output option')
  assert.equal(argv._.length, 1, 'we only support a single file argument. do babylang [justonefile] ...')
  console.log(await fs.readFile(argv._[0]) + '')
  const script = babylang(await fs.readFile(argv._[0]) + '')

  if (argv.exec) {
    await withTempFile(async (ws, filename) => {
      ws.end(script)
      const result = cp.spawnSync('node', [filename])
      console.log({result})
    })
  } else {
    await fs.writeFile(argv.output, script)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit()
})
