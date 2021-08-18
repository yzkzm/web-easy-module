/**
 * author yzkzm
 * date 2021/8/18
*/
const fs = require('fs')
const jsPath = 'js'
const cssPath = 'css'
const libPath = 'lib'
const publicPath = './dist'
const htmlPath = './'
const imgPath = 'image'
const filesReplace = []

function copyFile (path, isAll) {
  fileState(`${publicPath}/${path}`)
  fs.readdir(`./${path}`, 'utf-8',function(err, data) {
    data.forEach(item => {
      if(item.indexOf('min')>0 || isAll) {
        const fileData = fs.readFileSync(`${path}/${item}`)
        fs.writeFileSync(`${publicPath}/${path}/${item}`, fileData)
      } else {
        filesReplace.push(`${path}/${item}`)
      }
    })
  })
}
function copyHtml(path) {
  fs.readdir(`${path}`, 'utf-8',function(err, data) {
    data.forEach(item => {
      if(item.indexOf('html')>0) {
        let fileData = fs.readFileSync(`${path}/${item}`, 'utf-8')
        filesReplace.forEach(key => {
          const fileName = key.replace(/(\.js|\.css)/, ".min$1")
          fileData = fileData.replace(key, `${fileName}`)
        })
        fs.writeFileSync(`${publicPath}/${item}`, fileData)
      }
    })
  })
}

function fileState(path) {
  return new Promise(function(resolve,reject) {
    fs.stat(path, function(error, stats) {
      if(error) {
        fs.mkdir(path, { recursive: true }, (err) => {
          if (err) return reject(err)
          resolve(true)
        })
        return false
      }
      resolve(true)
    })
  })
}
fs.rmSync(publicPath, { force: true, recursive: true })
fileState(publicPath).then(res => {
  if(res) {
    copyFile(imgPath, true)
    copyFile(jsPath)
    copyFile(cssPath)
    copyFile(libPath, true)
    copyHtml(htmlPath)
  }
})
