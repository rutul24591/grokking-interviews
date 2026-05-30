export interface FeatureRolloutSystemMetric{operationId:string;
phase:"accepted"|"rejected"|"settled"|"rolled-back";
durationMs:number;
reason?:string;
}
export class FeatureRolloutSystemDiagnostics{private events:FeatureRolloutSystemMetric[]=[];
record(e:FeatureRolloutSystemMetric){this.events.push(e);
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
export function planFeatureRolloutSystemRecovery(input:{mounted:boolean;
authorized:boolean;
versionGap:number;
pendingAgeMs:number}){const reasons:string[]=[];
if(!input.mounted)reasons.push("unmounted");
if(!input.authorized)reasons.push("permission-changed");
if(input.versionGap>0)reasons.push("stale-version");
if(input.pendingAgeMs>10000)reasons.push("pending-too-long");
return{mode:reasons.length?"degrade-and-reconcile":"continue",reasons,edge:"a cached rollout snapshot enables a broken feature after the kill switch is activated",structures:"rollout rule tree, cohort key, snapshot version, exposure id, kill-switch state, audit event"};
}
export function runFeatureRolloutSystemRecovery(){return planFeatureRolloutSystemRecovery({mounted:true,authorized:false,versionGap:2,pendingAgeMs:16000});
}
