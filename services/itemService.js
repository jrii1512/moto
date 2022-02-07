import { client } from '../database/db.js';

//const databaseUrl = Deno.env.get("DATABASE_URL");

const huoltoKantaan = async (
    tyyppi,
    huolto,
    hetki,
    sijainti,
    huomiot,
    huoltopvm,
    kustannukset
) => {
    console.log('Syötetään huolto, itemservice');
    console.log('tyyppi:', tyyppi);
    console.log('huolto:', huolto);
    console.log('hetki:', hetki);
    console.log('sijainti:', sijainti);
    console.log('huomiot:', huomiot);
    console.log('huoltopvm:', huoltopvm);
    console.log('kustannukset:', kustannukset);

    console.log('service huomiot:', huomiot);
    await client.connect();
    await client.queryArray(
        'INSERT INTO motoService (moto, maint, moment, location, notes, maintdate, costs) VALUES($1, $2, $3, $4, $5, $6, $7)',
        tyyppi,
        huolto,
        hetki,
        sijainti,
        huomiot,
        huoltopvm,
        kustannukset
    );

    if (tyyppi.includes("Ford")){
        console.log("Ford appears so adding Ford .. and cost to costTable");
        await client.queryArray('INSERT INTO costs (item, part, cost) VALUES ($1, $2, $3)', tyyppi, huomiot, kustannukset)
    }


    await client.end();
    console.log('insert executed');
    await huolot();
};

const huolot = async () => {
    console.log('Huoltojen haku');
    await client.connect();
    const res = await client.queryArray(
        'SELECT * from motoService ORDER BY maintdate ASC'
    );
    await client.end();
    console.log('Huolot -> ' + res.rows);
    return res.rows;
};

const haeKustannukset = async () => {
    console.log('Kustannusten haku');
    await client.connect();
    const res = await client.queryArray(
        'SELECT * from costs'
    );
    await client.end();
    console.log('Kustannukset: ' + res.rows);
    return res.rows;
};




export { huoltoKantaan, huolot, haeKustannukset };
