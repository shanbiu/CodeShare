import { loadDB } from '../service/database.js';

export async function getData(ctx) {
  try {
    // 获取查询参数中的密码 
    const { pw } = ctx.query;
    // 加载数据库
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
        console.log('密码正确，返回数据');
      }
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
    const db = await loadDB();
    ctx.body = db.data.code_shares;

  } catch (error) {
    console.error('获取数据失败:', error);
    ctx.status = 500;
    ctx.body = { message: 'Server error' };
  }
}

export async function addData(ctx) {
  try {
    const newCodeShare = ctx.request.body;

    console.log('收到的提交数据:', newCodeShare);

    const db = await loadDB();

    if (!db.data.code_shares) {
      db.data.code_shares = [];
    }

    db.data.code_shares.push(newCodeShare);

    await db.write();
    ctx.body = { success: true, message: '提交成功' };
  } catch (error) {
    console.error('添加数据失败:', error);

    // 错误处理：如果操作失败，返回 500 错误
    ctx.status = 500;
    ctx.body = { message: 'Server error，请重新添加' };
  }
}

export async function deleteData(ctx) {
  try {
    console.log('收到删除请求');
    const { id } = ctx.params; // 从 URL 参数中获取 ID
    console.log('要删除的数据ID:', id);
    const { pw } = ctx.query; // 从查询参数中获取密码
    console.log('要删除的数据密码:', pw);

    // 加载数据库
    const db = await loadDB();

    // 查找要删除的数据
    const result = db.data.code_shares.find(item => item.id === id); // 这里定义了 result

    if (result) {
      // 如果是加密状态，验证密码
      if (!result.isPublic && result.password !== pw) {
        ctx.body = { message: '密码错误。' };
        ctx.status = 403; // Forbidden
        return;
      }

      // 删除数据
      const index = db.data.code_shares.findIndex(item => item.id === id);
      if (index !== -1) {
        db.data.code_shares.splice(index, 1);
        // 保存更新后的数据
        await db.write();

        ctx.body = { success: true, message: '数据删除成功' };
      } else {
        ctx.status = 404;
        ctx.body = { message: '数据未找到' };
      }
    } else {
      ctx.status = 404;
      ctx.body = { message: '数据未找到' };
    }
  } catch (error) {
    console.error('删除数据失败:', error);
    ctx.status = 500;
    ctx.body = { message: 'Server error' };
  }
}

export async function updateData(ctx) {
  try {
    const { id } = ctx.params; // 从 URL 参数中获取 ID
    const updatedData = ctx.request.body; // 从请求体中获取新的数据

    // 加载数据库
    const db = await loadDB();

    // 查找要更新的数据
    const index = db.data.code_shares.findIndex(item => item.id === id);

    if (index !== -1) {
      // 替换旧的数据
      db.data.code_shares[index] = { ...db.data.code_shares[index], ...updatedData };

      // 保存更新后的数据
      await db.write();

      ctx.body = { success: true, message: '数据更新成功' };
    } else {
      ctx.status = 404;
      ctx.body = { message: '数据未找到' };
    }

  } catch (error) {
    console.error('更新数据失败:', error);
    ctx.status = 500;
    ctx.body = { message: 'Server error' };
  }
}

export async function updatePublic(ctx) {
  try {
    const { id } = ctx.params;
    const { pw } = ctx.query; // 获取查询参数中的密码
    const { isPublic, password } = ctx.request.body; // 获取请求体中的加密状态和密码

    // 查找对应的 codeShare 数据
    const codeShare = codeShares[id];

    if (!codeShare) {
      ctx.status = 404;
      ctx.body = { message: '未找到指定的代码片段' };
      return;
    }

    // 如果要切换到公开状态
    if (isPublic) {
      // 从加密切换到公开，清空密码
      codeShare.isPublic = true;
      codeShare.password = ""; // 清空密码字段

      ctx.status = 200;
      ctx.body = { message: '成功切换为公开' };
    } else {
      // 如果要切换到加密状态，验证密码
      if (codeShare.isPublic) {
        // 当前是公开状态，要切换为加密状态，且需要设置新密码
        if (!password || password.length < 4 || password.length > 8) {
          ctx.status = 400;
          ctx.body = { message: '密码长度应在4到8个字符之间' };
          return;
        }

        // 设置新的密码
        codeShare.isPublic = false;
        codeShare.password = password; // 更新密码字段

        ctx.status = 200;
        ctx.body = { message: '成功切换为加密' };
      } else {
        // 当前是加密状态，需要验证密码才能取消加密
        if (codeShare.password !== pw) {
          ctx.status = 403; // 密码错误
          ctx.body = { message: '密码错误，无法切换状态' };
          return;
        }

        // 密码验证通过，切换为公开状态并清空密码
        codeShare.isPublic = true;
        codeShare.password = ""; // 清空密码字段

        ctx.status = 200;
        ctx.body = { message: '成功切换为公开' };
      }
    }
  } catch (error) {
    console.error('更新隐私状态失败:', error);
    ctx.status = 500;
    ctx.body = { message: '服务器错误' };
  }
}
