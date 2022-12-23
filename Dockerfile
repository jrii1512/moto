FROM hayd/deno:latest

EXPOSE 7775

WORKDIR /app

ADD . /app

RUN deno cache app.js

CMD ["run", "--allow-all", "app.js"]