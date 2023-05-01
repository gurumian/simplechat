'use strict'

const express = require('express');
var cors = require('cors')

import { v4 as uuidv4 } from 'uuid'
const bodyParser = require('body-parser')
import { Room } from './room';

const app = express();
app.use(cors({
  // origin: "*",
  credential: true
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

export class Control {
  private port: string
  private rooms: {[key:string]: Room}
  constructor(config: any) {
    if(config.hasOwnProperty('port')) {
      this.port = config['port']
    }

    this.rooms = {}
  }

  init() {
    app.post('/', (req: { body: any; }, res: { json: (arg0: { result: string; id: string; }) => void; }) => {
      let id = uuidv4()
      let name = id;
      console.log(req.body);
      let body = req.body;
      if(body.hasOwnProperty('name')) {
        name = body.name;
      }

      this.rooms[id] = new Room(name)
      res.json({
        result: 'ok',
        id: id
      })
      
      console.log(`room: ${id}:${name} has been created successfully`)
    })


    app.post('/:id/attach', (req: { params: { id: any; }; body: any; }, res: { json: (arg0: { result: string; id: any; room?: any; topic?: string; reason?: any; }) => void; }) => {
      let uuid = req.params.id
      let room = this.rooms[uuid]
      let body = req.body

      let id = uuidv4()
      let display = body.display

      room.attach(id, display)
      .then(() => {
        console.log(`source [${id}] has attached to [${uuid}] successfully`)
        res.json({
          result: 'ok',
          id: id,
          room: room.display,
          topic: `/${uuid}/${id}`
        })
      })
      .catch((err: any) => {
        console.log(err)
        res.json( {
          result: 'nok',
          id: uuid,
          reason: err
        })
      })
    })

    app.post('/:id/detach', (req: { params: { id: any; }; body: any; }, res: { json: (arg0: { result: string; id: any; }) => void; }) => {
      let uuid = req.params.id
      let room = this.rooms[uuid]
      let body = req.body

      let id = body.id
      room.detach(id)

      res.json({
        result: 'ok',
        id: uuid
      })
      console.log(`source ${id} has detached from ${uuid} successfully`)
    })

    app.post('/:id', (req: { params: { id: any; }; body: any; }, res: { json: (arg0: { result: string; reason: string; id: any; }) => void; }) => {
      let uuid = req.params.id
      let room = this.rooms[uuid]
      let body = req.body

      if(!room) {
        res.json( {
          result: 'nok',
          reason: 'no such streamer',
          id: uuid
        })
        console.log(`no such streamer ${uuid}`)
        return
      }
    })

    app.get('/', (req: any, res: {
            json: (arg0: {
                result: string;
                // data: Object.keys(this.rooms).map(key => ({id: key, name: this.rooms[key].display}))
                data: { id: string; name: any; nusers: any; }[];
            }) => void;
        }) => {
      res.json({
        result: 'ok',
        data: Object.keys(this.rooms).map(key => ({id: key, name: this.rooms[key].display, nusers: this.rooms[key].participants.length}))
      })
    })

    app.get('/:id', (req: { params: { id: any; }; }, res: { json: (arg0: { result: string; data: any; }) => void; }, next: any) => {
      let id = req.params.id
      console.log(this.rooms);
      res.json({ 
        result: 'ok',
        data: this.rooms[id].participants,
        // TODO: list
      })
    })

    app.delete('/:id', (req: { params: { id: any; }; }, res: { json: (arg0: { result: string; data: any; }) => void; }) => {
      var id = req.params.id;
      let room = this.rooms[id]
      if(room) {
        delete this.rooms[id]
        res.json( {
          result: 'ok',
          data: id
        })
        console.log(`room ${id} has been stopped successfully`)
      }
    })
  }

  start() {
    const server = app.listen(this.port, '127.0.0.1',() => {
      console.log(`server is running at ${server.address().port}`)
    })
  }
}

export default {Control}