export type FeatureFlagSystemStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface FeatureFlagSystemSnapshot{status:FeatureFlagSystemStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class FeatureFlagSystemCoordinator{private snapshot:FeatureFlagSystemSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:FeatureFlagSystemSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:FeatureFlagSystemSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:FeatureFlagSystemStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runFeatureFlagSystemScenario(){const c=new FeatureFlagSystemCoordinator();
const pending=c.start("feature-flag-system:op-1",0);
const confirmed=c.settle("feature-flag-system:op-1",true);
const stale=c.settle("feature-flag-system:old",true);
return{invariant:"Flag evaluation must be deterministic, observable, and fail safely for risky features.",pending,confirmed,stale};
}
export const FeatureFlagSystemApi="evaluate, subscribe, refreshSnapshot, overrideForTest, clearOverride";
