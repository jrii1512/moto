import { Router } from '../deps.js';
import * as item from './controllers/itemController.js';

const router = new Router();

router.get('/', item.showMain);
router.get('/huolot', item.haeHuolot);
router.get('/haeKulut', item.haeOstokset);
router.get('/haeYhteenveto', item.haeYhteenveto);
router.post('/huolot', item.lisaaHuolto);

router.get('/haeKuvat', item.haeKuvat);
router.post('/postaaKuva', item.lisaaKuva);


export default router.routes();
