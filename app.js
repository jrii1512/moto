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

configure({
    views: `${Deno.cwd()}/views/`,
});

const app = new Application({
    serverConstructor: HttpServerStd,
})

let port = 7775;
if (Deno.args.length > 0) {
    const lastArgument = Deno.args[Deno.args.length - 1];
    port = Number(lastArgument);
}

app.use(routes);
app.listen(`:${port}`);
console.log(`Listening port ${port}`)



export { app };
