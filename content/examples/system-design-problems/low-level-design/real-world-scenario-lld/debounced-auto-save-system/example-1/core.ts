export type DebouncedAutoSaveSystemStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface DebouncedAutoSaveSystemSnapshot{status:DebouncedAutoSaveSystemStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class DebouncedAutoSaveSystemCoordinator{private snapshot:DebouncedAutoSaveSystemSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:DebouncedAutoSaveSystemSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:DebouncedAutoSaveSystemSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:DebouncedAutoSaveSystemStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runDebouncedAutoSaveSystemScenario(){const c=new DebouncedAutoSaveSystemCoordinator();
const pending=c.start("debounced-auto-save-system:op-1",0);
const confirmed=c.settle("debounced-auto-save-system:op-1",true);
const stale=c.settle("debounced-auto-save-system:old",true);
return{invariant:"Autosave must reduce write volume without losing the latest user intent.",pending,confirmed,stale};
}
export const DebouncedAutoSaveSystemApi="markDirty, scheduleSave, flush, cancel, retry, reconcile";
