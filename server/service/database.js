import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs';

export async function loadDB() {
  try {

    // 配置数据库，指定正确的文件路径
    const dbFilePath = './model/data.json';
    const defaultData = {};
    const adapter = new JSONFile(dbFilePath);
    const db = new Low(adapter, defaultData);

    if (!fs.existsSync(dbFilePath)) {
      console.log('File does not exist. Creating a new one...');
      fs.writeFileSync(dbFilePath, '{}'); 
    }

    await db.read();

    // 返回数据库实例
    return db;

  } catch (error) {
    console.error('加载数据库失败:', error);
  }
}
