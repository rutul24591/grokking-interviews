export type MultiTenantUiStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface MultiTenantUiSnapshot{status:MultiTenantUiStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class MultiTenantUiCoordinator{private snapshot:MultiTenantUiSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:MultiTenantUiSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:MultiTenantUiSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:MultiTenantUiStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runMultiTenantUiScenario(){const c=new MultiTenantUiCoordinator();
const pending=c.start("multi-tenant-ui:op-1",0);
const confirmed=c.settle("multi-tenant-ui:op-1",true);
const stale=c.settle("multi-tenant-ui:old",true);
return{invariant:"Tenant switching must never reuse data, permissions, or caches from another tenant.",pending,confirmed,stale};
}
export const MultiTenantUiApi="switchTenant, loadTenantState, authorize, clearScopedCaches, render";
