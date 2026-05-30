export type ThirdPartySdkIntegrationStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface ThirdPartySdkIntegrationSnapshot{status:ThirdPartySdkIntegrationStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class ThirdPartySdkIntegrationCoordinator{private snapshot:ThirdPartySdkIntegrationSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:ThirdPartySdkIntegrationSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:ThirdPartySdkIntegrationSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:ThirdPartySdkIntegrationStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runThirdPartySdkIntegrationScenario(){const c=new ThirdPartySdkIntegrationCoordinator();
const pending=c.start("third-party-sdk-integration:op-1",0);
const confirmed=c.settle("third-party-sdk-integration:op-1",true);
const stale=c.settle("third-party-sdk-integration:old",true);
return{invariant:"A third-party SDK must never block the core journey or bypass consent and privacy boundaries.",pending,confirmed,stale};
}
export const ThirdPartySdkIntegrationApi="loadSdk, initialize, invoke, timeout, disable, teardown";
