/**
 * Created by oliver on 16/12/13.
 */
const login_index=async (ctx, next) => {
    ctx.response.body = `<h1 font-color="red">M的测试登录</h1>
        <form action="/m" method="post">
            <p>用户名称: <input name="name" value="oliverwang"></p>
            <p>登录密码: <input name="password" type="password"></p>
            <p><input type="submit" value="M的登录"></p>
        </form>`;
};

const login_main= async (ctx, next) => {
    const
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(ctx.request.body);
    console.log(`登录的name: ${name}, password: ${password}`);
    if (name === 'oliverwang' && password === '960122') {
        ctx.response.body = `<h1 font-color="red">欢迎, ${name}光临!</h1>`;
    } else {
        ctx.response.body = `<h1 font-color="blue">M登录失败</h1>
        <p><a href="/m">请重试</a></p>`;
    }
};

module.exports={
    'GET /m': login_index,
    'POST /m': login_main
}