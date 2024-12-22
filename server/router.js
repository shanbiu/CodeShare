
import Router from 'koa-router';
import { getAllData, getData, addData, deleteData, updateData, updatePublic, updateExpiration } from './controller/data.js';
import { downloadCodeShare } from './controller/download.js';

const router = new Router();

router.get('/api/code/:id', getData);
router.get('/api/list', getAllData);
router.post('/api/submit', addData);
router.delete('/api/delete/:id', deleteData);
router.put('/api/update/:id', updateData);
router.patch('/api/updatePublic/:id', updatePublic);
router.get('/api/download/:id', downloadCodeShare);
router.patch('/api/updateExpiration/:id', updateExpiration);

// router.redirect('*','/')
export default router;
