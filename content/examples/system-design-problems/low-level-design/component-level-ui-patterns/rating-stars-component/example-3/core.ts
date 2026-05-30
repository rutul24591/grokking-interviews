export interface RatingStarsComponentLayoutInput{anchor:{x:number;
y:number;
width:number;
height:number};
overlay:{width:number;
height:number};
viewport:{width:number;
height:number};
gap:number;
}export function positionRatingStarsComponent(i:RatingStarsComponentLayoutInput){const below=i.anchor.y+i.anchor.height+i.gap;
const above=i.anchor.y-i.overlay.height-i.gap;
const useAbove=below+i.overlay.height>i.viewport.height&&above>=0;
const y=useAbove?above:Math.max(0,Math.min(below,i.viewport.height-i.overlay.height));
const x=Math.max(0,Math.min(i.anchor.x,i.viewport.width-i.overlay.width));
return{x,y,placement:useAbove?"top":"bottom",clamped:x!==i.anchor.x||y!==below};
}export function runRatingStarsComponentCollisionScenario(){return positionRatingStarsComponent({anchor:{x:360,y:560,width:80,height:32},overlay:{width:240,height:180},viewport:{width:420,height:700},gap:8});
}
