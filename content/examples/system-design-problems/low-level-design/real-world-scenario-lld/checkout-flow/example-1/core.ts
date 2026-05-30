export type CheckoutFlowStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface CheckoutFlowSnapshot{status:CheckoutFlowStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class CheckoutFlowCoordinator{private snapshot:CheckoutFlowSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:CheckoutFlowSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:CheckoutFlowSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:CheckoutFlowStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runCheckoutFlowScenario(){const c=new CheckoutFlowCoordinator();
const pending=c.start("checkout-flow:op-1",0);
const confirmed=c.settle("checkout-flow:op-1",true);
const stale=c.settle("checkout-flow:old",true);
return{invariant:"Checkout must prevent duplicate orders while making every recoverable step explicit.",pending,confirmed,stale};
}
export const CheckoutFlowApi="startCheckout, updateAddress, selectShipping, authorizePayment, placeOrder, recover";
