'use strict'
const fs = require("fs");
const path = require('path');

/// Return a MarkDown formatted String
function main(args) {
    //return `#${value}`
    let outline = require('../../sections/toc.json')
    let markdown = ''

    for (const key in outline.elements.chapters) {
        
        try {
            let chapter = outline.elements.chapters[key]
            let fileName = chapter.reference.toString();
            //let filePath = `../../chapters/${fileName}`

            let filePath = path.resolve(__dirname, `./../../chapters/${fileName}`)
            let chapterMarkDown = fs.readFileSync(filePath, 'utf8')

            markdown += `${chapterMarkDown}\n`
            //console.log(markdown)
        } catch (error) {
            console.log(error)
        }
        
    }
    return markdown
}

module.exports = { main };