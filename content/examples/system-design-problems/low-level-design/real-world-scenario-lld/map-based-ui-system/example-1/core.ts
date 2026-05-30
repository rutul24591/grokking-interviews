export type MapBasedUiSystemStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface MapBasedUiSystemSnapshot{status:MapBasedUiSystemStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class MapBasedUiSystemCoordinator{private snapshot:MapBasedUiSystemSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:MapBasedUiSystemSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:MapBasedUiSystemSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:MapBasedUiSystemStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runMapBasedUiSystemScenario(){const c=new MapBasedUiSystemCoordinator();
const pending=c.start("map-based-ui-system:op-1",0);
const confirmed=c.settle("map-based-ui-system:op-1",true);
const stale=c.settle("map-based-ui-system:old",true);
return{invariant:"Map rendering must stay responsive while viewport queries race and marker volume grows.",pending,confirmed,stale};
}
export const MapBasedUiSystemApi="setViewport, queryBounds, cluster, selectMarker, loadDetails, cancelStale";
