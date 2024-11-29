'use strict'
const fs = require("fs");
const helpers = require('./helpers.js')

function main() {

    let outline = require('../sections/outline.json')
    let output = helpers.processOutline(outline)
    
    const d = new Date()
    const ts = d.toISOString()
    fs.mkdirSync(`./compiler/output/${ts}`)
    fs.writeFileSync(`./compiler/output/${ts}/ebook.md`,output)
}

main()