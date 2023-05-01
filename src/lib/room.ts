'use strict';

class Participant {
  constructor(public id: string, public display: string) {
    console.log(`id: ${id}, display-name: ${display}`)
  }
}

export class Room {
  // public opaque: object
  private _participants: {[key:string]: Participant}
  constructor(public display: string) {
    // this.opaque = {}
    this._participants = {}
  }

  public get participants(): Participant[] {
    return Object.values(this._participants);
  }
  
  /**
   * 
   * @param id publisher id
   * @param uri address to attach
   */
    attach(id: string, display: string): Promise<void> {
      return new Promise((res, rej) => {
        this._participants[id] = new Participant(id, display)
        res()
    })
  }

  /**
   * 
   * @param id publisher id
   */
    detach(id: string): Promise<void> {
      return new Promise((res, rej) => {
        res()
        delete this._participants[id]
    })
  }
}