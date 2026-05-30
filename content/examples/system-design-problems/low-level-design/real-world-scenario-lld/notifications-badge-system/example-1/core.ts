export type NotificationsBadgeSystemStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface NotificationsBadgeSystemSnapshot{status:NotificationsBadgeSystemStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class NotificationsBadgeSystemCoordinator{private snapshot:NotificationsBadgeSystemSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:NotificationsBadgeSystemSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:NotificationsBadgeSystemSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:NotificationsBadgeSystemStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runNotificationsBadgeSystemScenario(){const c=new NotificationsBadgeSystemCoordinator();
const pending=c.start("notifications-badge-system:op-1",0);
const confirmed=c.settle("notifications-badge-system:op-1",true);
const stale=c.settle("notifications-badge-system:old",true);
return{invariant:"Badge counts must converge without distracting flicker or cross-account leakage.",pending,confirmed,stale};
}
export const NotificationsBadgeSystemApi="incrementLocal, acknowledgeRead, applyServerCount, reconcile, clear";
