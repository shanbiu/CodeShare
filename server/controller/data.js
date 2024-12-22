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
    const pw = ctx.request.url.split('?pw=')[1]; // 从查询参数中获取密码
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
    const { id } = ctx.params; // 从 URL 参数中获取 ID
    const { isPublic, password } = ctx.request.body; // 获取请求体中的加密状态和密码
    console.log('收到的更新公开状态请求:', id, isPublic, password);
    // 加载数据库
    const db = await loadDB(); // 假设 loadDB() 是加载数据库的方法

    // 查找要更新的 codeShare 数据
    const index = db.data.code_shares.findIndex(item => item.id === id);

    if (index !== -1) {
      const codeShare = db.data.code_shares[index];

      // 如果要切换到公开状态
      if (!isPublic) {
        // 从加密切换到公开，首先验证密码
        if (codeShare.password !== password) {
          ctx.status = 403; // 密码错误
          ctx.body = { message: '密码错误，无法切换状态' };
          return;
        }

        // 如果密码正确，切换为公开并清空密码
        codeShare.isPublic = true;
        codeShare.password = null; // 清空密码字段

        // 保存更新后的数据
        await db.write();

        ctx.status = 200;
        ctx.body = { message: 'success',success: true };
      } else {
        // 如果要切换到加密状态，更新密码
        codeShare.isPublic = false;
        codeShare.password = password; // 更新密码字段

        // 保存更新后的数据
        await db.write();

        ctx.status = 200;
        ctx.body = { message: 'success' ,success: true };
      }
    } else {
      ctx.status = 404;
      ctx.body = { message: '未找到指定的代码片段' };
    }
  } catch (error) {
    console.error('更新隐私状态失败:', error);
    ctx.status = 500;
    ctx.body = { message: '服务器错误' };
  }
}

export async function updateExpiration(ctx) {
  try {
    const { id } = ctx.params; // 从 URL 参数中获取 ID
    const { password, expire_at } = ctx.request.body; // 获取请求体中的密码和过期时间
    console.log('收到的更新过期时间请求:', id, password, expire_at);

    // 如果 expire_at 为 null，则不进行格式验证，直接赋值为 null
    if (expire_at !== null && isNaN(new Date(expire_at).getTime())) {
      ctx.status = 400;
      ctx.body = { message: '无效的过期时间格式。' };
      return;
    }

    // 加载数据库
    const db = await loadDB();

    // 查找要更新的数据
    const index = db.data.code_shares.findIndex(item => item.id === id);

    if (index !== -1) {
      const codeShare = db.data.code_shares[index];

      // 如果数据是加密的且传入了密码，验证密码
      if (!codeShare.isPublic && codeShare.password !== password) {
        ctx.body = { message: '密码错误，无法修改过期时间。' };
        ctx.status = 403; // Forbidden
        return;
      }

      // 更新过期时间，如果 expire_at 为 null，则直接赋值为 null
      codeShare.expire_at = expire_at === null ? null : new Date(expire_at).getTime();

      // 保存更新后的数据
      await db.write();

      ctx.status = 200;
      ctx.body = { success: true, message: '过期时间更新成功' };
    } else {
      ctx.status = 404;
      ctx.body = { message: '数据未找到' };
    }

  } catch (error) {
    console.error('更新过期时间失败:', error);
    ctx.status = 500;
    ctx.body = { message: '服务器错误' };
  }
}