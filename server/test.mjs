import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs';


// 配置数据库，指定正确的文件路径
const dbFilePath = '../server/model/data.json';
// 这里提供一个默认的数据对象，比如空对象，你可以替换成符合你业务需求的初始数据结构
const defaultData = {};
const adapter = new JSONFile(dbFilePath);
const db = new Low(adapter, defaultData);  // 在顶部初始化db，并传入默认数据

// 初始化数据库
async function initializeDb() {
  // 检查文件是否存在，不存在则创建一个空的 data.json 文件
  if (!fs.existsSync(dbFilePath)) {
    console.log('File does not exist. Creating a new one...');
    fs.writeFileSync(dbFilePath, '{}'); // 创建一个空文件
  }

  // 读取数据库
  await db.read();
  // 如果数据库为空，初始化数据结构
  if (!db.data) {
    console.log('Initializing database with default data...');
    db.data = { code_shares: [] }; // 默认数据结构
    await db.write(); // 写入默认数据
  } else {
    // 如果数据库已有数据，确保至少有 code_shares 数组
    db.data.code_shares ||= [];
    await db.write();
  }
}

// 获取所有代码分享
async function getCodeShares() {
  await db.read();
  return db.data.code_shares;
}

// 添加新的代码分享
async function addCodeShare(newCodeShare) {
  await db.read();
  db.data.code_shares.push(newCodeShare); // 将新分享添加到数组
  await db.write(); // 保存更改
}

// 示例：初始化数据库，添加一个代码分享并打印所有分享
async function test() {
  await initializeDb(); // 确保数据库被正确初始化
  const codeShares = await getCodeShares(); // 获取所有代码分享
  console.log(codeShares); // 打印所有代码分享
}

test(); // 运行测试
