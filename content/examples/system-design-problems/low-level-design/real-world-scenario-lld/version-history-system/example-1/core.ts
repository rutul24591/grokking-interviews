export type VersionHistorySystemStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface VersionHistorySystemSnapshot{status:VersionHistorySystemStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class VersionHistorySystemCoordinator{private snapshot:VersionHistorySystemSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:VersionHistorySystemSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:VersionHistorySystemSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:VersionHistorySystemStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runVersionHistorySystemScenario(){const c=new VersionHistorySystemCoordinator();
const pending=c.start("version-history-system:op-1",0);
const confirmed=c.settle("version-history-system:op-1",true);
const stale=c.settle("version-history-system:old",true);
return{invariant:"History must support preview and restore without losing the audit trail or current revision.",pending,confirmed,stale};
}
export const VersionHistorySystemApi="recordVersion, listVersions, preview, restore, compare, compact";
