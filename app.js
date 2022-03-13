//import { fcgi } from 'https://deno.land/x/fcgi@v0.0.21/mod.ts';
import {
    Application,
    HttpServerStd,
    Router,
    Context,
} from 'https://deno.land/x/oak@v9.0.1/mod.ts';
import routes from './routes/routes.js';
import { configure } from './deps.js';
import { listenAndServe } from 'https://deno.land/std@0.113.0/http/server.ts';


/*
console.log(`Started on [::1]:7775`);
fcgi.listen('[::1]:7775', '', async (req) => {
    console.log(req.url);
    req.responseHeaders.set('Content-Type', 'text/html');
    await req.respond({
        body: 'Your cookies: ' + JSON.stringify([...req.cookies.entries()]),
    });
});
*/

configure({
    views: `${Deno.cwd()}/views/`,
});

const app = new Application({
    serverConstructor: HttpServerStd,
});

let port = 7775;
if (Deno.args.length > 0) {
    const lastArgument = Deno.args[Deno.args.length - 1];
    port = Number(lastArgument);
}

app.use(routes);

app.listen(`:${port}`);

export { app };
