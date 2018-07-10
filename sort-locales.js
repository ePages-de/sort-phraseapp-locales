#!/usr/bin/env node

const argv = require('yargs')
  .detectLocale(false)
  .usage('Usage: $0 [--fix] file...')
  .demandCommand(1)
  .option('fix', {
    describe: 'Fix errors',
    boolean: true,
  })
  .help().argv

const Bluebird = require('bluebird')
const path = require('path')
const { readFileAsync, writeFileAsync } = Bluebird.promisifyAll(require('fs'))

function sort(a) {
  if (typeof a !== 'object' || a === null) {
    return a
  }
  const copy = Array.isArray(a) ? [] : {}
  const keys = Object.keys(a).sort((...args) => {
    // trying to mimick PhraseApp's sorting algorithm...
    const [x, y] = args.map(k => k.toUpperCase())
    if (x < y) return -1
    if (x > y) return 1
    return 0
  })
  keys.forEach(function(key) {
    copy[key] = sort(a[key])
  })
  return copy
}

const failures = []

Bluebird.map(argv._, async function(filename) {
  const localeString = await readFileAsync(path.resolve(process.cwd(), filename), 'utf8')
  try {
    const localeJSON = JSON.parse(localeString)
    const newLocaleJSON = sort(localeJSON)
    const newLocaleString = JSON.stringify(newLocaleJSON, null, 2)

    if (argv.fix) {
      await writeFileAsync(path.resolve(process.cwd(), filename), newLocaleString, 'utf8')
    } else if (localeString.trim() !== newLocaleString.trim()) {
      failures.push(filename)
    }
  } catch (err) {
    process.stderr.write(`Error reading file ${filename}:\n${err}\n`)
    failures.push(filename)
  }
}).then(() => {
  failures.forEach(filename => process.stderr.write(`File ${filename} is not properly sorted\n`))
  process.exit(failures.length)
})
