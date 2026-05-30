export interface VersionHistorySystemMetric{operationId:string;
phase:"accepted"|"rejected"|"settled"|"rolled-back";
durationMs:number;
reason?:string;
}
export class VersionHistorySystemDiagnostics{private events:VersionHistorySystemMetric[]=[];
record(e:VersionHistorySystemMetric){this.events.push(e);
if(this.events.length>200)this.events.shift();
}summary(){return this.events.reduce<Record<string,number>>((a,e)=>{const k=e.reason?`${e.phase}:${e.reason}`:e.phase;
a[k]=(a[k]??0)+1;
return a;
},{});
}slow(threshold:number){return this.events.filter(e=>e.durationMs>threshold).map(e=>e.operationId);
}alert(){const rejected=this.events.filter(e=>e.phase==="rejected").length;
const rollback=this.events.filter(e=>e.phase==="rolled-back").length;
return rejected>5||rollback>2?"page":"normal";
}}
export function planVersionHistorySystemRecovery(input:{mounted:boolean;
authorized:boolean;
versionGap:number;
pendingAgeMs:number}){const reasons:string[]=[];
if(!input.mounted)reasons.push("unmounted");
if(!input.authorized)reasons.push("permission-changed");
if(input.versionGap>0)reasons.push("stale-version");
if(input.pendingAgeMs>10000)reasons.push("pending-too-long");
return{mode:reasons.length?"degrade-and-reconcile":"continue",reasons,edge:"a restore request targets an old version while collaborators continue editing",structures:"version metadata, checkpoint, patch chain, author, restore token, retention policy"};
}
export function runVersionHistorySystemRecovery(){return planVersionHistorySystemRecovery({mounted:true,authorized:false,versionGap:2,pendingAgeMs:16000});
}
