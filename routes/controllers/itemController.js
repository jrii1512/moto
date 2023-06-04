import { Context } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import * as itemServices from "../../services/itemService.js";
import { renderFile } from "../../deps.js";
import { getIP } from "https://deno.land/x/get_ip/mod.ts";
import { readLines } from "https://deno.land/std/io/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";
import * as base64 from "https://deno.land/x/base64@v0.2.1/mod.ts";

import {
  decode as base64Decode,
  encode as base64Encode,
} from "https://deno.land/std@0.82.0/encoding/base64.ts";

import * as l from "../../logs/logger.js";
//var jpeg = require('jpeg-js');

var log = [];
var imageFilePath = "";
debugger;

const loggedIn = sessionStorage.getItem("loggedIn")

const showLogin = async ({ response }) => {
  console.log("Login view called");

  if (loggedIn === "false") {
    response.body = await renderFile("../views/login.eta");
  } else {
    response.body = await renderFile("../views/yhteenveto.eta");
  }
};

const showFeatures = async ({ response }) => {
  console.log("showFeatures called");
  response.body = await renderFile("../views/start.eta");
};

const loginCheck = async ({ request, response }) => {
  const body = request.body();
  const loginData = await body.value;
  console.log("loginFormi ", loginData);
  const pwd = loginData.get("pword");
  const d = new Date().getDate();
  const m = new Date().getMonth() + 1;
  const y = new Date().getFullYear().toString().slice(-2);
  const daypasswd = d.toString() + m.toString() + y.toString();
  console.log("Päivän sana:", daypasswd);

  if (pwd === daypasswd) {
    console.log("correct the mondo");
    response.redirect("/features");
    sessionStorage.setItem("loggedin", true);
  } else {
    console.log("not so correct");
  }
  return response;
};

const lisaaHuolto = async ({ request, response }) => {
  try {
    console.log("Huolon lisäys");
    const body = request.body();
    const formData = await body.value;
    console.log("formi ", formData);
    const tyyppi = formData.get("mototyyppi");
    const huolto = formData.get("huolto");
    const hetki = formData.get("hetki");
    const sijainti = formData.get("sijainti");
    const huomiot = formData.get("huomiot");
    const osa = formData.get("osa");
    const kulu = formData.get("kulu");
    const mp = formData.get("mp");
    const huoltopvm = formData.get("hPVM");

    let lisaysStr =
      new Date() +
      ": itemController, huolto lisätään seuraavilla parametreillä: " +
      tyyppi +
      ", " +
      huolto +
      ", " +
      hetki +
      ", " +
      sijainti +
      ", " +
      huomiot +
      ", " +
      huoltopvm;
    console.log(lisaysStr);
    log.push(lisaysStr);
    l.loggaus(log);

    await itemServices.huoltoKantaan(
      tyyppi,
      huolto,
      hetki,
      sijainti,
      huomiot,
      huoltopvm
    );
    console.log("huoltoKantaan kutsuttu");
    response.redirect("/");
  } catch (err) {
    console.log("Controller error, ", err);
    const errorNote = new Date() + "_error: " + err;
    log.push(errorNote);
    l.loggaus(log);
  }
};

const lisaaHankinta = async ({ request, response }) => {
  try {
    console.log("Hankinnan lisäys");
    const body = request.body();
    const formData = await body.value;
    console.log("hankinta formi ", formData);
    const valine = formData.get("valine");
    const osa = formData.get("osa");
    const kulu = formData.get("kulu");
    const mp = formData.get("mp");

    let lisaysStr =
      new Date() +
      ": itemController, hankinta lisätään seuraavilla parametreillä: " +
      valine +
      ", " +
      osa +
      ", " +
      kulu +
      "," +
      mp;
    console.log(lisaysStr);
    log.push(lisaysStr);
    l.loggaus(log);

    await itemServices.hankintaKantaan(valine, osa, kulu, mp);
    console.log("Controller, hankintaKantaan kutsuttu");
    response.redirect("/");
  } catch (err) {
    console.log("Controller error, ", err);
    const errorNote = new Date() + "_error: " + err;
    log.push(errorNote);
    l.loggaus(log);
  }
};

const haeYhteenveto = async ({ response }) => {
  response.body = await renderFile("../views/yhteenveto.eta", {
    summat: await itemServices.haeSumma(),
  });
};

const haeMPYhteenveto = async ({ response }) => {
  console.log("Controller, haeMPYhteenveto");
  response.body = await renderFile("../views/mp.eta", {
    mpsumma: await itemServices.haeMPSumma(),
  });
};

const haeOstokset = async ({ response }) => {
  response.body = await renderFile("../views/kulut.eta", {
    kustannukset: await itemServices.haeHankinnat(),
  });
};

const haeHuolot = async ({ response }) => {
  response.body = await renderFile("../views/huolot.eta", {
    huolot: await itemServices.huolot(),
  });
};

export {
  showLogin,
  loginCheck,
  showFeatures,
  haeHuolot,
  lisaaHuolto,
  lisaaHankinta,
  haeOstokset,
  haeYhteenveto,
  haeMPYhteenveto,
};
