export type ActivityFeedSystemStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface ActivityFeedSystemSnapshot{status:ActivityFeedSystemStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class ActivityFeedSystemCoordinator{private snapshot:ActivityFeedSystemSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:ActivityFeedSystemSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:ActivityFeedSystemSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:ActivityFeedSystemStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runActivityFeedSystemScenario(){const c=new ActivityFeedSystemCoordinator();
const pending=c.start("activity-feed-system:op-1",0);
const confirmed=c.settle("activity-feed-system:op-1",true);
const stale=c.settle("activity-feed-system:old",true);
return{invariant:"Feed rendering must remain stable while pagination and real-time inserts overlap.",pending,confirmed,stale};
}
export const ActivityFeedSystemApi="loadInitial, loadMore, prependEvent, dedupe, invalidate, refresh";
