import { Context } from 'https://deno.land/x/oak@v9.0.1/mod.ts';
import * as itemServices from '../../services/itemService.js';
import { renderFile } from '../../deps.js';
import { getIP } from 'https://deno.land/x/get_ip/mod.ts';
import { readLines } from 'https://deno.land/std/io/mod.ts';
import * as path from 'https://deno.land/std/path/mod.ts';
import { readline } from 'https://deno.land/x/readline@v1.1.0/mod.ts';
import { createRequire } from 'https://deno.land/std@0.126.0/node/module.ts';
import * as l from '../../logs/logger.js';
//var jpeg = require('jpeg-js');

var log = [];
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
            kulu;
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
            kulu
        );
        console.log('huoltoKantaan kutsuttu');
        response.redirect('/huolot');
    } catch (err) {
        console.log('Controller error, ', err);
        const errorNote = new Date() + '_error: ' + err;
        log.push(errorNote);
        loggaus(log);
    }
};

const haeYhteenveto = async ({ response }) => {
    response.body = await renderFile('../views/yhteenveto.eta', {
        summat: await itemServices.haeSumma(),
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

const lisaaKuva = async ({ request, response }) => {
    try {
        console.log('Kuvan lisäys');
        const body = request.body({ type: 'form-data' });
        const reader = body.value.read();

        // the data object has two variables: fields and files
        console.log(reader);

        // in our case, our form allows submitting only one file, so we
        // look at the details of that file
        const fileDetails = reader.files[0];

        // the file details contains relevant information about the file,
        // including a temporary folder path into which the file has been stored
        console.log('-- file details');
        console.log(fileDetails);

        await itemServices.kuvaKantaan(fileDetails);
        console.log('kuva kantaan kutsuttu');
        //response.redirect('/kuvat');
    } catch (err) {
        console.log('Controller error kuva, ', err);
        const errorNote = new Date() + '_error: ' + err;
        log.push(errorNote);
        l.loggaus(log);
    }
};

const haeKuvat = async ({ response }) => {
    console.log('haeKuvat funkkari');
    const imageFilePath = './kuvafile.jpg';
    const buf = await itemServices.haePhotot();
    const r = buf.body?.getReader();
    await Deno.writeFile(imageFilePath, new Uint8Array(buf));

    response.headers.set('Content-Type', 'image/jpeg');
    response.body = await renderFile('../views/kuvat.eta', {
        kuvatiedosto: imageFilePath.read,
    });
};

export {
    showMain,
    haeHuolot,
    lisaaHuolto,
    haeOstokset,
    haeYhteenveto,
    haeKuvat,
    lisaaKuva,
};