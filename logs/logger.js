import {
    ensureDir,
    ensureFile,
    ensureFileSync,
} from 'https://deno.land/std/fs/mod.ts';

import { format } from 'https://deno.land/std@0.91.0/datetime/mod.ts';

var log = [];

var temp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
var tDate = temp.replace(' ', '_').replace(':', '');
console.log('Dataa tiedostoon logs/appi_logs_' + tDate + '.log');

const loggaus = async (log) => {
    console.log('loggaus funktioata kutsuttu');
    ensureDir('./logs').then(() => {
        let location = './logs/appi_logs.log';

        for (let i of log) {
            console.log(i);
            Deno.writeTextFile(location, i + '\n\n', { append: true });
        }
    });
};

const showLogFile = async ({ response }) => {
    console.log('itemController, showLogFile');
    const data = await Deno.readTextFile('logs/appi_logs.log');
    console.log(data);
    response.body = await renderFile('../views/logReader.eta', {
        content: data,
        newLine: '\n',
    });
};

//https://deno.land/x/readline@v1.1.0
const showLogFileNotWorking = async ({ response }) => {
    console.log('showLogFile');
    const f = await Deno.open('logs/appi_logs.log');
    for await (const line of readline(f)) {
        response.body = await renderFile('../views/logReader.eta', {
            content: `${new TextDecoder().decode(line)}`,
        });
    }
    f.close();
};

export { loggaus, showLogFile };
