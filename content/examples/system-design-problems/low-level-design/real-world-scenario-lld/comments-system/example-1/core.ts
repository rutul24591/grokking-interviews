export type CommentsSystemStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface CommentsSystemSnapshot{status:CommentsSystemStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class CommentsSystemCoordinator{private snapshot:CommentsSystemSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:CommentsSystemSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:CommentsSystemSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:CommentsSystemStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runCommentsSystemScenario(){const c=new CommentsSystemCoordinator();
const pending=c.start("comments-system:op-1",0);
const confirmed=c.settle("comments-system:op-1",true);
const stale=c.settle("comments-system:old",true);
return{invariant:"Comment state must preserve ordering, moderation, and optimistic intent under retries.",pending,confirmed,stale};
}
export const CommentsSystemApi="loadThread, submit, edit, delete, react, reconcile";
