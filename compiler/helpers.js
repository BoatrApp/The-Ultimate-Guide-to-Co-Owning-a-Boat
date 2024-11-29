'use strict'
const fs = require("fs");

///Returns a Markdown formatted String given a [markdown] object
function formatMarkdown(markdown) {

    let template = markdown.template
    let placeholders = markdown.placeholders

    let output = template

    for (const key in placeholders) {
        const placeholder = placeholders[key]

        const searchValue = `{${key}}`
        let replaceValue = ''

        const raw = placeholder.raw
        const reference = placeholder.reference

        if(raw != null) {
            //console.log(raw)
            replaceValue = placeholder.raw
        } else {
            if(reference != null) {
                console.log(reference)

                const referenceType = reference.split('.')[reference.split('.').length - 1]

                switch (referenceType) {
                    
                    /*
                    case 'md':
                        throw 'Not Implemented : Unhandled referenceType [md]'
                        break;
                
                    case 'json':
                        throw 'Not Implemented : Unhandled referenceType [json]'
                        break;

                    case 'raw':
                        throw 'Not Implemented : Unhandled referenceType [raw]'
                        break;

                    case 'js':
                        throw 'Not Implemented : Unhandled referenceType [js]'
                        break;
                    */
                    
                    case 'this':
                        let valuePath = reference.split('.').reverse().join('.').replace('this.','')
                        let pathElements = valuePath.split('.')

                        let referenceValue

                        let fullPath = ''
                        for (const pathElementIdx in pathElements) {
                             
                            let currentElement = pathElements[pathElementIdx]
                            let nextElementIdx = parseInt(pathElementIdx) + 1
                            let nextElement = pathElements[nextElementIdx.toString()]
                            fullPath += `.${currentElement}`
                            console.log(currentElement)

                            referenceValue = eval(`outline${fullPath}`)

                            if(Array.isArray(referenceValue)) {
                                console.log(referenceValue);
                            } else {
                                //do nothing
                                console.log(referenceValue)
                            }
                        }

                        break;
        
                    default:
                        const errmsg = `Unhandled referenceType [${referenceType}] in file [${filename}] under section idx [${sectionidx}]`
                        throw errmsg
                }

            } else {
                const errmsg = `Invalid placeholder : [${placeholder}] : Property [template] must contain either [raw] or [reference]`
                throw errmsg
            }
        }

        output = output.replaceAll(searchValue, replaceValue)

    }
    
    return output
}

///Returns a Markdown formatted String given a [processOutline] object
function processOutline(outline) {
    try {
        //let fOutline = fs.readFileSync(filename, 'utf8');
        //const outline = JSON.parse(fOutline);
        const sections = outline.sections

        let output = ""
        
        for (const sectionidx in sections) {

            const content = sections[sectionidx].content
            const reference = content.reference

            let sectionmarkdown = ""

            if(reference != null) {
                const referenceType = reference.split('.')[reference.split('.').length - 1]

                switch (referenceType) {
                    case 'js':
                        let f = require(reference)
                        let args = content.args ?? []
                        sectionmarkdown = f.main(args)
                        break;

                    case 'md':
                        sectionmarkdown = fs.readFileSync(reference, 'utf8');
                        break;

                    case 'raw':
                        sectionmarkdown = formatMarkdown(content)
                        break;
                    
                    case 'this':
                        let valuePath = reference.split('.').reverse().join('.').replace('this.','')
                        let referenceValue = eval(`outline.${valuePath}`)

                        const referenceValueIsArray = Array.isArray(referenceValue);

                        if(referenceValueIsArray) {
                            const referenceContentSections = 
                            {
                                "sections":[]
                            }

                            for (let index = 0; index < referenceValue.length; index++) {

                                let referenceMarkdown = 
                                {
                                    "template":content.markdown.template,
                                    "placeholders":{}  
                                }
                               
                                const placeholderValues = referenceValue[index];
                                const contentPlaceHolders = content.markdown.placeholders

                                for (const key in contentPlaceHolders) {
                                    let placeholder = contentPlaceHolders[key]

                                    console.log(placeholder)

                                    const placeholderReference = placeholder.reference

                                    if(placeholderReference != null) {
                                        const placeholderReferenceType = placeholderReference.split('.')[placeholderReference.split('.').length - 1]

                                        switch (placeholderReferenceType) {

                                            case 'md':
                                                throw 'Not Implemented : Unhandled placeholderReferenceType [md]'
                                                break;

                                            case 'js':
                                                //throw 'Not Implemented : Unhandled placeholderReferenceType [js]'


                                                let f = require(placeholderReference)
                                                let fArgs = [];
                                                let args = placeholder.args ?? []
                                                let res;

                                                //prepare call the js by building the args
                                                for (const key in args) {
                                                    let arg = args[key]
                                                    let argIsReference = arg.split('.')[arg.split('.').length - 1] == 'this'

                                                    if(argIsReference) {
                                                        let argPath = arg.replace('.this','').split('.').reverse().join('.')
                                                        let argValue = placeholderValues[argPath]

                                                        fArgs[key] = argValue
                                                    } else {
                                                        throw `Not Implemented : Unhandled arg [${arg}]`
                                                    }
                                                }

                                                res = f.main(fArgs)

                                                referenceMarkdown.placeholders[key] = {
                                                    "raw":res
                                                }

                                                break;

                                            case 'this':
                                                referenceMarkdown.placeholders[key] = {
                                                    "raw":placeholderValues[key]?.toString() ?? `**missing placeholderValue for key [${key}]**`
                                                }

                                                break;
                                        
                                            default:
                                                throw `Not Implemented : Unhandled placeholderReferenceType [${placeholderReferenceType}]`
                                        }
                                    } else {
                                        throw 'Not Implemented : Unhandled placeholderReference [null]'
                                    }

                                }

                                const markdown = formatMarkdown(referenceMarkdown)
                                sectionmarkdown += '\n' + markdown
                                
                            }
                        } else {
                            console.log(referenceValue)
                            throw 'Not Implemented : referenceValueIsArray is not array, i.e. a single value'
                            
                        }
                        break;
        
                    default:
                        const errmsg = `Unhandled referenceType [${referenceType}] in file [${filename}] under section idx [${sectionidx}]`
                        throw errmsg
                }
            } else {
                const markdown = content.markdown
                sectionmarkdown = formatMarkdown(markdown)
            }

            output += '\n' + sectionmarkdown
        }

        output = output.replaceAll('\n\n\n','\n\n')

        return output        
        
      } catch (e) {
        console.log(e)
    }
}

module.exports = { processOutline, formatMarkdown };