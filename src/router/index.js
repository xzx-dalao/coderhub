const fs = require('fs');


const useRoutes = (app)=> {//readdirSync读取文件名称的，readFileSync读取文件内容的
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return;
    const router = require(`./${file}`);
    app.use(router.routes());
    app.use(router.allowedMethods());
  })
}

module.exports = useRoutes;

