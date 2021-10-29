
import {reactive} from 'vue';

export type Sym=string;

export type Tape=string[]

export interface Operation{
  repr: string;
  action: (m:Machine) => void;
}

export class TransitionDecl{
  syms: Sym[] = []
  operations: Operation[] = []
  finalState: MConfigDecl|null = null
}

export class MConfigDecl{
  name:Sym = ''
  transitions:TransitionDecl[] = [];
  reactive(){
    return reactive(this);
  }
}

export class MachineDecl{
  configTable: MConfigDecl[] = [];
  reactive(){
    return reactive(this);
  }
  
}

export class MachineModel{
  machine = new MachineDecl().reactive()

  getMConfig(name:string){
    let mc = this.machine.configTable.find((e) => (e.name == name))
    debugger
    if(mc === undefined) {
      mc = new MConfigDecl().reactive()
      mc.name = name
      this.machine.configTable.push(mc)
    }
    return mc
  }
}


export class Transition{
  operations: Operation[]
  finalState: MConfig
  constructor(ops:Operation[], fstate:MConfig){
    this.operations = ops;
    this.finalState = fstate;
  }
}

type MConfig = Record<Sym, Transition>


export class Machine{
  tape: Tape = [];
  configTable: Record<Sym, MConfig> = {};
  cursorPos = 0;
  currentState:Sym = '';

  constructor(decl:MachineDecl){
    decl.configTable.forEach((e) => {
      this.configTable[e.name] = {}
    })
    decl.configTable.forEach((e) => {
      //TODO: raise an error if something is wrong
      const mc = this.configTable[e.name]
      e.transitions.forEach((t) => {
        t.syms.forEach( (sym) => {
          mc[sym] = new Transition(t.operations, this.configTable[t.finalState?.name || ''])
        })
      })
    })
  }
  
  reactive(){
    return reactive(this);
  }

  advance(){
    return this.configTable[this.currentState][this.tape[this.cursorPos]].operations.map( (e) => {
      return (() => e.action(this));
    });
  }

}

export const opLeft:Operation = {
  repr: '←',
  action(m: Machine){
    if(m.cursorPos == 0) {
      throw "Cursor is already at left-most position";
    }
    --m.cursorPos;
  }
};

export const opRight:Operation = {
  repr: '→',
  action(m:Machine){
    ++m.cursorPos;
    if(m.cursorPos == m.tape.length) {
      m.tape.push('');
    }
  }
}

export function opPrint(s:Sym) : Operation {
  return {
    repr:'P('+s+')',
    action(m:Machine){
      m.tape[m.cursorPos] = s;
    }
  }
}






