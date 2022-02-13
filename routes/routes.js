import { Router } from '../deps.js';
import * as item from './controllers/itemController.js';

const router = new Router();

router.get('/', item.showMain);
router.get('/huolot', item.haeHuolot);
router.get('/haeKulut', item.haeOstokset);
router.get('/haeYhteenveto', item.haeYhteenveto);
router.post('/huolot', item.lisaaHuolto);


export default router.routes();
