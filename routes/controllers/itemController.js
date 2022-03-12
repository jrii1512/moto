import { Context } from 'https://deno.land/x/oak@v9.0.1/mod.ts';
import * as itemServices from '../../services/itemService.js';
import { renderFile } from '../../deps.js';
import { getIP } from 'https://deno.land/x/get_ip/mod.ts';
import { readLines } from 'https://deno.land/std/io/mod.ts';
import * as path from 'https://deno.land/std/path/mod.ts';
import { readline } from 'https://deno.land/x/readline@v1.1.0/mod.ts';
import * as base64 from 'https://deno.land/x/base64@v0.2.1/mod.ts';

import {
    decode as base64Decode,
    encode as base64Encode,
} from 'https://deno.land/std@0.82.0/encoding/base64.ts';

import * as l from '../../logs/logger.js';
//var jpeg = require('jpeg-js');

var log = [];
var imageFilePath = '';
debugger;

const showMain = async ({ response }) => {
    console.log('showMain called');
    response.body = await renderFile('../views/start.eta');
};

const lisaaHuolto = async ({ request, response }) => {
    try {
        console.log('Huolon lisäys');
        const body = request.body();
        const formData = await body.value;
        console.log('formi ', formData);
        const tyyppi = formData.get('mototyyppi');
        const huolto = formData.get('huolto');
        const hetki = formData.get('hetki');
        const sijainti = formData.get('sijainti');
        const huomiot = formData.get('huomiot');
        const osa = formData.get('osa');
        const kulu = formData.get('kulu');
        const mp = formData.get('mp');
        const huoltopvm = formData.get('hPVM');

        let lisaysStr =
            new Date() +
            ': itemController, huolto lisätään seuraavilla parametreillä: ' +
            tyyppi +
            ', ' +
            huolto +
            ', ' +
            hetki +
            ', ' +
            sijainti +
            ', ' +
            huomiot +
            ', ' +
            huoltopvm +
            ', ' +
            osa +
            ', ' +
            kulu +
            ',' +
            mp;
        console.log(lisaysStr);
        log.push(lisaysStr);
        l.loggaus(log);

        await itemServices.huoltoKantaan(
            tyyppi,
            huolto,
            hetki,
            sijainti,
            huomiot,
            huoltopvm,
            osa,
            kulu,
            mp
        );
        console.log('huoltoKantaan kutsuttu');
        response.redirect('/huolot');
    } catch (err) {
        console.log('Controller error, ', err);
        const errorNote = new Date() + '_error: ' + err;
        log.push(errorNote);
        l.loggaus(log);
    }
};

const lisaaHankinta = async ({ request, response }) => {
    try {
        console.log('Hankinnan lisäys');
        const body = request.body();
        const formData = await body.value;
        console.log('hankinta formi ', formData);
        const osa = formData.get('osa');
        const kulu = formData.get('kulu');
        const mp = formData.get('mp');

        let lisaysStr =
            new Date() +
            ': itemController, hankinta lisätään seuraavilla parametreillä: ' +
            osa +
            ', ' +
            kulu +
            ',' +
            mp;
        console.log(lisaysStr);
        log.push(lisaysStr);
        l.loggaus(log);

        await itemServices.hankintaKantaan(osa, kulu, mp);
        console.log('hankintaKantaan kutsuttu');
        response.redirect('/hankinnat');
    } catch (err) {
        console.log('Controller error, ', err);
        const errorNote = new Date() + '_error: ' + err;
        log.push(errorNote);
        l.loggaus(log);
    }
};

const haeYhteenveto = async ({ response }) => {
    response.body = await renderFile('../views/yhteenveto.eta', {
        summat: await itemServices.haeSumma(),
    });
};

const haeMPYhteenveto = async ({ response }) => {
    console.log('Controller, haeMPYhteenveto');
    response.body = await renderFile('../views/mp.eta', {
        mpsumma: await itemServices.haeMPSumma(),
    });
};

const haeOstokset = async ({ response }) => {
    response.body = await renderFile('../views/kulut.eta', {
        kustannukset: await itemServices.haeHankinnat(),
    });
};

const haeHuolot = async ({ response }) => {
    response.body = await renderFile('../views/huolot.eta', {
        huolot: await itemServices.huolot(),
    });
};

export {
    showMain,
    haeHuolot,
    lisaaHuolto,
    lisaaHankinta,
    haeOstokset,
    haeYhteenveto,
    haeMPYhteenveto,
};
