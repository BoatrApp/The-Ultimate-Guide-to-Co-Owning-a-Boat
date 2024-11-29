 'use strict'
function main(args) {
    let title = args[0]

    let value = title.replace(/['!?]/g,"")
    value = value.replaceAll(/ /g,'-')
    value = value.toLowerCase()

    //let value = title.replaceAll(' ','-').replaceAll('?','').toLowerCase()
    return `#${value}`
}

module.exports = { main };