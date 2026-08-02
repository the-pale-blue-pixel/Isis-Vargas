const PROYECTOS=[{id:"umbral-de-falla",nombre:"Umbral de Falla"},{id:"en-lista-de-espera",nombre:"En Lista de espera"},{id:"anos-luz",nombre:"Años Luz"},{id:"hacer-tierra",nombre:"Hacer Tierra"},{id:"tepetl-txt",nombre:"tepetl.txt"},{id:"hello-voyager",nombre:"Hello Voyager"},{id:"entre-lineas",nombre:"Entre líneas"}];
const lista=document.getElementById("lista-proyectos"),indice=document.getElementById("indice-proyectos");
PROYECTOS.forEach(p=>{const href="#proyecto-"+p.id;[lista,indice].forEach((contenedor,i)=>{const li=document.createElement("li"),a=document.createElement("a");a.href=href;a.textContent=p.nombre;if(!i)a.dataset.nav="proyecto-"+p.id;li.appendChild(a);contenedor.appendChild(li)})});
const paginas=[...document.querySelectorAll(".page")];
function mostrarPagina(){const id=location.hash.slice(1)||"inicio";let destino=document.getElementById(id);if(!destino)destino=document.getElementById("inicio");paginas.forEach(p=>p.classList.toggle("activa",p===destino));document.querySelectorAll("[data-nav]").forEach(a=>a.classList.toggle("activo",a.dataset.nav===destino.id));window.scrollTo({top:0,left:0,behavior:"instant"});requestAnimationFrame(alinearImagenesDeProyecto)}
addEventListener("hashchange",mostrarPagina);addEventListener("DOMContentLoaded",mostrarPagina);

// Iguala cada pareja a la imagen visualmente más corta. De este modo,
// la imagen más corta queda completa y solo se recorta la que sobresale.
function alinearImagenesDeProyecto(){
  document.querySelectorAll(".project-columns").forEach(grupo=>{
    const imagenes=[...grupo.querySelectorAll(".project-column > img")];
    imagenes.forEach(img=>img.style.height="");
    if(matchMedia("(max-width: 920px)").matches||imagenes.length<2)return;
    if(imagenes.some(img=>!img.complete||!img.naturalWidth))return;
    const anchos=imagenes.map(img=>img.clientWidth);
    if(anchos.some(ancho=>ancho<=0))return;
    const alturas=imagenes.map((img,i)=>anchos[i]*(img.naturalHeight/img.naturalWidth));
    const alturaObjetivo=Math.min(...alturas);
    imagenes.forEach(img=>img.style.height=`${alturaObjetivo}px`);
  });
}
document.querySelectorAll(".project-columns img").forEach(img=>img.addEventListener("load",alinearImagenesDeProyecto));
addEventListener("DOMContentLoaded",alinearImagenesDeProyecto);
let temporizadorImagenes;
addEventListener("resize",()=>{clearTimeout(temporizadorImagenes);temporizadorImagenes=setTimeout(alinearImagenesDeProyecto,120)});
const langBtn=document.getElementById("lang-toggle");let idioma="es";langBtn.addEventListener("click",()=>{idioma=idioma==="es"?"en":"es";langBtn.textContent=idioma==="es"?"EN":"ES";document.documentElement.dataset.lang=idioma;document.querySelectorAll("[data-es][data-en]").forEach(el=>el.textContent=el.dataset[idioma])});
const FORMSPREE_ENDPOINT="https://formspree.io/f/mwvgdayg";
document.getElementById("form-contacto").addEventListener("submit",async e=>{e.preventDefault();const form=e.currentTarget,estado=document.getElementById("form-estado"),boton=form.querySelector("button[type=submit]");if(!FORMSPREE_ENDPOINT){estado.textContent="Formulario pendiente de conexión.";return}boton.disabled=true;estado.textContent="Enviando…";try{const response=await fetch(FORMSPREE_ENDPOINT,{method:"POST",body:new FormData(form),headers:{Accept:"application/json"}});if(!response.ok)throw new Error();form.reset();estado.textContent="Mensaje enviado. Gracias."}catch{estado.textContent="No se pudo enviar. Inténtalo nuevamente."}finally{boton.disabled=false}});

const GRAPH={
  "tiempo":["paisaje","años luz","memoria","escala"],
  "años luz":["electromagnetismo","luz","glitch","interferencia","estática","textil","antena","tiempo"],
  "tepetl.txt":["volcán","sismología","geología","telar de cintura","Popocatépetl","residencia","archivo"],
  "residencia":["tepetl.txt","Tsonami","Hello World","Snowapple","umbral de falla","entre líneas"],
  "volcán":["geología","montaña","erupción","placas tectónicas","paisaje","Popocatépetl"],
  "entre líneas":["Hello World","residencia","textil","Arduino","sonoro","voz","intimidad","hilo termocrómico"],
  "umbral de falla":["Valparaíso","residencia","sonoro","instalación","transductor","rocas","sismología","tensión"],
  "en lista de espera":["robótica","ESP32","tiempo","placas tectónicas","sismología","textil","datos sísmicos"],
  "hacer tierra":["electromagnetismo","rayo","tormenta","ESP32","transductor","luz","antena","territorio"],
  "sonoro":["voz","escucha","transductor"],
  "textil":["bordado","telar de cintura","hilo termocrómico"],
  "electromagnetismo":["antena","interferencia","estática","luz","rayo","tormenta"],
  "geología":["montaña","rocas","placas tectónicas","sismología"],
  "paisaje":["montaña","territorio","memoria"],
  "montaña":["Popocatépetl"],
  "robótica":["ESP32","Arduino","automatización"],
  "transductor":["vibración","instalación"],
  "antena":["interferencia","estática"],
  "voz":["conversación","intimidad","escucha"]
};

function iniciarGrafo(){
  const host=document.getElementById("grafo-conceptos");
  const wrap=host.parentElement;
  const names=[...new Set(Object.entries(GRAPH).flatMap(([a,b])=>[a,...b]))];
  const degree=Object.fromEntries(names.map(n=>[n,0]));
  const links=[],edgeKeys=new Set();
  Object.entries(GRAPH).forEach(([source,targets])=>targets.forEach(target=>{const key=[source,target].sort().join("|");if(edgeKeys.has(key))return;edgeKeys.add(key);links.push({source,target});degree[source]++;degree[target]++}));
  const nodes=names.map(id=>({id,label:id,link_count:degree[id],color:"#ff2f92"}));
  let width=wrap.clientWidth,height=wrap.clientHeight,selectedNode=null;
  const mobile=matchMedia("(max-width: 620px)").matches;
  const svg=d3.select(host).append("svg").attr("width",width).attr("height",height).attr("viewBox",`0 0 ${width} ${height}`);
  const main=svg.append("g");
  svg.call(d3.zoom().scaleExtent([.1,4]).on("zoom",()=>main.attr("transform",d3.event.transform)));
  const linked={};links.forEach(l=>{linked[l.source+","+l.target]=1;linked[l.target+","+l.source]=1});
  const isConnected=(a,b)=>a.id===b.id||linked[a.id+","+b.id]||linked[b.id+","+a.id];
  const link=main.append("g").attr("class","links").selectAll("line").data(links).enter().append("line").attr("class","link");
  const groups=main.append("g").attr("class","nodes").selectAll(".node").data(nodes).enter().append("g").attr("class","node");
  groups.append("path").attr("class","node-symbol").attr("d",d3.symbol().type(d3.symbolCircle).size(d=>(50+Math.pow(5+Math.sqrt(d.link_count),2))*.4)).attr("fill",d=>d.color);
  groups.append("text").attr("class","node-text").attr("x",d=>(5+Math.sqrt(d.link_count))*.7+5).attr("y",".31em").text(d=>d.label);
  main.select(".nodes").raise();
  const simulation=d3.forceSimulation(nodes)
    .force("link",d3.forceLink(links).id(d=>d.id).distance(d=>mobile?Math.min(105,Math.max(48,(d.source.link_count+d.target.link_count)*6)):Math.min(180,Math.max(60,(d.source.link_count+d.target.link_count)*10))))
    .force("charge",d3.forceManyBody().strength(mobile?-120:-260))
    .force("center",d3.forceCenter(width/2,height/2))
    .force("x",d3.forceX(width/2).strength(mobile?.055:.028))
    .force("y",d3.forceY(height/2).strength(mobile?.055:.028))
    .force("collision",d3.forceCollide().radius(d=>(5+Math.sqrt(d.link_count))*.7+d.label.length*3+8).strength(.85))
    .alphaDecay(mobile?.025:.014).alphaMin(.002)
    .on("tick",()=>{nodes.forEach(d=>{const fontWidth=mobile?5.6:6.7,left=30,right=Math.max(left,width-(d.label.length*fontWidth+42)),top=34,bottom=Math.max(top,height-34);d.x=Math.max(left,Math.min(right,d.x));d.y=Math.max(top,Math.min(bottom,d.y))});link.attr("x1",d=>d.source.x).attr("y1",d=>d.source.y).attr("x2",d=>d.target.x).attr("y2",d=>d.target.y);groups.attr("transform",d=>`translate(${d.x},${d.y}) scale(${selectedNode&&isConnected(selectedNode,d)?1.15:1})`)});
  groups.call(d3.drag().on("start",d=>{if(!d3.event.active)simulation.alphaTarget(.25).restart();d.fx=d.x;d.fy=d.y}).on("drag",d=>{d.fx=d3.event.x;d.fy=d3.event.y}).on("end",d=>{if(!d3.event.active)simulation.alphaTarget(.035);d.fx=null;d.fy=null}));
  groups.on("click",d=>{
    d3.event.stopPropagation();selectedNode=selectedNode&&selectedNode.id===d.id?null:d;
    groups.style("opacity",n=>!selectedNode||isConnected(selectedNode,n)?1:.25);
    groups.selectAll(".node-symbol").attr("fill","#ff2f92");
    groups.selectAll("text").attr("fill",n=>selectedNode&&isConnected(selectedNode,n)?"#151515":"#4b5563").attr("font-weight",n=>selectedNode&&isConnected(selectedNode,n)?"700":"400");
    main.select(".nodes").raise();
    link.style("stroke",l=>selectedNode&&(l.source.id===selectedNode.id||l.target.id===selectedNode.id)?"#ff2f92":"#9ca3af").style("stroke-opacity",l=>!selectedNode?.5:(l.source.id===selectedNode.id||l.target.id===selectedNode.id?1:.08)).style("stroke-width",l=>selectedNode&&(l.source.id===selectedNode.id||l.target.id===selectedNode.id)?2.4:1);
  });
  svg.on("click",()=>{if(!selectedNode)return;selectedNode=null;groups.style("opacity",1);groups.selectAll("text").attr("fill","#4b5563").attr("font-weight","400");link.style("stroke","#9ca3af").style("stroke-opacity",.5).style("stroke-width",1);main.select(".nodes").raise()});
  const floatTimer=d3.interval(()=>{if(simulation.alpha()<.018){const impulse=mobile?.006:.018;nodes.forEach(n=>{if(n.fx==null){n.vx+=(Math.random()-.5)*impulse;n.vy+=(Math.random()-.5)*impulse}});simulation.alpha(mobile?.006:.012).restart()}},mobile?2600:1800);
  new ResizeObserver(()=>{const nextW=wrap.clientWidth,nextH=wrap.clientHeight;if(nextW<10||nextH<10)return;width=nextW;height=nextH;svg.attr("width",width).attr("height",height).attr("viewBox",`0 0 ${width} ${height}`);simulation.force("center",d3.forceCenter(width/2,height/2)).force("x",d3.forceX(width/2).strength(mobile?.055:.028)).force("y",d3.forceY(height/2).strength(mobile?.055:.028)).alpha(.18).restart()}).observe(wrap);
}

if(window.d3)iniciarGrafo();

function iniciarArchivo(){
  const welcome=document.getElementById("archivo-welcome"),tagsHost=document.getElementById("archivo-tags");
  if(!welcome||!tagsHost)return;
  const message="♡ how small a thought it takes to fill a life ♡ ";let cursor=0;
  const type=()=>{if(cursor<message.length){welcome.textContent+=message[cursor++];setTimeout(type,80)}};type();
  tagsHost.innerHTML='<span class="archivo-loading">Cargando archivo…</span>';
  fetch("https://raw.githubusercontent.com/the-pale-blue-pixel/Hiper_Archivo/main/contenido.txt")
    .then(r=>{if(!r.ok)throw new Error("No se pudo cargar contenido.txt");return r.text()})
    .then(text=>{
      const map={};
      text.split(/\r?\n/).forEach(line=>{const parts=line.split(",");if(parts.length<2)return;const title=parts.shift().trim(),rest=parts.join(",").trim(),urlMatch=rest.match(/https?:\/\/[^\s,]+/);if(!title||!urlMatch)return;const hashtags=rest.match(/#[^\s,]+/g)||[];hashtags.forEach(raw=>{const tag=raw.toLowerCase();(map[tag]||(map[tag]=[])).push({title,url:urlMatch[0],hashtags})})});
      tagsHost.innerHTML="";
      Object.keys(map).sort((a,b)=>a.localeCompare(b,"es")).forEach(tag=>{const button=document.createElement("button");button.type="button";button.className="archivo-tag";button.textContent=tag;button.addEventListener("click",()=>abrirArchivoPopup(tag,map));tagsHost.appendChild(button)});
    }).catch(error=>{tagsHost.innerHTML=`<span class="archivo-error">${error.message}</span>`});
}

function abrirArchivoPopup(tag,map){
  document.querySelector(".archivo-popup")?.remove();
  const popup=document.createElement("div");popup.className="archivo-popup";popup.setAttribute("role","dialog");popup.setAttribute("aria-label",tag);
  const left=document.createElement("div");left.className="archivo-popup-left";
  const right=document.createElement("div");right.className="archivo-popup-right";
  const close=document.createElement("button");close.type="button";close.className="archivo-popup-close";close.textContent="×";close.setAttribute("aria-label","Cerrar");close.addEventListener("click",()=>popup.remove());
  const header=document.createElement("div");header.className="archivo-popup-header";header.textContent=tag;right.appendChild(header);
  const populate=selected=>{left.innerHTML="";(map[selected]||[]).forEach(item=>{const a=document.createElement("a");a.href=item.url;a.target="_blank";a.rel="noopener";a.className="archivo-popup-link";a.textContent=item.title;left.append(a,document.createElement("br"))})};populate(tag);
  const related=new Set();(map[tag]||[]).forEach(item=>item.hashtags.forEach(raw=>{const key=raw.toLowerCase();if(key!==tag&&map[key])related.add(key)}));
  [...related].sort((a,b)=>a.localeCompare(b,"es")).forEach(key=>{const button=document.createElement("button");button.type="button";button.className="archivo-related";button.textContent=key;button.addEventListener("click",()=>{header.textContent=key;populate(key)});right.append(button,document.createElement("br"))});
  popup.append(close,left,right);document.body.appendChild(popup);close.focus();
}

iniciarArchivo();
