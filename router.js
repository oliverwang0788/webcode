/**
 * Created by oliver on 16/12/13.
 */

const fs = require('fs');

// add url-route in /controllers:

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

function addRouters(router, dir) {
    fs.readdirSync(__dirname + '/' + dir).filter((f) => {
        return f.endsWith('.js');
    }).forEach((f) => {
        console.log(`处理路由: ${f}...`);
        let mapping = require(__dirname + '/' + dir + '/' + f);
        addMapping(router, mapping);
    });
}

module.exports = function (dir) {
    let
        router_dir = dir || 'router',
        router = require('koa-router')();
    addRouters(router, router_dir);
    return router.routes();
};