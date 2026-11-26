import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { fmt, stars, PRODUCTS, NEW_COLLECTION, NEW_SHOP_EXTRA, DEALS, STACK_GROUPS, NEW_PREVIEW, NEW_LIFESTYLE, CATS, TESTIS, CHAPTERS, POLICIES } from './data.js';

/* ================= SMALL COMPONENTS ================= */
function Toasts({list}){
  return <div className="toasts">{list.map(t=><div key={t.id} className="toast"><span>{t.msg}</span>{t.act? <button className="btn small" onClick={t.act.fn}>{t.act.label}</button>:null}</div>)}</div>;
}
function PCard({p,add,wish,onWish,quick,idx}){
  return <article className="pcard reveal in card-anim" style={{"--stagger":(idx||0)%8}}>
    <div className="ph">
      {p.badge? <span className={"tag"+(p.mine?" mine":p.badge==="New"?" new":"")}>{p.badge}</span>:null}
      <button className={"wish"+(wish?" on":"")} aria-label="wishlist" onClick={()=>onWish(p)}>{wish?"♥":"♡"}</button>
      <img src={p.img} alt={p.name} />
      <button className="quick" onClick={()=>quick(p)}>Quick View</button></div>
    <div className="bd">
      <span className="chip">{p.cat}</span>
      <h3>{p.name}</h3>
      <div className="stars">{stars(p.rating)}<span>{" ("+p.rev+")"}</span></div>
      <p className="desc">{p.desc}</p>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
        <span><span className="price">{fmt(p.price)}</span>{p.old? <span className="oldprice">{fmt(p.old)}</span>:null}</span>
        <button className="btn small" onClick={()=>add(p)}>Add to Cart</button></div></div></article>;
}
function DealCard({d,add,idx}){
  const per = d.price/d.pieces;
  const save = 15*d.pieces - d.price;
  const item = {id:d.id, name: d.pieces===1? "Deal — 1 Piece" : "Deal — "+d.pieces+" Pieces Bundle", price:d.price, img:d.img};
  return <article className="deal-card reveal in card-anim" style={{"--stagger":(idx||0)%8}}>
    {d.best? <span className="deal-badge">★ Best Value</span> : d.pop? <span className="deal-badge pop">Most Popular</span> : null}
    <img src={d.img} alt={item.name} />
    <div className="deal-pc">{d.pieces}<span>{d.pieces===1?"piece":"pieces"}</span></div>
    <div className="deal-price">{fmt(d.price)}</div>
    <div className="deal-per">{"$"+per.toFixed(2)+" per piece"}</div>
    {save>0? <span className="deal-save">{"Save $"+save+" vs buying singly"}</span> : <span className="deal-save">Single-piece price</span>}
    <div className="sp"></div>
    <button className="btn small" aria-label={"Add "+item.name+" ("+fmt(d.price)+") to cart"} onClick={()=>add(item)}>{d.pieces===1? "Add 1-Piece Deal — "+fmt(d.price) : "Add "+d.pieces+"-Piece Deal — "+fmt(d.price)}</button></article>;
}
function LookGrid({items,add}){
  return <div className="lookgrid">{items.map((g,i)=>{
    const price = (typeof g.price==="number")? g.price : 15;
    const item = {id:g.id||("look-"+i), name:g.cap, price:price, img:g.img, cat:"Woven", rating:5, rev:0, desc:g.sub||""};
    return <figure key={g.id||i} className="reveal gal-anim" style={{"--stagger":i%8}}>
      <div><img src={g.img} alt={g.cap} loading="lazy" /><span className="look-price-badge">{fmt(price)}</span></div>
      <figcaption>{g.cap}{g.sub? <span>{g.sub}</span>:null}
        <span className="look-foot"><span className="price">{fmt(price)}</span>
          {add? <button className="btn small look-add" onClick={()=>add(item)}>Add to Cart</button>:null}</span></figcaption></figure>;
  })}</div>;
}


/* ================= 3D VIEWER ================= */
function Vase3D(){
  const ref = useRef(null);
  const state = useRef({auto:true,speed:1});
  const [color,setColor] = useState(0x0E7A3D);
  const [finish,setFinish] = useState("gloss");
  const matRef = useRef(null);
  useEffect(()=>{
    if(!THREE || !ref.current) return;
    const el = ref.current;
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(42, el.clientWidth/el.clientHeight, .1, 100); cam.position.set(0,1.5,6.2);
    const ren = new THREE.WebGLRenderer({canvas:el,antialias:true,alpha:true});
    ren.setSize(el.clientWidth, el.clientHeight); ren.setPixelRatio(Math.min(devicePixelRatio,2));
    scene.add(new THREE.AmbientLight(0xfff2dd,.85));
    const key = new THREE.DirectionalLight(0xffffff,1.5); key.position.set(3,5,4); scene.add(key);
    const rim = new THREE.DirectionalLight(0xD9A441,.8); rim.position.set(-4,2,-3); scene.add(rim);
    const pts=[]; [[0,0],[.9,0],[1.25,.25],[1.42,.9],[1.3,1.7],[.95,2.4],[.62,2.85],[.6,3.3],[.78,3.5],[.8,3.7]].forEach(p=>pts.push(new THREE.Vector2(p[0],p[1])));
    const mat = new THREE.MeshStandardMaterial({color:0x0E7A3D,roughness:.35,metalness:.05,side:THREE.DoubleSide});
    matRef.current = mat;
    const grp = new THREE.Group(); scene.add(grp);
    const vase = new THREE.Mesh(new THREE.LatheGeometry(pts,72), mat); vase.position.y=-1.85; grp.add(vase);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.9,2.05,.16,64), new THREE.MeshStandardMaterial({color:0x7A6A45,roughness:.9,side:THREE.DoubleSide}));
    base.position.y=-1.98; grp.add(base);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.79,.05,16,72), new THREE.MeshStandardMaterial({color:0xD9A441,roughness:.3,metalness:.6,side:THREE.DoubleSide}));
    ring.rotation.x=Math.PI/2; ring.position.y=1.83; grp.add(ring);
    let drag=false,px=0,vel=.008, raf;
    const down=e=>{drag=true;px=(e.touches?e.touches[0].clientX:e.clientX);};
    const move=e=>{ if(!drag) return; const x=(e.touches?e.touches[0].clientX:e.clientX); vel=(x-px)*.005; grp.rotation.y+=(x-px)*.01; px=x; };
    const up=()=>{drag=false;};
    el.addEventListener("pointerdown",down); window.addEventListener("pointermove",move); window.addEventListener("pointerup",up);
    const loop=()=>{ raf=requestAnimationFrame(loop); if(!drag && state.current.auto){ grp.rotation.y+=.008*state.current.speed; } ren.render(scene,cam); };
    loop();
    const onR=()=>{ const w=el.clientWidth; ren.setSize(w,340); cam.aspect=w/340; cam.updateProjectionMatrix(); };
    window.addEventListener("resize",onR);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",onR); window.removeEventListener("pointermove",move); window.removeEventListener("pointerup",up); ren.dispose(); };
  },[]);
  useEffect(()=>{ if(matRef.current){ matRef.current.color.setHex(color); matRef.current.roughness = finish==="gloss"?.28:finish==="matte"?.85:.5; matRef.current.metalness = finish==="metal"?.55:.05; } },[color,finish]);
  const cols=[[0x0E7A3D,"Pakistan Green"],[0xD9A441,"Sona Gold"],[0x14665A,"Indus Teal"],[0xB03A2E,"Sindhi Red"],[0x7A4A8C,"Plum"],[0x3E3A34,"Charcoal"]];
  return <div>
    <canvas id="gl" ref={ref}></canvas>
    <p style={{margin:"10px 0 0",color:"var(--ink2)",fontSize:13.5}}>🖱️ Drag the vase to spin it — it auto-rotates when you let go.</p>
    <div style={{marginTop:10}}><b>Glaze colour</b></div>
    <div className="swatches">{cols.map(c=><button key={c[0]} className={"sw"+(color===c[0]?" on":"")} title={c[1]} aria-label={c[1]} style={{background:"#"+c[0].toString(16).padStart(6,"0")}} onClick={()=>setColor(c[0])}></button>)}</div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"6px 0 12px"}}>
      {["gloss","matte","metal"].map(f=><button key={f} className={"catbtn"+(finish===f?" on":"")} onClick={()=>setFinish(f)}>{f[0].toUpperCase()+f.slice(1)+" finish"}</button>)}</div>
    <label style={{fontWeight:800,fontSize:13.5}}>Spin speed</label>
    <input type="range" min={0} max={3} step={.1} defaultValue={1} onInput={e=>state.current.speed=+e.target.value} />
    <label style={{display:"flex",gap:8,alignItems:"center",fontWeight:700,marginTop:6}}>
      <input type="checkbox" defaultChecked={true} onChange={e=>state.current.auto=e.target.checked} style={{width:18,height:18,accentColor:"var(--terra)"}} />{" Auto-rotate (automation)"}</label></div>;
}

/* ================= 3D PHOTO VIEWER — DOUBLE-SIDED (FRONT + BACK) ================= */
function useFlipCard(autoSpin){
  const [angle,setAngle] = useState(0);
  const [tiltX,setTiltX] = useState(0);
  const [anim,setAnim] = useState(false);
  const [spin,setSpin] = useState(!!autoSpin);
  const drag = useRef({on:false,x:0,y:0});
  useEffect(()=>{
    if(!spin) return;
    let raf; const tick=()=>{ if(!drag.current.on && !anim) setAngle(a=>a+1.15); raf=requestAnimationFrame(tick); };
    raf=requestAnimationFrame(tick); return ()=>cancelAnimationFrame(raf);
  },[spin,anim]);
  const norm = ((angle%360)+360)%360;
  const isBack = norm>90 && norm<270;
  const goToSide = useCallback(back=>{
    setSpin(false); setAnim(true); setTiltX(0);
    setAngle(prev=>{ const n=((prev%360)+360)%360; const target=back?180:0; let d=(target-n+360)%360; if(d>180) d-=360; return prev+d; });
    setTimeout(()=>setAnim(false),880);
  },[]);
  const flip = useCallback(()=>{ goToSide(!isBack); },[goToSide,isBack]);
  const reset = useCallback(()=>{ setAngle(0); setTiltX(0); setAnim(false); },[]);
  const handlers = {
    onPointerDown:e=>{ drag.current={on:true,x:e.clientX,y:e.clientY}; setAnim(false); if(e.currentTarget.setPointerCapture) try{e.currentTarget.setPointerCapture(e.pointerId);}catch(_){} },
    onPointerMove:e=>{ if(!drag.current.on) return; const dx=e.clientX-drag.current.x, dy=e.clientY-drag.current.y; drag.current.x=e.clientX; drag.current.y=e.clientY; setAngle(a=>a+dx*.65); setTiltX(t=>Math.max(-18,Math.min(18,t-dy*.12))); },
    onPointerUp:()=>{ drag.current.on=false; },
    onPointerCancel:()=>{ drag.current.on=false; },
    onPointerLeave:()=>{ if(!drag.current.on) setTiltX(0); }
  };
  return {angle,tiltX,anim,spin,setSpin,isBack,goToSide,flip,reset,handlers};
}
function CardFaces({img,name}){
  return <>
    <div className="edge3d" aria-hidden="true"></div>
    <div className="face3d front"><img src={img} alt={name+" — front side"} draggable={false} /><span className="side-tag">FRONT</span></div>
    <div className="face3d back"><img src={img} alt={name+" — back side (reverse of the same woven piece)"} draggable={false} /><span className="side-tag back-tag">BACK</span><span className="back-note">Reverse side — the same hand weave, seen from behind</span></div></>;
}
function FlipBar({fc}){
  return <div className="flipbar">
    <button type="button" className={"catbtn"+(!fc.isBack?" on":"")} onClick={()=>fc.goToSide(false)}>See front side</button>
    <button type="button" className={"catbtn"+(fc.isBack?" on":"")} onClick={()=>fc.goToSide(true)}>See back side</button>
    <button type="button" className="btn small" onClick={fc.flip}>⇋ Flip over</button></div>;
}
function TiltViewer({add}){
  const [sel,setSel] = useState(PRODUCTS[8]);
  const [zoom,setZoom] = useState(1);
  const fc = useFlipCard(true);
  const pick = p => { setSel(p); fc.reset(); fc.setSpin(true); };
  return <div>
    <div className="tilt-stage">
      <div className="side-pill" aria-live="polite">{fc.isBack? "BACK SIDE — YOU ARE LOOKING AT THE REVERSE" : "FRONT SIDE"}</div>
      <div className="tilt-zoom" style={{transform:"scale("+zoom+")"}}>
        <div className="card3d-scene" {...fc.handlers}>
          <div className={"card3d"+(fc.anim?" anim":"")} style={{transform:"rotateX("+fc.tiltX+"deg) rotateY("+fc.angle+"deg)"}}><CardFaces img={sel.img} name={sel.name} /></div></div></div>
      <FlipBar fc={fc} /></div>
    <p style={{margin:"10px 0 0",color:"var(--ink2)",fontSize:13.5}}>Drag left or right to turn it all the way around — a full 360°. Both sides are real and solid: the front, and the reverse of the same woven piece. Or use “See back side” / “Flip over”.</p>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginTop:10,flexWrap:"wrap"}}>
      <div><b style={{fontSize:16}}>{sel.name}</b><div><span className="price">{fmt(sel.price)}</span>{sel.old? <span className="oldprice">{fmt(sel.old)}</span>:null}</div></div>
      <button className="btn small" onClick={()=>add(sel)}>Add to Cart</button></div>
    <div className="thumbs" aria-label="Choose a product to view in 3D">{PRODUCTS.filter(p=>p.id!=="p04"&&p.id!=="p05"&&p.id!=="p07"&&p.id!=="p08").map(p=><button key={p.id} className={sel.id===p.id?"on":""} title={p.name} aria-label={p.name} onClick={()=>pick(p)}><img src={p.img} alt="" /></button>)}</div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12,alignItems:"center"}}>
      <button className={"catbtn"+(fc.spin?" on":"")} onClick={()=>fc.setSpin(!fc.spin)}>{fc.spin?"🌀 Auto-spin 360°: ON":"🌀 Auto-spin 360°: OFF"}</button>
      <label style={{fontWeight:800,fontSize:13.5,display:"flex",gap:8,alignItems:"center",flex:1,minWidth:170}}>Zoom
        <input type="range" min={1} max={1.6} step={.05} value={zoom} onChange={e=>setZoom(+e.target.value)} style={{flex:1}} /></label></div></div>;
}
function QVImg({p}){
  const fc = useFlipCard(false);
  return <div className="qv3d">
    <div className="side-pill" aria-live="polite">{fc.isBack? "BACK SIDE — REVERSE OF THE MAT" : "FRONT SIDE"}</div>
    <div className="card3d-scene" {...fc.handlers}>
      <div className={"card3d"+(fc.anim?" anim":"")} style={{transform:"rotateX("+fc.tiltX+"deg) rotateY("+fc.angle+"deg)"}}><CardFaces img={p.img} name={p.name} /></div></div>
    <FlipBar fc={fc} />
    <p style={{margin:"10px 0 0",color:"var(--ink2)",fontSize:13,textAlign:"center"}}>Drag to turn it 360° — both sides, not just one.</p></div>;
}

/* ================= VIDEO ================= */
function ProductVideo(){
  const vRef = useRef(null);
  const [playing,setPlaying] = useState(false);
  const [prog,setProg] = useState(0);
  const [chap,setChap] = useState(0);
  const seek = t => { const v=vRef.current; if(v){ v.currentTime=t; v.play(); setPlaying(true);} };
  return <div>
    <div className="vidwrap">
      <video ref={vRef} src="assets/products-film.mp4" poster="assets/p09-tassel-fringe-mat.jpg" playsInline={true} preload="metadata"
        onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}
        onTimeUpdate={e=>{ const v=e.target; setProg(v.duration? v.currentTime/v.duration*100:0); let c=0; CHAPTERS.forEach((ch,i)=>{ if(v.currentTime>=ch.t) c=i; }); setChap(c); }}
        onClick={e=>{ e.target.paused? e.target.play(): e.target.pause(); }}></video></div>
    <progress className="vp" value={prog} max={100}></progress>
    <div style={{display:"flex",gap:10,alignItems:"center",marginTop:10,flexWrap:"wrap"}}>
      <button className="btn small" onClick={()=>{ const v=vRef.current; if(v){ v.paused? v.play(): v.pause(); } }}>{playing?"⏸ Pause":"▶ Play the Film"}</button>
      <span className="chip">{CHAPTERS[chap].label}</span>
      <span style={{color:"var(--ink2)",fontSize:13.5}}>Ten woven pieces in 24 seconds — spirals, stars, mirror centres and tassels.</span></div>
    <div className="vidbar">{CHAPTERS.map((c,i)=><button key={i} className={i===chap?"on":""} onClick={()=>seek(c.t)}>{c.label}</button>)}</div></div>;
}

/* ================= CINEMATIC SECTIONS ================= */
function CineHero({go}){
  const vidRef = el=>{ if(el){ el.muted=true; const pr=el.play(); if(pr&&pr.catch) pr.catch(()=>{}); } };
  return <section className="cine-hero">
    <div className="cine-video">
      <video className="vid-bg" ref={vidRef} autoPlay={true} muted={true} loop={true} playsInline={true} preload="auto" aria-hidden="true" tabIndex={-1}>
        <source src="assets/products-film.mp4" type="video/mp4" /></video>
      <video className="vid-fg" ref={vidRef} autoPlay={true} muted={true} loop={true} playsInline={true} preload="auto" poster="assets/p09-tassel-fringe-mat.jpg" aria-label="Crafts from Hands product film — the woven collection">
        <source src="assets/products-film.mp4" type="video/mp4" /></video>
      <div className="cine-shade-l"></div><div className="cine-shade-b"></div></div>
    <div className="cine-content wrap">
      <div className="cine-main">
        <p className="eyebrow h-anim">Handmade in Pakistan • Woven by Hand</p>
        <h1 className="cine-title h-anim"><span className="grad-cream">Colour</span><span className="grad-gold">Woven</span><span className="grad-green">By Hand</span></h1>
        <p className="cine-sub h-anim">Woven Mats • Mirror Centres • Tassel Fringe</p>
        <p className="cine-desc h-anim">Spirals, stars and mandalas in festival colours — every Crafts from Hands piece is woven straw by straw in our own workshop, one ring at a time, until it becomes the brightest corner of your home.</p>
        <div className="cine-ctas h-anim">
          <button className="btn cine-btn" onClick={()=>go("shop")}>Shop the Collection ↗</button>
          <button className="btn ghost cine-btn" onClick={()=>go("story")}>Watch the Film</button></div>
        <div className="cine-price h-anim">
          <span className="chip hero-price">$15.00 — every piece, one flat price</span>
          <span className="cine-deal">Bundles: 4 for $22 • 8 for $30 • 16 for $40</span></div></div></div>
    <div className="cine-watermark" aria-hidden="true"><img src="assets/logo.png" alt="" /></div>
    <div className="cine-scroll" aria-hidden="true"><span>Scroll</span><i></i></div></section>;
}
function MakerSection({counts}){
  return <section id="about" className="cine-about">
    <div className="about-glow" aria-hidden="true"></div>
    <div className="wrap">
      <div className="eyebrow reveal">01 / The Maker</div>
      <div className="about-grid">
        <div className="reveal">
          <h2 className="cine-h2"><span className="grad-cream">Not printed.</span><span className="grad-cream">Not machined.</span><span className="grad-gold">Woven by hand.</span></h2>
          <p className="about-bio">Every piece in this shop begins the same way — at a worn wooden table in our Pakistan workshop, where our <b>woman weaver</b> coils dyed straw ring by ring: pink, teal, violet, gold. No moulds, no machines, no two pieces ever exactly alike. Hours later the mat is finished with tassels, mirrors or a zig-zag rim, checked, and signed by the hands that made it.</p>
          <p className="cine-quote">“The hands remember what the eyes forget.”</p>
          <div className="cine-stats">
            {[[counts[0]+"+","Artisan makers"],[counts[1].toLocaleString()+"+","Pieces delivered"],[counts[2],"Craft traditions"],[counts[3]+" yrs","Of handcraft"]].map((s,i)=><div key={i} className="cs"><b>{s[0]}</b><span>{s[1]}</span></div>)}</div></div>
        <div className="maker-wrap reveal">
          <div className="maker-glow" aria-hidden="true"></div>
          <div className="maker-frame">
            <span className="corner tl"></span><span className="corner tr"></span><span className="corner bl"></span><span className="corner br"></span>
            <div className="ph">
              <img className="ph-fg" src="assets/maker-woman.webp" alt="Painted illustration of the Crafts from Hands woman weaver at her work table, weaving a colourful spiral straw mat by hand, with finished woven mats hanging on the workshop wall behind her" />
              <div className="maker-cap"><span>The Maker — painted illustration</span><b>Our weaver, at the work table</b></div></div></div></div></div></div></section>;
}
function StackSection({add,go}){
  const wrapRef = useRef(null);
  useEffect(()=>{
    const root = wrapRef.current; if(!root) return;
    if(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(root.querySelectorAll(".stack-card"));
    let raf = 0;
    const upd = ()=>{ raf = 0; const vh = window.innerHeight;
      cards.forEach((c,i)=>{ if(i===cards.length-1) return; const r = cards[i+1].getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (vh*0.98 - r.top) / (vh*0.98 - 150)));
        c.style.transform = "scale(" + (1 - p*0.055) + ")"; c.style.filter = "brightness(" + (1 - p*0.28) + ")"; }); };
    const onS = ()=>{ if(!raf) raf = requestAnimationFrame(upd); };
    window.addEventListener("scroll", onS, {passive:true}); window.addEventListener("resize", onS); upd();
    return ()=>{ window.removeEventListener("scroll", onS); window.removeEventListener("resize", onS); if(raf) cancelAnimationFrame(raf); cards.forEach(c=>{ c.style.transform=""; c.style.filter=""; }); };
  },[]);
  return <section id="collections">
    <div className="wrap">
      <div className="eyebrow reveal">02 / The Collection</div>
      <div className="sec-head reveal"><div><h2>Collections that stack up</h2><p>Scroll slowly — each collection settles over the last, the way finished mats stack up on the workshop shelf. Every piece in every stack is $15.</p></div></div>
      <div className="stack-wrap" ref={wrapRef}>
        {STACK_GROUPS.map((g,i)=><article key={g.n} className="stack-card" style={{"--i":i}}>
          <div className="stack-media"><img className="sm-fg" src={g.img} alt={g.title} /><span className="stack-num" aria-hidden="true">{g.n}</span></div>
          <div className="stack-body">
            <span className="eyebrow sm">{g.meta}</span>
            <h3>{g.title}</h3>
            <p>{g.desc}</p>
            <div className="stack-row"><span className="price big">$15.00</span><span className="stack-per">every piece • one flat price</span></div>
            <div className="stack-row">
              <button className="btn small" onClick={()=>add(g.item)}>Add to Cart</button>
              <button className="btn ghost small" onClick={()=>go("shop")}>Browse the Shop</button></div></div></article>)}
      </div></div></section>;
}

/* ================= PAGES ================= */
function HomePage({go,add,wishSet,onWish,quick}){
  const [tst,setTst] = useState(0);
  const carRef = useRef(null);
  const [counts,setCounts] = useState([0,0,0,0]);
  useEffect(()=>{ const id=setInterval(()=>setTst(s=>(s+1)%TESTIS.length),6000); return ()=>clearInterval(id); },[]);
  useEffect(()=>{
    const targets=[120,4800,26,15]; const t0=Date.now();
    const id=setInterval(()=>{ const k=Math.min(1,(Date.now()-t0)/1800); setCounts(targets.map(t=>Math.round(t*(1-Math.pow(1-k,3))))); if(k>=1) clearInterval(id); },40);
    return ()=>clearInterval(id);
  },[]);
  useEffect(()=>{
    const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("in"); }),{threshold:.12});
    document.querySelectorAll(".reveal").forEach(el=>io.observe(el)); return ()=>io.disconnect();
  });
  const featured = PRODUCTS.filter(p=>p.id!=="p04"&&p.id!=="p05"&&p.id!=="p07"&&p.id!=="p08").slice(0,8);
  return <>
    <div className="ticker"><div className="track">{Array(2).fill("🇵🇰 Handmade in Pakistan ✦ EVERY PRODUCT $15 ✦ FREE shipping over $75 ✦ All 12 woven pieces are LIVE in the shop ✦ NEW COLLECTION — NOW LIVE ✦ BUNDLE DEALS — 16 PIECES FOR $40 ✦ Every piece is one-of-one ✦ Woven by hand in small batches ✦ ").join("")}</div></div>
    <CineHero go={go} />
    <MakerSection counts={counts} />
    <StackSection add={add} go={go} />
    <div className="wrap">
      <section id="deals">
        <div className="eyebrow reveal in">03 / Bundle Deals</div>
        <div className="sec-head reveal in"><div><h2>Deals Offer — Bundle & Save</h2><p>Pick any products you like — every piece is $15, and bundles make each piece cheaper. Mix & match freely: make your bundle from ANY pieces/products on the site, any colours, any designs.</p></div>
          <span className="chip" style={{background:"var(--gold)",color:"#241A05",fontWeight:800}}>As low as $2.50 a piece</span></div>
        <div className="dealgrid">{DEALS.map((d,i)=><DealCard key={d.id} d={d} add={add} idx={i} />)}</div></section>
      <section>
        <div className="brand-hero reveal in">
          <img src="assets/logo.png" alt="Crafts from Hands folk crafts emblem — woven tray with Crafts from Hands wordmark and tagline Traditional Handicrafts, Colourful Homes" />
          <div><h2>Crafts from Hands</h2><p>Traditional Handicrafts • Colourful Homes — our official emblem, with the woven tray at its heart. Every piece in this shop is hand-woven in Pakistan in these same festival colours.</p></div></div></section>
      <section>
        <div className="eyebrow reveal in">04 / The Showcase</div>
        <div className="sec-head reveal in"><div><h2>Fresh from the makers</h2><p>A sliding showcase of the whole collection — all twelve pieces are hand-woven in our own workshop, photographed on a clean studio background.</p></div>
          <div className="car-nav"><button aria-label="Scroll left" onClick={()=>carRef.current&&carRef.current.scrollBy({left:-290,behavior:"smooth"})}>‹</button><button aria-label="Scroll right" onClick={()=>carRef.current&&carRef.current.scrollBy({left:290,behavior:"smooth"})}>›</button></div></div>
        <div className="car"><div className="car-track" ref={carRef}>{featured.map((p,i)=><PCard key={p.id} p={p} idx={i} add={add} wish={wishSet.has(p.id)} onWish={onWish} quick={quick} />)}</div></div></section>
      <section id="new-collection">
        <div className="eyebrow reveal in">05 / Just Landed</div>
        <div className="sec-head reveal in"><div><h2>New Collection</h2><p>Four brand-new pieces, fresh off the loom — now on sale at $15 each. Add them one by one, or grab a bundle deal above and pay far less per piece.</p></div>
          <button className="btn ghost" onClick={()=>go("shop")}>See in Shop →</button></div>
        <div className="grid">{NEW_COLLECTION.map((p,i)=><PCard key={p.id} p={p} idx={i} add={add} wish={wishSet.has(p.id)} onWish={onWish} quick={quick} />)}</div></section>
      <section>
        <div className="eyebrow reveal">06 / In Real Life</div>
        <div className="sec-head reveal"><div><h2>New pieces, in real life</h2><p>Every new photo in one place — trays on the table, placemats set for dinner, and the next stars and spirals up close. Every piece pictured here is priced too: $15 each, and you can add any of them straight to your basket.</p></div></div>
        <LookGrid items={NEW_LIFESTYLE.concat(NEW_PREVIEW)} add={add} /></section>
      <section>
        <div className="eyebrow reveal">07 / The Film</div>
        <div className="sec-head reveal"><div><h2>Watch our products</h2><p>Ten woven pieces in one short film — slow cinematic zooms and gentle fades, exactly as they look on the shelf.</p></div></div>
        <div className="panel" style={{maxWidth:900,margin:"0 auto"}}><ProductVideo /></div></section>
      <section>
        <div className="eyebrow reveal">08 / Front & Back in 3D</div>
        <div className="sec-head reveal"><div><h2>See every piece in 3D — front & back</h2><p>Pick any product and turn it over in your hands: drag for a full 360°, use the flip buttons to see the back side, let it auto-spin through both sides, and zoom right into the weave. Beside it, our Three.js studio still lets you design a vase in real 3D.</p></div></div>
        <div className="split">
          <div className="panel">
            <h3 className="serif" style={{marginBottom:10}}>3D viewer — front & back</h3>
            <TiltViewer add={add} /></div>
          <div className="panel">
            <h3 className="serif" style={{marginBottom:8}}>…or design a vase in true 3D</h3>
            <p style={{color:"var(--ink2)",marginTop:0}}>Our Three.js design studio: spin the vase, re-glaze it, change the finish — a taste of the custom pieces our makers create to order.</p>
            <Vase3D />
            <p style={{margin:"14px 0 0"}}><span className="price">$15.00</span><span style={{color:"var(--ink2)",fontSize:14}}> — custom pieces are priced at the same flat $15 as every product in the shop.</span></p>
            <button className="btn" style={{marginTop:10}} onClick={()=>go("shop")}>Shop the Woven Collection</button></div></div></section>
      <section>
        <div className="eyebrow reveal">09 / Kind Words</div>
        <div className="sec-head reveal"><div><h2>Loved, loudly</h2><p>Reviews slide in automatically — pause anytime with the dots.</p></div></div>
        <div className="panel testi reveal">
          {TESTIS.map((t,i)=><div key={i} className={"tst"+(i===tst?" on":"")}><blockquote>{"“"+t.q+"”"}</blockquote><b>{t.n}</b><div style={{color:"var(--ink2)",fontSize:14}}>{t.w}</div><div className="stars">★★★★★</div></div>)}
          <div style={{display:"flex",gap:7,marginTop:14}}>{TESTIS.map((_,i)=><button key={i} aria-label={"Review "+(i+1)} onClick={()=>setTst(i)} style={{width:i===tst?26:10,height:10,borderRadius:99,border:"none",background:i===tst?"var(--terra)":"var(--line)",padding:0,transition:".3s"}}></button>)}</div></div></section>
      <section>
        <div className="panel reveal" style={{textAlign:"center",background:"linear-gradient(120deg,var(--bg2),var(--card))"}}>
          <h2 className="serif" style={{fontSize:30}}>This week's weaving batch ends soon</h2>
          <p style={{color:"var(--ink2)"}}>All twelve pieces are woven in small batches. When this batch sells out, the next weaving takes two weeks.</p>
          <Countdown /><button className="btn" style={{marginTop:16}} onClick={()=>go("shop")}>Shop Before It's Gone</button></div></section></div></>;
}
function Countdown(){
  const [left,setLeft] = useState(0);
  useEffect(()=>{ const end = Date.now() + (2*24*3600+11*3600+23*60)*1000; const f=()=>setLeft(Math.max(0,end-Date.now())); f(); const id=setInterval(f,1000); return ()=>clearInterval(id); },[]);
  const s=Math.floor(left/1000), d=Math.floor(s/86400), hh=Math.floor(s%86400/3600), mm=Math.floor(s%3600/60), ss=s%60;
  return <div className="countdown" style={{justifyContent:"center",marginTop:14}}>{[[d,"days"],[hh,"hrs"],[mm,"min"],[ss,"sec"]].map((u,i)=><div key={i}><b>{String(u[0]).padStart(2,"0")}</b><span>{u[1]}</span></div>)}</div>;
}

function ShopPage({add,wishSet,onWish,quick}){
  const [q,setQ] = useState(""); const [cat,setCat] = useState("All"); const [sort,setSort] = useState("feat");
  useEffect(()=>{ const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("in"); }),{threshold:.1,rootMargin:"0px 0px -30px 0px"}); document.querySelectorAll(".reveal:not(.in)").forEach(el=>io.observe(el)); return ()=>io.disconnect(); });
  const list = useMemo(()=>{
    let L = PRODUCTS.filter(p=> (cat==="All"||p.cat===cat) && (p.name+" "+p.desc+" "+p.cat).toLowerCase().includes(q.toLowerCase()));
    if(sort==="low") L=[...L].sort((a,b)=>a.price-b.price);
    if(sort==="high") L=[...L].sort((a,b)=>b.price-a.price);
    if(sort==="rate") L=[...L].sort((a,b)=>b.rating-a.rating);
    return L;
  },[q,cat,sort]);
  return <div className="wrap">
    <section>
      <div className="eyebrow">Browse / The Collection</div>
      <div className="sec-head"><div><h2>The Shop</h2><p>Search and sort the full collection — all twelve pieces are your own hand-woven work, plus every one of the twenty new-collection pieces below, now on sale at $15 a piece.</p></div></div>
      <div className="toolbar">
        <input type="search" placeholder="🔍 Search mats, placemats, wall hangings…" value={q} onChange={e=>setQ(e.target.value)} aria-label="Search products" />
        <select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort products">
          <option value="feat">Sort: Featured</option><option value="low">Price: Low → High</option><option value="high">Price: High → Low</option><option value="rate">Top Rated</option></select></div>
      <div className="toolbar">{CATS.map(c=><button key={c} className={"catbtn"+(cat===c?" on":"")} onClick={()=>setCat(c)}>{c}</button>)}</div>
      {list.length? <div className="grid">{list.map((p,i)=><PCard key={p.id} p={p} idx={i} add={add} wish={wishSet.has(p.id)} onWish={onWish} quick={quick} />)}</div>
        : <p style={{color:"var(--ink2)",padding:"20px 0"}}>No pieces match that search — try a shorter word, or browse a category above.</p>}
      <h3 className="serif" style={{fontSize:26,margin:"40px 0 6px"}}>New Collection — All 20 Pieces</h3>
      <p style={{color:"var(--ink2)",margin:"0 0 16px",maxWidth:640}}>Every new-collection piece is here as a full product — the mirror mats, star baskets, coiled bowls, trays and table sets from the lookbook and lifestyle photos, each $15. Add them to your basket like any other piece, or use the bundle deals on the Home page to pay less per piece.</p>
      <div className="grid">{NEW_COLLECTION.concat(NEW_SHOP_EXTRA).map((p,i)=><PCard key={p.id} p={p} idx={i} add={add} wish={wishSet.has(p.id)} onWish={onWish} quick={quick} />)}</div></section></div>;
}

function StoryPage({go}){
  useEffect(()=>{ const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("in"); }),{threshold:.12}); document.querySelectorAll(".reveal").forEach(el=>io.observe(el)); return ()=>io.disconnect(); });
  const GAL = [
   ["assets/g1-shop-table.jpg","The work table — today's weaving, stacked and ready","Woven mats and pieces stacked on the shop table"],
   ["assets/g2-shop-wall.jpg","The display wall — mirrors, stars and spirals","The shop display wall covered with woven pieces"],
   ["assets/g3-shop-assorted.jpg","Fresh stock, sorted by colour","Assorted woven pieces in the shop"],
   ["assets/g4-shop-hanging.jpg","Hanging pieces, ready for your wall","Woven wall hangings displayed in the shop"],
   ["assets/n15-tray-collection.jpg","New collection — six woven trays together","Collection of six colourful woven trays"],
   ["assets/n16-table-placemats.jpg","New — placemats set on a dining table","Solid colour woven placemats on a dining table"],
   ["assets/n17-rainbow-placemat-cutlery.jpg","New — rainbow placemat with cutlery","Rainbow spiral placemat styled with cutlery"],
   ["assets/n18-pastel-table.jpg","New — pastel placemats on a wooden table","Pastel spiral placemats on a wooden table with a vase"],
   ["assets/n19-sunrise-flatlay.jpg","New — sunrise bowls, coasters & trivet","Sunrise coiled bowls coasters and trivet flat lay"],
   ["assets/n09-star-placemats-set.jpg","New — set of 4 star placemats","Set of four star woven placemats on wood"],
   ["assets/n01-mirror-mat-room.jpg","New collection — pink & green mirror mat in a room","Pink and green spiral mirror mat in a room scene"],
   ["assets/n03-geometric-star-mat.jpg","New collection — geometric star mat","Geometric star woven mat in maroon black blue and yellow"],
   ["assets/n11-multicolour-coiled-mat.jpg","New collection — multicolour coiled mat, red rim","Multicolour coiled woven mat with red rim"],
   ["assets/n12-sun-zigzag-basket.jpg","New collection — sun zigzag basket","Sun zigzag woven basket with cream centre"],
   ["assets/maker-woman.webp","The Maker — our weaver at work (painted illustration)","Painted illustration of the woman weaver weaving a colourful spiral mat at the workshop table"]];
  return <div className="wrap">
    <section>
      <div className="eyebrow reveal">Watch / The Film</div>
      <div className="sec-head reveal"><div><h2>Our products, on film</h2><p>A 24-second tour of ten woven pieces — slow zooms and gentle fades. Use the chapter buttons to jump straight to a style: spirals, mirror centres or tassels.</p></div></div>
      <div className="panel" style={{maxWidth:900,margin:"0 auto"}}><ProductVideo /></div></section>
    <section>
      <div className="eyebrow reveal">Gallery / Inside the Shop</div>
      <div className="sec-head reveal"><div><h2>Inside the shop</h2><p>Real photos from our own shelves and walls — plus the new collection: trays, table settings and placemats in real homes. Every piece in these photos is $15 per piece — the same flat price as the whole shop.</p></div></div>
      <div className="galgrid">{GAL.map((g,i)=><figure key={i} className="reveal gal-anim" style={{"--stagger":i}}><div><img src={g[0]} alt={g[2]} loading="lazy" />{g[0].indexOf("maker-woman")>-1 ? null : <span className="look-price-badge">$15.00</span>}</div><figcaption>{g[1]}<span className="gal-price">{g[0].indexOf("maker-woman")>-1 ? "Handmade with love" : "$15.00 per piece"}</span></figcaption></figure>)}</div></section>
    <section>
      <div className="eyebrow reveal">The Process / Step by Step</div>
      <div className="sec-head reveal"><div><h2>How every piece is made</h2></div></div>
      <div className="split">
        <img className="reveal split-img" src="assets/g4-shop-hanging.jpg" alt="Woven wall hangings displayed in the shop" />
        <div className="panel">
          <div className="steps" style={{gridTemplateColumns:"1fr 1fr"}}>
            {[["1","Dyed in festival colours","Straw and palm fibre are dyed in small pots — pink, teal, violet, gold — and dried in the sun."],
             ["2","Woven ring by ring","Each mat grows from its centre outward, coiled and stitched entirely by hand. One piece can take hours."],
             ["3","Finished with flair","Tassels, mirrors and zig-zag rims are added last — the details that make every piece one of one."],
             ["4","Checked, signed, sent","Every piece is inspected, signed by its maker and wrapped plastic-free before it travels to you."]].map(s=><div key={s[0]} className="step"><div className="n">{s[0]}</div><h3 className="serif" style={{fontSize:19,marginBottom:5}}>{s[1]}</h3><p style={{margin:0,color:"var(--ink2)",fontSize:14.5}}>{s[2]}</p></div>)}</div></div></div></section>
    <section>
      <div className="split">
        <div className="panel reveal"><h3 className="serif" style={{marginBottom:8}}>From our shelf to your home</h3>
          <p style={{color:"var(--ink2)"}}>What you see on the shop wall is what arrives at your door — the same colours, the same weave, the same maker's hands. Every photo on this site was cleaned onto a simple studio background, but the pieces are exactly as woven.</p>
          <button className="btn" onClick={()=>go("shop")}>Shop All 12 Pieces</button></div>
        <img className="reveal split-img" src="assets/g1-shop-table.jpg" alt="Woven pieces stacked on the shop table" /></div></section></div>;
}

/* ================= POLICY & CONTACT PAGES ================= */
function rich(parts){
  return parts.map((p,i)=> typeof p==="string"? p : <b key={i}>{p[1]}</b>);
}
function PolicyPage({kind,go}){
  useEffect(()=>{ const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("in"); }),{threshold:.1}); document.querySelectorAll(".reveal").forEach(el=>io.observe(el)); return ()=>io.disconnect(); });
  const P = POLICIES[kind];
  return <div className="wrap"><section>
    <div className="eyebrow reveal">{P.eyebrow}</div>
    <div className="sec-head reveal"><div><h2>{P.title}</h2><p>{P.intro}</p></div></div>
    <div className="panel pol reveal">
      {P.sections.map((s,i)=><React.Fragment key={i}>
        <h3>{s.h}</h3>
        {s.ps? <p>{rich(s.ps)}</p> : null}
        {s.lis? <ul>{s.lis.map((li,j)=><li key={j}>{li}</li>)}</ul> : null}</React.Fragment>)}
      <p style={{marginTop:26,borderTop:"1px dashed var(--line2)",paddingTop:16}}>Last updated: November 2026. Questions about this policy? See our <a href="#" onClick={e=>{e.preventDefault();go("contact");}}>Contact page</a> — Crafts from Hands, Lahore, Pakistan · mkaleem9755@gmail.com · WhatsApp +92 335 9993942.</p></div>
    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:18}}>
      <button className="btn ghost small" onClick={()=>go("returns")}>Returns & Exchange</button>
      <button className="btn ghost small" onClick={()=>go("shipping")}>Shipping & Delivery</button>
      <button className="btn ghost small" onClick={()=>go("privacy")}>Privacy Policy</button>
      <button className="btn ghost small" onClick={()=>go("contact")}>Contact Us</button></div></section></div>;
}
function ContactPage({go}){
  useEffect(()=>{ const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("in"); }),{threshold:.1}); document.querySelectorAll(".reveal").forEach(el=>io.observe(el)); return ()=>io.disconnect(); });
  const rows=[
    ["🏠","Crafts from Hands — Lahore, Pakistan","Our workshop and studio: Craft Fair Stall 12, Weekend Bazaar, Lahore, Pakistan. Studio open Saturday–Sunday, 10am–6pm."],
    ["✉️","Email — mkaleem9755@gmail.com","Write to us any time at mkaleem9755@gmail.com — for orders, returns, wholesale and custom weaving. We reply within 1 working day."],
    ["📱","Phone / WhatsApp — +92 335 9993942","Call or WhatsApp us on +92 335 9993942 (Mon–Sat, 9am–7pm PKT) — the fastest way to reach us about an order."]];
  return <div className="wrap"><section>
    <div className="eyebrow reveal">Contact / Say Hello</div>
    <div className="sec-head reveal"><div><h2>Contact Us</h2><p>Questions about an order, a return, a delivery — or a custom piece woven just for you? Here is every way to reach Crafts from Hands.</p></div></div>
    <div className="split">
      <div className="panel reveal">
        <h3 className="serif" style={{marginBottom:10}}>Crafts from Hands</h3>
        <div className="contact-rows">{rows.map((r,i)=><div key={i} className="contact-row">
          <span className="ic">{r[0]}</span>
          <div><b>{r[1]}</b><span>{r[2]}</span></div></div>)}</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:18}}>
          <a className="btn small" href="https://wa.me/923359993942" target="_blank" rel="noopener">WhatsApp Us</a>
          <a className="btn ghost small" href="mailto:mkaleem9755@gmail.com">Email Us</a></div></div>
      <img className="reveal split-img" src="assets/g2-shop-wall.jpg" alt="The Crafts from Hands shop display wall in Lahore, covered with hand-woven pieces" /></div>
    <div className="panel reveal" style={{marginTop:26}}>
      <h3 className="serif" style={{marginBottom:8}}>Before you write — our policies</h3>
      <p style={{color:"var(--ink2)",margin:"0 0 14px"}}>Most questions are answered on our policy pages: delivery charges and times, returns and exchanges, and how we handle your personal details.</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <button className="btn ghost small" onClick={()=>go("shipping")}>Shipping & Delivery</button>
        <button className="btn ghost small" onClick={()=>go("returns")}>Returns & Exchange</button>
        <button className="btn ghost small" onClick={()=>go("privacy")}>Privacy Policy</button></div></div></section></div>;
}

function CheckoutPage({cart,setQty,clearCart,toast,go}){
  const [pay,setPay] = useState("card");
  const [form,setForm] = useState({name:"",email:"",addr:"",city:"",zip:"",cnum:"",cexp:"",ccvc:""});
  const [errs,setErrs] = useState({});
  const [done,setDone] = useState(null);
  const [confetti,setConfetti] = useState(false);
  const sub = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const ship = sub===0||sub>=75?0:6.95; const tax = sub*.05; const total = sub+ship+tax;
  const set=(k,v)=>{ let val=v;
    if(k==="cnum") val=v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
    if(k==="cexp"){ val=v.replace(/\D/g,"").slice(0,4); if(val.length>2) val=val.slice(0,2)+"/"+val.slice(2); }
    if(k==="ccvc") val=v.replace(/\D/g,"").slice(0,4);
    setForm(f=>({...f,[k]:val})); };
  const place=()=>{
    const e={};
    if(form.name.trim().length<3) e.name="Please enter the full name.";
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email="Enter a valid email address.";
    if(form.addr.trim().length<6) e.addr="Enter your street address.";
    if(form.city.trim().length<2) e.city="Enter your city.";
    if(pay==="card"){
      if(form.cnum.replace(/\s/g,"").length<16) e.cnum="Card number needs 16 digits.";
      if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cexp)) e.cexp="Use MM/YY.";
      if(form.ccvc.length<3) e.ccvc="3–4 digit code.";
    }
    setErrs(e);
    if(Object.keys(e).length){ toast("⚠️ Please fix the highlighted fields."); return; }
    const order = "CFH-"+Math.floor(100000+Math.random()*900000);
    setDone(order); setConfetti(true); clearCart(true);
    setTimeout(()=>setConfetti(false),3600);
    window.scrollTo({top:0,behavior:"smooth"});
  };
  if(done) return <div className="wrap"><section>
    {confetti? <div className="confetti">{Array.from({length:36},(_,i)=><i key={i} style={{left:(i*2.7)+"%",background:["#0E7A3D","#D9A441","#F5F1E3","#14665A"][i%4],animationDuration:(2.2+ (i%7)*.3)+"s",animationDelay:(i%9)*.12+"s"}}></i>)}</div>:null}
    <div className="success panel reveal">
      <div className="tick">✓</div>
      <h2 className="serif" style={{fontSize:32}}>Order placed — thank you!</h2>
      <p style={{color:"var(--ink2)",maxWidth:520,margin:"10px auto"}}>Order <b>{done}</b> is confirmed. A receipt was sent to <b>{form.email}</b>. Your pieces will be wrapped plastic-free and dispatched within 2 working days — tracking follows by email.</p>
      <p style={{color:"var(--ink2)"}}>{pay==="cod" ? "Please keep the total ready in cash when your parcel arrives." : pay==="paypal" ? "Payment completed via PayPal." : "Payment completed by card ending •••• "+(form.cnum.replace(/\s/g,"").slice(-4)||"4242")+"."}</p>
      <button className="btn" onClick={()=>go("shop")}>Continue Shopping</button></div></section></div>;
  const F=(k,label,ph,type)=><div className="field"><label>{label}</label><input className={errs[k]?"bad":""} type={type||"text"} placeholder={ph} value={form[k]} onChange={e=>set(k,e.target.value)} />{errs[k]? <div className="err">{errs[k]}</div>:null}</div>;
  return <div className="wrap"><section>
    <div className="eyebrow">Secure / Checkout</div>
    <div className="sec-head"><div><h2>Checkout</h2><p>Secure checkout with card, PayPal or cash on delivery. This demo checkout validates your details in the browser — no real payment is taken.</p></div></div>
    {cart.length===0? <div className="panel reveal" style={{textAlign:"center"}}><h3 className="serif">Your cart is empty</h3><p style={{color:"var(--ink2)"}}>Add a handmade piece first — the mats are a lovely place to start.</p><button className="btn" onClick={()=>go("shop")}>Browse the Shop</button></div>
    : <div className="co">
      <div className="panel reveal">
        <h3 className="serif" style={{marginBottom:14}}>Delivery details</h3>
        {F("name","Full name","Your full name")}{F("email","Email","you@example.com","email")}{F("addr","Street address","House, street, area")}
        <div className="frow">{F("city","City","Your city")}{F("zip","Postal code","54000")}</div>
        <h3 className="serif" style={{margin:"22px 0 12px"}}>Payment method</h3>
        {[["card","💳","Card payment","Visa, Mastercard, Amex — instant & secure"],
         ["paypal","🅿️","PayPal","Redirect-free demo approval with your PayPal balance"],
         ["cod","💵","Cash on Delivery","Pay at your door — no card needed"]].map(o=>
          <button key={o[0]} className={"payopt"+(pay===o[0]?" on":"")} onClick={()=>setPay(o[0])}>
            <span className="ic">{o[1]}</span><span><b>{o[2]}</b><br /><span style={{color:"var(--ink2)",fontSize:13.5}}>{o[3]}</span></span>
            <span style={{marginLeft:"auto",fontWeight:900,color:"var(--terra)"}}>{pay===o[0]?"●":"○"}</span></button>)}
        {pay==="card"? <>
          <div className="ccard">
            <div style={{display:"flex",justifyContent:"space-between"}}><b>CRAFTS FROM HANDS</b><span>💳</span></div>
            <div className="num">{form.cnum || "•••• •••• •••• ••••"}</div>
            <div style={{display:"flex",gap:34}}><span><small>CARD HOLDER</small>{(form.name||"YOUR NAME").toUpperCase()}</span><span><small>EXPIRES</small>{form.cexp||"MM/YY"}</span></div></div>
          {F("cnum","Card number","4242 4242 4242 4242")}
          <div className="frow">{F("cexp","Expiry","MM/YY")}{F("ccvc","CVC","123")}</div></>
        : pay==="paypal"? <p style={{color:"var(--ink2)",background:"var(--bg2)",borderRadius:12,padding:"12px 14px"}}>You will confirm this payment with PayPal on the next step in the live store. For this demo, just place the order below.</p>
        : <p style={{color:"var(--ink2)",background:"var(--bg2)",borderRadius:12,padding:"12px 14px"}}>Keep <b>{fmt(total)}</b> ready in cash. Our rider carries a receipt and change up to $50.</p>}
        <button className="btn" style={{width:"100%",justifyContent:"center",marginTop:8}} onClick={place}>{"🔒 Place Order — "+fmt(total)}</button></div>
      <div className="summary reveal">
        <h3 className="serif" style={{marginBottom:8}}>Order summary</h3>
        {cart.map(i=><div key={i.id} className="citem" style={{marginBottom:10}}>
          <img src={i.img} alt={i.name} />
          <div style={{flex:1}}><b style={{fontSize:14.5}}>{i.name}</b><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
            <span className="qty"><button onClick={()=>setQty(i.id,i.qty-1)}>−</button><b>{i.qty}</b><button onClick={()=>setQty(i.id,i.qty+1)}>+</button></span>
            <span className="price" style={{fontSize:16}}>{fmt(i.price*i.qty)}</span></div></div></div>)}
        <div>{sub>=75? <span style={{color:"var(--sage)",fontWeight:800,fontSize:13.5}}>🎉 You've unlocked FREE shipping!</span> : <span style={{fontSize:13.5,color:"var(--ink2)"}}>Add <b>{fmt(75-sub)}</b> more for FREE shipping</span>}
          <div className="freebar"><i style={{width:Math.min(100,sub/75*100)+"%"}}></i></div></div>
        <div className="srow"><span>Subtotal</span><span>{fmt(sub)}</span></div>
        <div className="srow"><span>Shipping</span><span>{ship===0?"FREE":fmt(ship)}</span></div>
        <div className="srow"><span>Tax (5%)</span><span>{fmt(tax)}</span></div>
        <div className="srow total"><span>Total</span><span>{fmt(total)}</span></div>
        <p style={{color:"var(--ink2)",fontSize:13,marginTop:10}}>🔒 SSL-encrypted checkout • ↩️ 7-day returns & exchange • 🌱 Plastic-free packaging</p></div></div>}</section></div>;
}

/* ================= APP ================= */
function App(){
  const [page,setPage] = useState("home");
  const [cart,setCart] = useState([]);
  const [wishSet,setWishSet] = useState(new Set());
  const [drawer,setDrawer] = useState(false);
  const [quickP,setQuickP] = useState(null);
  const [toasts,setToasts] = useState([]);
  const [menu,setMenu] = useState(false);
  const [top,setTop] = useState(false);
  const [popKey,setPopKey] = useState(0);
  const toast = useCallback((msg,act)=>{ const id=Date.now()+Math.random(); setToasts(t=>[...t,{id,msg,act}]); setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3800); },[]);
  const go = p => { setPage(p); setMenu(false); window.scrollTo({top:0,behavior:"smooth"}); };
  const goDeals = () => { setMenu(false); const scroll=()=>{ const el=document.getElementById("deals"); if(el) el.scrollIntoView({behavior:"smooth",block:"start"}); };
    if(page!=="home"){ setPage("home"); setTimeout(scroll,600); } else scroll(); };
  const add = useCallback(p=>{ setCart(c=>{ const f=c.find(i=>i.id===p.id); return f? c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i) : [...c,{...p,qty:1}]; }); setPopKey(k=>k+1); toast("🧺 Added: "+p.name,{label:"View Cart →",fn:()=>setDrawer(true)}); },[toast]);
  const onWish = p => { setWishSet(s=>{ const n=new Set(s); if(n.has(p.id)){ n.delete(p.id); toast("Removed from wishlist."); } else { n.add(p.id); toast("❤️ Saved to your wishlist."); } return n; }); };
  const setQty = (id,q)=> setCart(c=> q<=0? c.filter(i=>i.id!==id) : c.map(i=>i.id===id?{...i,qty:q}:i));
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const sub = cart.reduce((s,i)=>s+i.price*i.qty,0);
  useEffect(()=>{ const f=()=>{ setTop(scrollY>500);
      const hd=document.querySelector("header"); if(hd) hd.classList.toggle("scrolled",scrollY>12);
      const bar=document.getElementById("scroll-progress"); const max=document.documentElement.scrollHeight-innerHeight;
      if(bar) bar.style.transform="scaleX("+(max>0? Math.min(1,scrollY/max):0)+")"; };
    f(); addEventListener("scroll",f,{passive:true}); return ()=>removeEventListener("scroll",f); },[page]);
  useEffect(()=>{ /* Global scroll-reveal — watches every page, including elements added later (cart, checkout, modals) */
    const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }),{threshold:.1,rootMargin:"0px 0px -24px 0px"});
    const watch=root=>{ if(!root||!root.querySelectorAll) return; root.querySelectorAll(".reveal:not(.in)").forEach(el=>io.observe(el)); };
    watch(document);
    const mo=new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{ if(n.nodeType===1){ if(n.classList&&n.classList.contains("reveal")&&!n.classList.contains("in")) io.observe(n); watch(n); } })));
    mo.observe(document.body,{childList:true,subtree:true});
    return ()=>{ io.disconnect(); mo.disconnect(); };
  },[page]);
  const PAGES=[["home","Home"],["shop","Shop"],["story","Our Story & Film"],["checkout","Checkout"]];
  return <>
    <div id="scroll-progress" aria-hidden="true"></div>
    <header><div className="wrap nav">
      <a className="logo" href="#" onClick={e=>{e.preventDefault();go("home");}}><img className="logo-img" src="assets/logo.png" alt="Crafts from Hands — Traditional Handicrafts, Colourful Homes" /><span className="logo-text"><b>Crafts from Hands</b><span>Traditional Handicrafts</span></span></a>
      <nav className={"navlinks"+(menu?" open":"")}>{PAGES.map(p=><button key={p[0]} className={page===p[0]?"on":""} onClick={()=>go(p[0])}>{p[1]}</button>)}<button key="deals" onClick={goDeals}>🔥 Deals</button></nav>
      <div style={{marginLeft:"auto",display:"flex",gap:9,alignItems:"center"}}>
        <button className="iconbtn" aria-label="Wishlist" onClick={()=>go("shop")}>❤️{wishSet.size? <span className="badge">{wishSet.size}</span>:null}</button>
        <button className="iconbtn" aria-label="Cart" onClick={()=>setDrawer(true)}>🧺{count? <span className={"badge"+(popKey?" pop":"")} key={popKey}>{count}</span>:null}</button>
        <button className="iconbtn burger" aria-label="Menu" onClick={()=>setMenu(!menu)}>☰</button></div></div></header>
    <main key={page} className="page-enter">
      {page==="home" && <HomePage go={go} add={add} wishSet={wishSet} onWish={onWish} quick={setQuickP} />}
      {page==="shop" && <ShopPage add={add} wishSet={wishSet} onWish={onWish} quick={setQuickP} />}
      {page==="story" && <StoryPage go={go} />}
      {page==="returns" && <PolicyPage kind="returns" go={go} />}
      {page==="shipping" && <PolicyPage kind="shipping" go={go} />}
      {page==="privacy" && <PolicyPage kind="privacy" go={go} />}
      {page==="contact" && <ContactPage go={go} />}
      {page==="checkout" && <CheckoutPage cart={cart} setQty={setQty} clearCart={silent=>setCart([])} toast={toast} go={go} />}</main>
    <footer><div className="wrap">
      <div className="fgrid">
        <div><img className="footer-logo" src="assets/logo.png" alt="Crafts from Hands emblem" /><h4>Crafts from Hands</h4><p style={{fontSize:14.5,opacity:.85}}>Hand-woven straw mats, placemats and wall hangings — made by artisan hands in Pakistan, in the colours of the homeland, delivered with the maker's name on every parcel.</p></div>
        <div><h4>Shop</h4><ul>{["Woven Mats & Placemats","Wall Hangings","Mirror Centre Mats","Tassel Collection","All 12 Pieces"].map(c=><li key={c}><a href="#" onClick={e=>{e.preventDefault();go("shop");}}>{c}</a></li>)}</ul></div>
        <div><h4>Help</h4><ul>
          <li><a href="#" onClick={e=>{e.preventDefault();go("shipping");}}>Shipping & Delivery</a></li>
          <li><a href="#" onClick={e=>{e.preventDefault();go("returns");}}>Returns & Exchange (7 days)</a></li>
          <li><a href="#" onClick={e=>{e.preventDefault();go("contact");}}>Contact Us</a></li>
          {["Care Instructions","Gift Cards","Wholesale"].map(x=><li key={x}><a href="#" onClick={e=>e.preventDefault()}>{x}</a></li>)}</ul></div>
        <div><h4>Policies</h4><ul>
          <li><a href="#" onClick={e=>{e.preventDefault();go("returns");}}>Returns & Exchange Policy</a></li>
          <li><a href="#" onClick={e=>{e.preventDefault();go("shipping");}}>Shipping & Delivery Policy</a></li>
          <li><a href="#" onClick={e=>{e.preventDefault();go("privacy");}}>Privacy Policy</a></li></ul></div>
        <div><h4>Visit</h4><ul><li>Crafts from Hands, Lahore, Pakistan</li><li>Craft Fair Stall 12, Weekend Bazaar, Lahore</li><li>Studio open Sat–Sun, 10am–6pm</li><li>mkaleem9755@gmail.com</li><li>Phone / WhatsApp: +92 335 9993942</li></ul></div></div>
      <p style={{opacity:.6,fontSize:13,marginTop:26}}>© 2026 Crafts from Hands. Demo storefront — checkout validates in your browser and takes no real payment. All product photos are the owner's own woven pieces, cleaned onto a simple studio background.</p></div></footer>
    <div className={"overlay"+(drawer||quickP?" on":"")} onClick={()=>{setDrawer(false);setQuickP(null);}}></div>
    <aside className={"drawer"+(drawer?" on":"")} aria-hidden={!drawer}>
      <header><h3 className="serif" style={{fontSize:21}}>{"Your Basket ("+count+")"}</h3><button className="iconbtn" onClick={()=>setDrawer(false)}>✕</button></header>
      <div className="items">
        {cart.length===0? <p style={{color:"var(--ink2)",textAlign:"center",marginTop:30}}>Your basket is empty — the wheel is still spinning, go pick a piece 🌀</p>
        : cart.map(i=><div key={i.id} className="citem"><img src={i.img} alt={i.name} />
            <div style={{flex:1}}><b style={{fontSize:14.5}}>{i.name}</b>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
                <span className="qty"><button onClick={()=>setQty(i.id,i.qty-1)}>−</button><b>{i.qty}</b><button onClick={()=>setQty(i.id,i.qty+1)}>+</button></span>
                <span className="price" style={{fontSize:16}}>{fmt(i.price*i.qty)}</span></div></div>
            <button style={{background:"none",border:"none",color:"var(--ink2)",fontSize:17,alignSelf:"start"}} aria-label="Remove" onClick={()=>setQty(i.id,0)}>✕</button></div>)}
      </div>
      {cart.length? <div className="foot">
        <div className="srow"><span>Subtotal</span><b>{fmt(sub)}</b></div>
        <p style={{color:"var(--ink2)",fontSize:13,margin:"2px 0 12px"}}>{sub>=75?"🎉 FREE shipping unlocked!":"Add "+fmt(75-sub)+" more for FREE shipping"}</p>
        <button className="btn" style={{width:"100%",justifyContent:"center"}} onClick={()=>{setDrawer(false);go("checkout");}}>Proceed to Checkout →</button></div>:null}</aside>
    {quickP? <div className="modal on"><div className="box">
      <div className="qv">
        <QVImg p={quickP} />
        <div className="info">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}><span className="chip">{quickP.cat}</span><button className="iconbtn" onClick={()=>setQuickP(null)}>✕</button></div>
          <h3 className="serif" style={{fontSize:25,margin:"10px 0 6px"}}>{quickP.name}</h3>
          <div className="stars">{stars(quickP.rating)}<span>{" "+quickP.rating+" · "+quickP.rev+" reviews"}</span></div>
          <p style={{color:"var(--ink2)"}}>{quickP.desc}</p>
          <p><span className="price" style={{fontSize:24}}>{fmt(quickP.price)}</span>{quickP.old? <span className="oldprice">{fmt(quickP.old)}</span>:null}</p>
          <ul style={{color:"var(--ink2)",fontSize:14.5,paddingLeft:18}}>
            <li>100% handmade — signed by the maker</li><li>Ships in 2 working days, plastic-free</li><li>7-day returns & exchange</li></ul>
          <button className="btn" style={{width:"100%",justifyContent:"center"}} onClick={()=>{add(quickP);setQuickP(null);}}>{"Add to Cart — "+fmt(quickP.price)}</button></div></div></div></div>:null}
    <Toasts list={toasts} />
    {top? <button className="fab" aria-label="Back to top" onClick={()=>scrollTo({top:0,behavior:"smooth"})}>↑</button> : null}</>;
}

export default App;
