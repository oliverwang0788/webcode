/**
 * Created by oliver on 16/12/13.
 */


const login_index=async (ctx, next) => {
    ctx.response.body = `<h1>登录</h1>
        <form action="/login" method="post">
            <p>用户名称: <input name="name" value="koa2"></p>
            <p>登录密码: <input name="password" type="password"></p>
            <p><input type="submit" value="登录"></p>
        </form>`;
};

const login_main= async (ctx, next) => {
    const
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(ctx.request.body);
    console.log(`登录的name: ${name}, password: ${password}`);
    if (name === 'koa2' && password === '654321') {
        ctx.response.body = `<h1>欢迎, ${name}光临!</h1>`;
    } else {
        ctx.response.body = `<h1>登录失败</h1>
        <p><a href="/login">请重试</a></p>`;
    }
};

module.exports={
    'GET /login': login_index,
    'POST /login': login_main
}