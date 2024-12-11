
import Router from 'koa-router';
import { getAllData, getData } from './controller/data.js';

const router = new Router();

router.get('/code/:id', getData);
router.get('/list', getAllData);


export default router;
