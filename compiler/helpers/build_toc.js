'use strict'
const helpers = require('../helpers.js')

/// Return a Markdown formatted String
function main(args) {
    let outline = require('../../sections/toc.json')
    let markdown = helpers.processOutline(outline) //.processoutline(filename)
    return markdown
}

module.exports = { main };