export type OfflineFormSyncSystemStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface OfflineFormSyncSystemSnapshot{status:OfflineFormSyncSystemStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class OfflineFormSyncSystemCoordinator{private snapshot:OfflineFormSyncSystemSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:OfflineFormSyncSystemSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:OfflineFormSyncSystemSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:OfflineFormSyncSystemStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runOfflineFormSyncSystemScenario(){const c=new OfflineFormSyncSystemCoordinator();
const pending=c.start("offline-form-sync-system:op-1",0);
const confirmed=c.settle("offline-form-sync-system:op-1",true);
const stale=c.settle("offline-form-sync-system:old",true);
return{invariant:"Form edits must survive reload and reconnect without silently overwriting newer server data.",pending,confirmed,stale};
}
export const OfflineFormSyncSystemApi="saveDraft, enqueuePatch, sync, resolveConflict, discardLocal";
