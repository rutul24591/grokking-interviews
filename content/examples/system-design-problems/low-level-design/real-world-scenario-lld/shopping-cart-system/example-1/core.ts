export type ShoppingCartSystemStatus="idle"|"pending"|"confirmed"|"stale"|"conflicted"|"failed";
export interface ShoppingCartSystemSnapshot{status:ShoppingCartSystemStatus;
version:number;
operationId?:string;
evidence:string[];
}
export class ShoppingCartSystemCoordinator{private snapshot:ShoppingCartSystemSnapshot={status:"idle",version:0,evidence:[]};
private listeners=new Set<(s:ShoppingCartSystemSnapshot)=>void>();
getSnapshot(){return {...this.snapshot,evidence:[...this.snapshot.evidence]};
}subscribe(fn:(s:ShoppingCartSystemSnapshot)=>void){this.listeners.add(fn);
fn(this.getSnapshot());
return()=>this.listeners.delete(fn);
}start(operationId:string,baseVersion:number){if(baseVersion!==this.snapshot.version)return this.commit("stale",["version-mismatch"]);
return this.commit("pending",["intent-captured"],operationId);
}settle(operationId:string,ok:boolean){if(this.snapshot.operationId!==operationId)return this.commit("stale",["late-settlement-ignored"]);
return this.commit(ok?"confirmed":"failed",[ok?"authoritative-ack":"effect-failed"]);
}conflict(reason:string){return this.commit("conflicted",[reason]);
}private commit(status:ShoppingCartSystemStatus,evidence:string[],operationId?:string){this.snapshot={status,version:this.snapshot.version+1,operationId,evidence};
for(const fn of this.listeners)fn(this.getSnapshot());
return this.getSnapshot();
}}
export function runShoppingCartSystemScenario(){const c=new ShoppingCartSystemCoordinator();
const pending=c.start("shopping-cart-system:op-1",0);
const confirmed=c.settle("shopping-cart-system:op-1",true);
const stale=c.settle("shopping-cart-system:old",true);
return{invariant:"A cart update must preserve quantity, price, and inventory intent across tabs and guest-to-user merge.",pending,confirmed,stale};
}
export const ShoppingCartSystemApi="addItem, removeItem, updateQuantity, applyCoupon, mergeGuestCart, checkout";
