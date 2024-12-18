import { fileURLToPath } from 'url'; 
import path from 'path';  
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs';

export async function loadDB() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const dbFilePath = path.resolve(__dirname, '../model/data.json');
    const defaultData = { code_shares: [] };  // 确保 code_shares 数组存在
    const adapter = new JSONFile(dbFilePath);
    const db = new Low(adapter, defaultData);

    if (!fs.existsSync(dbFilePath)) {
      fs.writeFileSync(dbFilePath, JSON.stringify(defaultData, null, 2));  // 格式化 JSON 文件内容
    }

    await db.read(); 

    return db;
  } catch (error) {
    console.error('加载数据库失败:', error.message);
    throw error;  
  }
}
