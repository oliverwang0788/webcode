/**
 * Created by oliver on 16/12/10.
 */

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router=require('./routerraw');
const views = require('koa-views');
const convert=require('koa-convert');

const app = new Koa();


// Must be used before any router is used
app.use(views(__dirname + '/views', {
    map: {
        ejs: 'ejs'
    }
}));

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// add router middleware:
app.use(bodyParser());
app.use(convert(require('koa-static')(__dirname + '/public')));
app.use(router());
// 对于任何请求，app将调用该异步函数处理请求：

// 在端口3000监听:
app.listen(3000);
console.log('Web服务器在本机端口：3000启动了，可以通过http://localhost：3000访问我哦...');

