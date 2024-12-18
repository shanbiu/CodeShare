import { loadDB } from '../service/database.js';

export async function getData(ctx) {
  try {
    // 获取查询参数中的密码 (例如: ?pw=your_password)
    const { pw } = ctx.query;
    // 异步加载数据库
    const db = await loadDB();
    const result = db.data.code_shares.find(item => item.id === ctx.params.id);

    if (result) {
      // 检查是否过期
      const currentTimestamp = Date.now();
      const isExpired = result.expire_at !== null && result.expire_at < currentTimestamp;

      // 如果过期，返回过期信息
      if (isExpired) {
        ctx.body = { message: '该代码分享已过期。' };
        ctx.status = 400;
        return;
      }

      // 如果是加密状态，验证密码
      if (!result.isPublic && result.password !== pw) {
        ctx.body = { message: '密码错误。' };
        ctx.status = 403; // Forbidden
        return;
      }
      else {
        // 如果密码正确，返回数据
        console.log('密码正确，返回数据');
      }

      // 返回查询到的数据
      ctx.body = result;
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Data not found' };
    }

  } catch (error) {
    console.error('获取数据失败:', error);
    ctx.status = 500;
    ctx.body = { message: 'Server error' };
  }
}
export async function getAllData(ctx) {
  try {
    // 异步加载数据库
    const db = await loadDB();
    // 返回查询到的数据
    ctx.body = db.data.code_shares;

  } catch (error) {
    console.error('获取数据失败:', error);
    ctx.status = 500;
    ctx.body = { message: 'Server error' };
  }
}

export async function addData(ctx) {
  try {
    // 获取请求体中的数据
    const newCodeShare = ctx.request.body;

    console.log('收到的提交数据:', newCodeShare);

    // 调用 loadDB() 函数来获取数据库实例
    const db = await loadDB();  // 确保 db 已经从 loadDB() 获取到

    // 确保 code_shares 数组存在
    if (!db.data.code_shares) {
      db.data.code_shares = []; // 如果不存在，初始化为一个空数组
    }

    // 将新分享添加到数据库
    db.data.code_shares.push(newCodeShare);

    // 将数据写入数据库
    await db.write();

    // 返回成功的响应
    ctx.body = { success: true, message: '提交成功' };
  } catch (error) {
    console.error('添加数据失败:', error);

    // 错误处理：如果操作失败，返回 500 错误
    ctx.status = 500;
    ctx.body = { message: 'Server error，请重新添加' };
  }
}