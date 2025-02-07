var page = "https://"+window.location.hostname+window.location.pathname
function loadExtension(header, description, cover, url,copyCode=false){
  let extension = document.createElement("extension");
  extension.innerHTML = `
    <img class="extCover" src="${encodeURI(cover)}">
    <h1 class="extHeader">${header}</h1>
    <p class="extDescription">${description}</p>
    
    <button class="bottomButton">${copyCode==false?"Copy URL":"Copy JS Code"}</button>
    `
  extension.q(`.bottomButton`).onclick = async ()=>{
    if(copyCode==false){
       navigator.clipboard.writeText(encodeURI(url));
    }else{
      let code = await fetch(encodeURI(url))
      code = await code.text()
      navigator.clipboard.writeText(code);
    }
  }
  
  q('#extensions').appendChild(extension);
}

loadExtension("Math.js","Turned math.js library into an extension.","mathjs/cover.png",page+"mathjs/index.js")
loadExtension("BrainFuck Intepreter","It's a BrainFuck Intepreter, but in an extension.","brainfuck/cover.png",page+"brainfuck/index.js")
loadExtension("RegExp Collection","A collection of RegExp related blocks.","regex-collection/cover.png",page+"regex-collection/index.js")
