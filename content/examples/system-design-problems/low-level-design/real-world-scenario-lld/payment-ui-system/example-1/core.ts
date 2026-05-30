export type PaymentUiSystemStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface PaymentUiSystemSnapshot{status:PaymentUiSystemStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class PaymentUiSystemCoordinator{private snapshot:PaymentUiSystemSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:PaymentUiSystemSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:PaymentUiSystemSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:PaymentUiSystemStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runPaymentUiSystemScenario(){const c=new PaymentUiSystemCoordinator();
const pending=c.start("payment-ui-system:op-1",0);
const confirmed=c.settle("payment-ui-system:op-1",true);
const stale=c.settle("payment-ui-system:old",true);
return{invariant:"Payment UI must never expose card data or create duplicate charges during ambiguous failures.",pending,confirmed,stale};
}
export const PaymentUiSystemApi="createAttempt, tokenizeInput, confirm, handleChallenge, retry, reconcile";
