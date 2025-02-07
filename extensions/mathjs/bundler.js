(async()=>{
    const fetch = require("node-fetch")
    const fs = require("fs")

    console.log("Fetching library")
    var lib = await fetch("https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.4.1/math.js")
    lib = await lib.text()

    console.log("Fetcing extension javascript")
    var extension = fs.readFileSync("extension.js","utf-8")

    console.log("Building bundle")
    var bundled = "(async function(Scratch){\n"+lib+"\n\n\n"+extension+"\n})(Scratch);"

    console.log("Writing file")
    fs.writeFileSync("index.js",bundled,"utf-8")

    console.log("Done building!")
})()
