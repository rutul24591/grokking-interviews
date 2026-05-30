export type FeatureRolloutSystemStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface FeatureRolloutSystemSnapshot{status:FeatureRolloutSystemStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class FeatureRolloutSystemCoordinator{private snapshot:FeatureRolloutSystemSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:FeatureRolloutSystemSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:FeatureRolloutSystemSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:FeatureRolloutSystemStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runFeatureRolloutSystemScenario(){const c=new FeatureRolloutSystemCoordinator();
const pending=c.start("feature-rollout-system:op-1",0);
const confirmed=c.settle("feature-rollout-system:op-1",true);
const stale=c.settle("feature-rollout-system:old",true);
return{invariant:"Rollout evaluation must be deterministic and emergency disablement must win over cached state.",pending,confirmed,stale};
}
export const FeatureRolloutSystemApi="evaluateRollout, updateSnapshot, recordExposure, activateKillSwitch, rollback";
