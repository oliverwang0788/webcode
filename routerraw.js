/**
 * Created by oliver on 16/12/13.
 */
const router=require('koa-router')();
const fs=require('fs');

function addMapping(router, mapping) {
    for (var url in mapping) {
        var met=url.split(' ');
        var method=met[0];
        var path=met[1];
        if (method==='GET') {
            router.get(path, mapping[url]);
            console.log(`register url mapping: GET ${path}`);
        } else if (method==='POST') {
            router.post(path, mapping[url]);
            console.log(`register url mapping: POST ${path}`);
        } else if (method==='PUT') {
            router.put(path, mapping[url]);
            console.log(`register url mapping: PUT ${path}`);
        } else if (method==='DELETE') {
            router.del(path, mapping[url]);
            console.log(`register url mapping: DELETE ${path}`);
        } else {
            console.log(`invalid url: ${url}`);
        }
    }//POST，GET，PUT，DELETE，HEAD，TRACE、CONNECT、OPTIONS 先不管他稀里糊涂给处理了
}

function initRouter(router,dir) {
    let files=fs.readdirSync(__dirname+'/'+dir).filter(function (f) {
        return f.endsWith('.js');//数组，javascript的文件的数组
    });
    files.forEach(function (f) {
        console.log('正在处理'+f);
        let mapping=require(__dirname+'/'+dir+'/'+f);
        addMapping(router,mapping);
    })
}//读特定目录的文件

module.exports=function (dir) {
    let routerdir= dir || 'router';
    initRouter(router,routerdir);
    //console.log(router)
    return router.routes();

}