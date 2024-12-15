import Koa from 'koa';
import { koaBody } from 'koa-body';
import serve from 'koa-static';
import router from './router.js';

const app = new Koa();

// 全局异常处理
process.on('uncaughtException', (err, origin) => {
  console.log(`Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

// 1. 配置静态资源目录 (假设客户端文件存放在 ../client/build 目录)
app.use(serve('../client/build'));

// 2. 使用 koa-body 中间件处理请求体
app.use(koaBody({
  json: true,           // 解析 JSON 格式的请求体
  urlencoded: true,     // 解析 URL 编码的表单数据
  multipart: true,      // 支持文件上传（如果有的话）
}));

// 3. 统一接口错误处理
app.use(async (ctx, next) => {
  try {
    await next(); // 执行下一个中间件
    if (ctx.response.status === 404 && !ctx.response.body) {
      ctx.throw(404); // 如果没有响应体，抛出 404 错误
    }
  } catch (error) {
    const { url = '' } = ctx.request;
    const { status = 500, message } = error;
    if (url.startsWith('/code')) {
      ctx.status = typeof status === 'number' ? status : 500;
      ctx.body = {
        msg: message,
      };
    }
  }
});

// 4. 注册路由
app.use(router.routes());         // 路由注册
app.use(router.allowedMethods()); // 允许的方法 (如 405 Method Not Allowed)

// 5. 启动服务器
app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
