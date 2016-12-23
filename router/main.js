/**
 * Created by oliver on 16/12/13.
 */
'use strict';

const sha1=require('sha1');

const config={
    wechat:{
        appId:'wx6a7a5f8db03d7869',
        appSecrets:'7f4ffd30f6dfb364483a3996aa2b0141',
        token:'oliverwang'
    }
};

var wechat=async(ctx,next)=> { //微信接入验证，呵呵
    console.log(ctx.query);
    var token=config.wechat.token;
    var signature=ctx.query.signature;
    var timestamp=ctx.query.timestamp;
    var nonce=ctx.query.nonce;
    var echostr=ctx.query.echostr;
    var str=[token,timestamp,nonce].sort().join('');
    var sha=sha1(str);
    console.log(sha);
    if (sha===signature)
    {
        ctx.response.body=echostr;
    }
    else
    {
        ctx.response.body='wrong';
    }
};

var fn_index=async (ctx, next) => {
     ctx.response.body = '<h1>这是我的第一个WebApp页面！</h1>';
};

var fn_test= async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = '<h1>test的页面!</h1>';
};
var fu_help= async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = '<h1>help的页面!</h1>';
};


var fn_aboutName= async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = `<h1>这是关于 ${name}的信息的页面!</h1>`;
};

module.exports={
    'GET /': fn_index,
    'GET /wx': wechat,
    'GET /test': fn_test,
    'GET /help': fu_help,
    'GET /about/:name': fn_aboutName
};
