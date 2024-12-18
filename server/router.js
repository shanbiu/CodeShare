
import Router from 'koa-router';
import { getAllData, getData , addData } from './controller/data.js';

const router = new Router();

router.get('/code/:id', getData);
router.get('/list', getAllData);
router.post('/submit', addData);
export default router;
