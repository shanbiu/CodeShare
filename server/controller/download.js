import { loadDB } from '../service/database.js';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import koaSend from 'koa-send';

// 获取当前文件所在目录的路径，并确保拼接正确
const tempDir = path.resolve('model', 'temp');
console.log('临时目录路径:', tempDir);  // 打印临时目录路径

// 文件名清理函数
function sanitizeFileName(fileName) {
    return fileName.replace(/[\/:*?"<>|\\]/g, '_').replace(/\s+/g, '_');
}

// 定义 language 到 extension 的映射
const languageToExtension = {
    'java': '.java',
    'javascript': '.js',
    'python': '.py',
    'html': '.html',
    'css': '.css',
    'json': '.json',
    'text': '.txt',
}

export async function downloadCodeShare(ctx) {
    let db = null;
    try {
        const { id } = ctx.params; // 获取 ID 参数
        const { pw } = ctx.query; // 获取密码（如果有）

        console.log('请求的 ID:', id);
        console.log('请求的密码:', pw);

        // 加载数据库
        db = await loadDB();
        const result = db.data.code_shares.find(item => item.id === id);

        if (!result) {
            ctx.status = 404;
            ctx.body = { message: 'Data not found' };
            return;
        }

        const title = result.title;
        console.log('代码分享标题:', title);

        // 检查是否过期
        const currentTimestamp = Date.now();
        const isExpired = result.expire_at!== null && result.expire_at < currentTimestamp;

        if (isExpired) {
            ctx.body = { message: '该代码分享已过期。' };
            ctx.status = 400;
            return;
        }

        // 如果是加密的，验证密码
        if (!result.isPublic && result.password!== pw) {
            ctx.body = { message: '密码错误。' };
            ctx.status = 403; // Forbidden
            return;
        }

        // 创建临时目录
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
            console.log('临时目录已创建:', tempDir);
        } else {
            console.log('临时目录已存在:', tempDir);
        }

        const sanitizedTitle = sanitizeFileName(title); // 替换文件名中的空格为下划线
        const zipFilePath = path.join(tempDir, `${sanitizedTitle}.zip`);
        console.log('压缩包的路径:', zipFilePath);  // 打印压缩包路径

        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        // 监听压缩包错误
        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);

        // 添加文件（假设 snippets 是一个数组，里面包含所有代码片段）
        result.snippets.forEach((snippet, index) => {
            const extension = languageToExtension[snippet.language] || '.txt'; // 默认是.txt
            const fileName = `${sanitizeFileName(snippet.title || `snippet_${index + 1}`)}${extension}`;
            const filePath = path.join(tempDir, fileName);
            console.log(`创建临时文件路径: ${filePath}`);  // 打印临时文件路径

            fs.writeFileSync(filePath, snippet.code);

            archive.file(filePath, { name: fileName });
        });

        // 完成压缩
        await archive.finalize();
        console.log('压缩包创建完成');

        // 使用 koa-send 发送文件
        let relativePath = path.join('model', 'temp', sanitizedTitle + '.zip');
        await koaSend(ctx, relativePath);
        console.log('文件发送完成');
    } catch (error) {
        console.error('下载文件失败:', error);
        ctx.status = 500;
        ctx.body = { message: '服务器内部错误', error: error.message || error };
    } finally {
        // 执行关闭数据库连接和文件删除操作
        setTimeout(async () => {
            // 关闭数据库连接（假设loadDB返回的对象有对应的close方法来关闭连接）
            if (db && typeof db.close === 'function') {
                await db.close();
                console.log('数据库连接已关闭');
            }

            // 文件删除处理，只有当文件成功发送（没有抛出异常走到finally块）才尝试删除临时文件和文件夹
            try {
                if (fs.existsSync(tempDir)) {
                    await fs.promises.rm(tempDir, { recursive: true, force: true });
                    console.log('临时文件夹已删除');
                }
            } catch (deleteError) {
                console.error('删除临时文件夹及文件失败:', deleteError);
            }
        }, 10000);
    }
}