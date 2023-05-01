#!/usr/bin/env node

'use strict'

import fs = require("fs")
import { v4 as uuidv4 } from 'uuid';
import { Control } from "./lib/control"

const uuid = uuidv4();

const app_name = 'simplechat'
const configFile: string = `${app_name}.json`

var args = process.argv.slice(2);
console.log('args: ', args);


function mkdir(path: string) {
  console.log(`path ${path}, ${path.length}`)
  for(var at = 0; ; ++at) {
    at = path.indexOf('/', at)
    if(at == 0) continue

    if(at == -1) at = path.length

    let tmp = path.substring(0, at)

    if (!fs.existsSync(tmp)){
      fs.mkdirSync(tmp);
    }

    if(at == path.length) break
  }
}

function loadConfig(path: string) {
  if(!fs.existsSync(path)) {
    console.log('no file!')
    fs.writeFileSync(path, JSON.stringify({
      uuid: uuid,
      port: 10089,
      log: `${require('os').homedir()}/.${app_name}`,
    }, null, 2));
  }

  return JSON.parse(fs.readFileSync(path).toString())
}

const config = loadConfig(configFile)

console.log(config)

var control = new Control(config);
control.init();
control.start();

function exitHandler(options: { cleanup: any; exit: any; }, exitCode: number) {
  if (options.cleanup) {
    setTimeout(() => {
      process.exit()
    }, 2000)
  }

  if (exitCode || exitCode === 0) console.log(`exit code ${exitCode}`)
  
  if (options.exit) {
    process.exit()
  }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}))

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {cleanup:true}))

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {cleanup:true}))
process.on('SIGUSR2', exitHandler.bind(null, {cleanup:true}))
process.on('SIGTERM', exitHandler.bind(null, {cleanup:true}))
process.on('SIGSEGV', exitHandler.bind(null, {cleanup:true}))
process.on('SIGABRT', exitHandler.bind(null, {cleanup:true}))

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {cleanup:true}))
