export interface MultiTenantUiMutation{id:string;
scope:string;
baseVersion:number;
payloadSize:number;
authorized:boolean;
idempotencyKey:string;
}
export interface MultiTenantUiDecision{accepted:boolean;
action:"commit"|"refresh"|"block"|"dedupe"|"review";
reasons:string[];
nextVersion:number;
}
export class MultiTenantUiPolicy{private seen=new Set<string>();
constructor(private version:number){}evaluate(m:MultiTenantUiMutation):MultiTenantUiDecision{const reasons:string[]=[];
if(!m.authorized)reasons.push("unauthorized");
if(m.baseVersion!==this.version)reasons.push("version-mismatch");
if(m.payloadSize>256000)reasons.push("payload-too-large");
if(this.seen.has(m.idempotencyKey))return{accepted:true,action:"dedupe",reasons:["duplicate-idempotency-key"],nextVersion:this.version};
if(reasons.includes("unauthorized"))return{accepted:false,action:"block",reasons,nextVersion:this.version};
if(reasons.includes("version-mismatch"))return{accepted:false,action:"review",reasons,nextVersion:this.version};
if(reasons.length)return{accepted:false,action:"block",reasons,nextVersion:this.version};
this.seen.add(m.idempotencyKey);
this.version+=1;
return{accepted:true,action:"commit",reasons,nextVersion:this.version};
}}
export function runMultiTenantUiPolicy(){const p=new MultiTenantUiPolicy(7);
const accepted=p.evaluate({id:"1",scope:"tenant-a",baseVersion:7,payloadSize:1024,authorized:true,idempotencyKey:"k1"});
const conflict=p.evaluate({id:"2",scope:"tenant-a",baseVersion:4,payloadSize:1024,authorized:true,idempotencyKey:"k2"});
const duplicate=p.evaluate({id:"3",scope:"tenant-a",baseVersion:8,payloadSize:1024,authorized:true,idempotencyKey:"k1"});
return{accepted,conflict,duplicate};
}
