
import {ref, reactive, watch} from 'vue';

export type Sym=string;

export type Tape=string[]

export interface Operation{
  repr: string;
  exec: (m:MachineExecution) => ((m:MachineExecution) => void);
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

type CompiledTransition = [string, Operation[]]
type CompiledMConfig = Record<string, CompiledTransition>
type CompiledMachine = Record<string, CompiledMConfig> 

export class MachineDecl{
  configTable:MConfigDecl[] = [];
  reactive(){
    return reactive(this);
  }

  compile(){
    const rv:CompiledMachine = {}
    this.configTable.forEach( (mc) => {
      const rmc:CompiledMConfig = rv[mc.name] = {}
      mc.transitions.forEach((t) => {
        t.syms.forEach((s) => {
          if(t.finalState === null) {
            throw "ERROR : m-config `"+mc.name+"` : transition for symbol `"+s+"` has no final state"
          }
          rmc[s] = [t.finalState.name, t.operations]
        })
      })
    })
    return rv
  }
}

export class MachineModel{
  machine = new MachineDecl().reactive()

  getMConfig(name:string){
    let mc = this.machine.configTable.find((e) => (e.name == name))
    if(mc === undefined) {
      mc = new MConfigDecl().reactive()
      mc.name = name
      this.machine.configTable.push(mc)
    }
    return mc
  }
}

interface HistoryState{
  mconfig: Sym,
  symbol: Sym,
  operations: Operation[],
  reverse : ((m:MachineExecution)=>void)[],
}

interface History {
  states:HistoryState[],
  current:number,
  currentOp:number,
}

export class MachineExecution{
  static readonly BEGIN: unique symbol = Symbol()
  shouldRecompile=true
  model:MachineModel
  tape: Tape = reactive(['_', '_'])
  cursorPos = ref(0)
  initState:Sym|null = null

  
  history: History = reactive({
    states: [],
    current: 0,
    currentOp: 0,
  })


  
  stopWatch: null | (()=>void)
  machine: null|CompiledMachine=null
  constructor(_model:MachineModel){
    this.model = _model
    this.stopWatch = watch( _model.machine, () => this.shouldRecompile = true, { deep:true })
  }
  destroy(){
    this.stopWatch?.()
    this.stopWatch = null
  }
  recompile(){
    if(this.shouldRecompile) {
      this.machine = this.model.machine.compile()
      if(Object.keys(this.machine).length == 0) {
        throw "Can't use a machine with no state..."
      }
      
      const mc:Sym = (this.initState
        ? this.initState
        : (this.machine.init === undefined
          ? Object.keys(this.machine)[0]
          : "init"
        )
      )
      const s:Sym = this.tape[this.cursorPos.value]
      this.history.states = [{
          mconfig : mc,
          symbol : s,
          operations: this.machine[mc][s][1],
          reverse : []
        }]
      this.history.current = 0
      this.history.currentOp = 0
      this.shouldRecompile = false;
    }
  }
  currentState(){
    return this.history.states.length > 0 ? this.history.states[this.history.current] : null
  }
  stepForward(){
    this.recompile()
    const h = this.history
    const current = this.currentState() as HistoryState
    if(! (h.currentOp >= current.operations.length)){
      current.reverse[h.currentOp] = current.operations[h.currentOp].exec(this);
    }
    if(this.tape[this.cursorPos.value] === undefined) {
      this.tape[this.cursorPos.value] = '_'
    }
    if(++h.currentOp >= current.operations.length) {
      const nmc = (this.machine as CompiledMachine)[current.mconfig][current.symbol][0]
      const nsym = this.tape[this.cursorPos.value]
      h.states[++h.current] = {
        mconfig : nmc,
        symbol : nsym,
        operations : (this.machine as CompiledMachine)[nmc][nsym][1],
        reverse: []
      }
      h.currentOp = 0
    }
  }
  stepBackward(){
    this.recompile()
    const h = this.history
    if(--h.currentOp < 0){
      if(h.current == 0) {
        throw MachineExecution.BEGIN
      }
      --h.current
      h.currentOp = this.history.states[h.current].operations.length - 1
      if(h.currentOp < 0) {
        h.currentOp = 0
      }
    }
    const current = this.currentState()as HistoryState
    if(!(h.currentOp < 0)) {
      current.reverse[h.currentOp](this)
    }
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


interface MoveOperation extends Operation{
  reverse: (m:MachineExecution) => void
}

export const opLeft: MoveOperation = {
  repr: '←',
  reverse(m:MachineExecution){
    ++m.cursorPos.value
  },
  exec(m: MachineExecution){
    if(m.cursorPos.value == 0) {
      throw "Cursor is already at left-most position";
    }
    --m.cursorPos.value;
    return opLeft.reverse
  }
};

export const opRight:MoveOperation = {
  repr: '→',
  reverse(m:MachineExecution){
    --m.cursorPos.value
  },
  exec(m:MachineExecution){
    ++m.cursorPos.value;
    if(m.cursorPos.value == m.tape.length) {
      m.tape.push('');
    }
    return opRight.reverse
  }
}

export function opPrint(s:Sym) : Operation {
  return {
    repr:'P('+s+')',
    exec(m:MachineExecution){
      const prev = m.tape[m.cursorPos.value]
      m.tape[m.cursorPos.value] = s
      return (_m:MachineExecution) => { 
        m.tape[m.cursorPos.value] = prev;
      }
    }
  }
}






