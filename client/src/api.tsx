import axios from 'axios';

interface Item {
  id: string;
  title: string;
  snippets: Array<{
    key: string;
    language: string;
    title: string;
    code: string;
  }>;
  tags: string[];
  create_at: string;
  isPublic: boolean;
  password: string | null;
  expire_at: string | null;
}

// 创建 Axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // 后端 API 的基础 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchItems = async () => {
  try {
    const response = await api.get('/items');
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const addItem = async (newItem: Item) => {
  try {
    const response = await api.post('/items', newItem);
    return response.data;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

export const updateItem = async (id: string, updatedItem: Item) => {
  try {
    const response = await api.put(`/items/${id}`, updatedItem);
    return response.data;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

export const deleteItem = async (id: string) => {
  try {
    await api.delete(`/items/${id}`);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};
