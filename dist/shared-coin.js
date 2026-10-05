/* One physical coin, shared by four scroll scenes. Local anchors retain geometry. */
(() => {
  function init(){
    const hero=document.querySelector('.hero-coin-anchor'),radar=document.querySelector('.radar-core'),flow=document.querySelector('.flow-token'),anatomy=document.querySelector('.anatomy-model>[data-part="coin"]');
    if(!hero||!radar||!flow||!anatomy)return;
    const layer=document.createElement('div');layer.className='shared-coin';layer.setAttribute('aria-hidden','true');
    layer.innerHTML='<div class="shared-coin-halo"></div><svg viewBox="-58 -58 116 116" fill="none"><path class="shared-rear"/><path class="shared-rim"/><path class="shared-front"/><path class="shared-reeding"/><g class="shared-face"><circle r="39"/><circle r="35"/><path d="M0-29V29M13-17C7-29-16-24-15-10C-14 3 16-3 15 12C14 27-10 28-16 16"/></g></svg>';
    document.body.append(layer);
    const ns='http://www.w3.org/2000/svg',anchor=document.createElementNS(ns,'circle');anchor.setAttribute('r','44');anchor.setAttribute('class','journey-anchor');anatomy.append(anchor);
    document.documentElement.classList.add('shared-coin-ready');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const clamp=n=>Math.max(0,Math.min(1,n)),mix=(a,b,p)=>a+(b-a)*p;
    const read=(el,diameter)=>{let r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2,size:diameter||Math.max(r.width,r.height)};};
    const paths=['rear','rim','front','reeding','face'].map(name=>layer.querySelector('.shared-'+name));
    const ring=(z,c,s)=>Array.from({length:65},(_,i)=>{let t=i/64*Math.PI*2;return[44*Math.cos(t)*c+z*s,44*Math.sin(t)]});
    const outline=pts=>pts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join('')+'Z';
    let angle=.45,last=0,departure=null;
    // Restoring a later section must not depend on replaying the first trade.
    const resume=window.shieldScrollResume;
    const resumeSection=resume?.section==='closing'?document.querySelector('.closing'):document.getElementById(resume?.section||'');
    const anatomySection=document.querySelector('#product');
    let restoredBeyondFlow=Boolean(resumeSection&&(resumeSection===anatomySection||(anatomySection.compareDocumentPosition(resumeSection)&Node.DOCUMENT_POSITION_FOLLOWING)));
    function drawCoin(){
      const c=Math.cos(angle),s=Math.sin(angle),z=c>=0?6:-6,front=ring(z,c,s),rear=ring(-z,c,s);let rim='',reed='';
      for(let i=0;i<64;i++){if(-Math.cos((i+.5)/64*Math.PI*2)*s<=0)continue;rim+=outline([front[i],front[i+1],rear[i+1],rear[i]]);if(i%2===0)reed+=`M${front[i][0]} ${front[i][1]}L${rear[i][0]} ${rear[i][1]}`;}
      paths[0].setAttribute('d',outline(rear));paths[1].setAttribute('d',rim);paths[2].setAttribute('d',outline(front));paths[3].setAttribute('d',reed);paths[4].setAttribute('transform',`matrix(${Math.abs(c)} 0 0 1 ${z*s} 0)`);
    }
    function frame(now){
      requestAnimationFrame(frame);if(document.hidden)return;
      if(window.shieldScrollRestoring){layer.style.opacity='0';return;}
      const dt=last?Math.min(now-last,60):0;last=now;
      if(!reduced.matches)angle+=dt*Math.PI/4000;
      const flowPoint=read(flow);
      const points=[read(hero),read(radar),flowPoint,read(anchor)];
      const diagram=document.querySelector('.flow-diagram');
      const nextTop=anatomySection.getBoundingClientRect().top;
      if(nextTop>=innerHeight*.9)restoredBeyondFlow=false;
      const flowFirst=diagram.dataset.firstTrade!=='complete'&&!restoredBeyondFlow;
      const departureStart=nextTop+scrollY-innerHeight*.9;
      if(nextTop>=innerHeight*.9||flowFirst)departure=null;
      else if(!departure)departure={x:flowPoint.x,pageY:flowPoint.y+scrollY,size:flowPoint.size};
      if(departure)points[2]={x:departure.x,y:departure.pageY-scrollY,size:departure.size};
      let current=points[0],index=0,travel=0,depositOpacity=1;
      for(let i=0;i<3;i++){
        if(i===2&&(flowFirst||nextTop>=innerHeight*.9))break;
        const a=points[i],b=points[i+1];
        const anatomySection=document.querySelector('#product'),stage=document.querySelector('.anatomy-stage');
        const arrival=nextTop+scrollY+parseFloat(getComputedStyle(anatomySection).paddingTop)-parseFloat(getComputedStyle(stage).top);
        const start=i===2?departureStart:a.y+scrollY-innerHeight*.32,end=i===2?arrival:b.y+scrollY-innerHeight*.55;
        if(scrollY<start)break;
        const p=clamp((scrollY-start)/Math.max(1,end-start));
        if(p>=1){current=b;index=i+1;continue;}
        if(reduced.matches){current=p<.5?a:b;index=p<.5?i:i+1;break;}
        // Smooth sideways arc; the vertical path tracks natural document scrolling.
        const eased=p*p*(3-2*p);
        current={x:mix(a.x,b.x,eased)+Math.sin(p*Math.PI)*Math.min(70,innerWidth*.08),y:mix(a.y,b.y,p),size:mix(a.size,b.size,eased)+Math.sin(p*Math.PI)*12};
        travel=Math.sin(p*Math.PI);index=i;if(i===1)depositOpacity=1-clamp((p-.88)/.12);break;
      }
      const restoredArrival=nextTop+parseFloat(getComputedStyle(anatomySection).paddingTop)-parseFloat(getComputedStyle(document.querySelector('.anatomy-stage')).top);
      if(restoredBeyondFlow&&restoredArrival<=1){current=points[3];index=3;travel=0;depositOpacity=1;}
      let opacity=depositOpacity;let walletClip=0;
      if(index===0&&!travel)opacity=document.querySelector('[data-institution="hero"]').dataset.formation==='forming'?.3:1;
      if(index===2&&!travel){
        const t=+diagram.dataset.flowTime||0;opacity=t<1?clamp((t-.7)/.3):t<(innerWidth>700?12.6:10.2)?1:parseFloat(flow.style.opacity)||0;
        if(t<1.2){const wallet=document.querySelector('#fund-wallet').getBoundingClientRect(),mouth=wallet.top+wallet.height/2-12;
          walletClip=clamp((current.y+current.size*.66-mouth)/(current.size*1.32))*100;}
      }
      if(index===3&&!travel)opacity=parseFloat(getComputedStyle(anatomy).opacity);
      if(current.y<-100||current.y>innerHeight+100||document.querySelector('dialog[open]'))opacity=0;
      const size=Math.max(22,current.size)*116/88;
      Object.assign(layer.style,{left:current.x+'px',top:current.y+'px',width:size+'px',height:size+'px',opacity:String(opacity)});
      layer.style.setProperty('--journey-blur',String(travel));
      layer.querySelector('svg').style.clipPath=walletClip?`inset(0 0 ${walletClip}% 0)`:'none';
      layer.dataset.scene=['hero','exposure','trade','anatomy'][index];layer.dataset.travelling=String(travel>.01);
      drawCoin();
    }
    requestAnimationFrame(frame);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
