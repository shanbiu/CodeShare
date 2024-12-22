import { loadDB } from '../service/database.js';
import archiver from 'archiver';
import { PassThrough } from 'stream';


// 文件名清理函数
function sanitizeFileName(fileName) {
    return fileName.replace(/[/:*?"<>|\\]/g, '_').replace(/\s+/g, '_');
}

// 定义 language 到 extension 的映射
const languageToExtension = {
    'java': '.java',
    'javascript': '.js',
    'python': '.py',
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
        const sanitizedTitle = sanitizeFileName(title);
        console.log('代码分享标题:', sanitizedTitle);

        // 检查是否过期
        const currentTimestamp = Date.now();
        const isExpired = result.expire_at !== null && result.expire_at < currentTimestamp;

        if (isExpired) {
            ctx.body = { message: '该代码分享已过期。' };
            ctx.status = 400;
            return;
        }

        // 如果是加密的，验证密码
        if (!result.isPublic && result.password !== pw) {
            ctx.body = { message: '密码错误。' };
            ctx.status = 403; // Forbidden
            return;
        }

        const archive = archiver('zip', { zlib: { level: 9 } });

        // 监听压缩包错误
        archive.on('error', (err) => {
            ctx.status = 500;
            ctx.body = { message: '压缩包创建失败', error: err.message };
        });
        archive.on("end", function () {

            console.log("Archive wrote %d bytes", archive.pointer());
        });


        ctx.body = new PassThrough();

        archive.pipe(ctx.body);


        // 添加文件（假设 snippets 是一个数组，里面包含所有代码片段）
        result.snippets.forEach((snippet, index) => {
            const extension = languageToExtension[snippet.language] || '.txt'; // 默认是.txt
            const fileName = `${sanitizeFileName(snippet.title || `snippet_${index + 1}`)}${extension}`;

            const fileContent = snippet.code;
            archive.append(fileContent, { name: fileName });
        });
        // 完成压缩
        archive.finalize();
        console.log('压缩包创建完成');
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

        }, 10000);
    }
}