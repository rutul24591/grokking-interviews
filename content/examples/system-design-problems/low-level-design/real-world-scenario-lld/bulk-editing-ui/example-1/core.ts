export type BulkEditingUiStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface BulkEditingUiSnapshot{status:BulkEditingUiStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class BulkEditingUiCoordinator{private snapshot:BulkEditingUiSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:BulkEditingUiSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:BulkEditingUiSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:BulkEditingUiStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runBulkEditingUiScenario(){const c=new BulkEditingUiCoordinator();
const pending=c.start("bulk-editing-ui:op-1",0);
const confirmed=c.settle("bulk-editing-ui:op-1",true);
const stale=c.settle("bulk-editing-ui:old",true);
return{invariant:"Bulk edits must make partial failure, validation, and rollback visible before destructive commit.",pending,confirmed,stale};
}
export const BulkEditingUiApi="select, updateDraft, preview, commitBatch, cancel, retryFailed";
