import { client } from '../database/db.js';
import * as l from '../logs/logger.js';

//const databaseUrl = Deno.env.get("DATABASE_URL");
debugger;

var log = [];

const tarkistaHuoltoId = async (response) => {
    console.log(tarkistaHuoltoId);
    await client.connect();
    const res = await client.queryArray(
        'SELECT huolto_id FROM huoltorekisteri ORDER BY huolto_id DESC LIMIT 1'
    );
    await client.end();
    console.log('Viimeisin huolto_id: ', res.rows[0]);
    return res.rows[0];
};

const huoltoKantaan = async (
    tyyppi,
    huolto,
    hetki,
    sijainti,
    huomiot,
    huoltopvm
) => {
    console.log('Syötetään huolto, itemservice');
    console.log('tyyppi:', tyyppi);
    console.log('huolto:', huolto);
    console.log('hetki:', hetki);
    console.log('sijainti:', sijainti);
    console.log('huomiot:', huomiot);
    console.log('huoltopvm:', huoltopvm);
    console.log('service huomiot:', huomiot);

    const huoltoid = await tarkistaHuoltoId();
    let huolto_id = parseInt(huoltoid) + 1;
    console.log(huolto_id);

    await client.connect();
    await client.queryArray(
        'INSERT INTO huoltorekisteri (huolto_id, valine, huolto, tehty, huomio) VALUES($1, $2, $3, $4, $5)',
        huolto_id,
        tyyppi,
        huolto,
        huoltopvm,
        huomiot
    );
    await client.end();
    console.log('insert executed');
};

const hankintaKantaan = async (valine, osa, kulu, mp) => {
    await client.connect();
    console.log('service, hankinta kantaan');
    await client.queryArray(
        'INSERT INTO hankinnat (valine, osa, kulu, mpay) VALUES($1, $2, $3, $4)',
        valine,
        osa,
        kulu,
        mp
    );
    await client.end();
};

const huolot = async () => {
    console.log('Huoltojen haku');
    await client.connect();
    const res = await client.queryArray(
        'SELECT * FROM huoltorekisteri ORDER BY huolto_id DESC'
    );
    await client.end();
    console.log('Huolot -> ' + res.rows);
    return res.rows;
};

const haeSumma = async () => {
    await client.connect();
    const resp = await client.queryArray(
        'SELECT valine, SUM(hankinnat.kulu) FROM hankinnat GROUP BY valine'
    );
    await client.end();
    console.log('haeSummat res paluttu: ', resp.rows);
    return resp.rows;
};

const haeMPSumma = async () => {
    await client.connect();
    const resp = await client.queryArray(
        'SELECT SUM(hankinnat.kulu) FROM hankinnat WHERE mpay = true'
    );
    await client.end();
    console.log('haeMPSummat res palauttaa: ', resp.rows);
    return resp.rows;
};

const haeHankinnat = async () => {
    console.log('Hankintojen haku');
    await client.connect();
    const res = await client.queryArray(
        'SELECT valine, osa, kulu, mpay FROM hankinnat'
    );
    await client.end();

    res.rows.forEach((element) => {
        console.log('element:', element[3]);
        if (element[3]) {
            element[3] = 'MP';
        } else {
            element[3] = '';
        }
    });
    console.log('Hankinnat: ', res.rows);

    return res.rows;
};

export {
    tarkistaHuoltoId,
    huoltoKantaan,
    hankintaKantaan,
    huolot,
    haeHankinnat,
    haeSumma,
    haeMPSumma,
};
