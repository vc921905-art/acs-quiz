import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════
   PALETA ACS
══════════════════════════════════════ */
const G = {
  fundo:    "#03080f",
  fundoMd:  "#060f1e",
  azul:     "#0a1e3d",
  azulNeon: "#0af",
  verde:    "#1db954",
  verdeN:   "#39e075",
  verdeGl:  "#00ff88",
  branco:   "#ffffff",
  cinza:    "rgba(255,255,255,0.55)",
};

/* ══════════════════════════════════════
   BANCO DE PERGUNTAS
══════════════════════════════════════ */
const PERGUNTAS = [
  { cat:"Segurança", icone:"🛡️",
    pergunta:"Ao manusear ácidos concentrados, qual sequência de EPIs é obrigatória?",
    alternativas:["Luvas de látex simples","Luvas nitrílicas, óculos e avental","Apenas máscara de proteção","Nenhum, se o manuseio for rápido"],
    correta:1, explicacao:"Ácidos exigem proteção completa: luvas nitrílicas resistentes, óculos splash-proof e avental químico." },
  { cat:"Qualidade", icone:"⚙️",
    pergunta:"Um laudo de análise garante o quê em uma solução fatorada?",
    alternativas:["O prazo de validade apenas","A concentração e pureza dentro das especificações","O preço do produto","Apenas a origem da matéria-prima"],
    correta:1, explicacao:"O laudo atesta que a solução atende concentração, pureza e rastreabilidade — base da confiança do cliente." },
  { cat:"Logística", icone:"🚚",
    pergunta:"Um pedido urgente está incompleto. Qual a melhor atitude?",
    alternativas:["Enviar incompleto sem comunicar","Cancelar sem avisar","Comunicar o cliente e propor solução imediata","Esperar o estoque chegar"],
    correta:2, explicacao:"Transparência e proatividade mantêm a confiança do cliente mesmo em situações adversas." },
  { cat:"Produção", icone:"🏭",
    pergunta:"Por que a ordem de adição dos reagentes é crítica na produção?",
    alternativas:["É apenas um hábito","Afeta segurança, reação e qualidade final","Somente por questão de tempo","Para economizar reagente"],
    correta:1, explicacao:"A sequência incorreta pode gerar reações exotérmicas, precipitações indesejadas ou produtos fora de especificação." },
  { cat:"Atendimento", icone:"🤝",
    pergunta:"Um cliente reclama de um produto. Qual o primeiro passo?",
    alternativas:["Defender o produto imediatamente","Escutar, registrar e acionar a qualidade","Pedir que ele releia o laudo","Transferir para outro setor"],
    correta:1, explicacao:"Ouvir o cliente com empatia e registrar a ocorrência é o primeiro passo para uma resolução eficaz." },
  { cat:"RH & Cultura", icone:"👥",
    pergunta:"Ao perceber um colega com dificuldade numa tarefa, o correto é:",
    alternativas:["Ignorar, cada um é responsável por si","Criticar na reunião de equipe","Oferecer ajuda e, se necessário, acionar o líder","Fazer a tarefa por ele sem comunicar"],
    correta:2, explicacao:"Colaboração fortalece a equipe e reduz erros. Ajudar e comunicar ao líder é a cultura ACS." },
  { cat:"Boas Práticas", icone:"✅",
    pergunta:"Frascos de reagentes devem ser identificados com:",
    alternativas:["Nome apenas","Nome, concentração, data e responsável","Somente código interno","Nada, se for uso imediato"],
    correta:1, explicacao:"Rastreabilidade completa exige identificação total: produto, concentração, data de preparo e responsável técnico." },
  { cat:"Segurança", icone:"🛡️",
    pergunta:"Resíduos químicos devem ser descartados:",
    alternativas:["No lixo comum","Na pia do laboratório","Em recipientes específicos por classe","No ralo externo"],
    correta:2, explicacao:"O descarte seletivo por classe química é obrigatório por norma ambiental e protege colaboradores e meio ambiente." },
];

const VOCE_SABIA = [
  { titulo:"Solventes HPLC", texto:"A ACS Científica é referência nacional em solventes HPLC, como a Acetonitrila 99,9% Gradiente — utilizada nas análises mais precisas de laboratórios farmacêuticos e de pesquisa.", icone:"🔬" },
  { titulo:"Rastreabilidade Total", texto:"Cada lote produzido na ACS possui número de rastreabilidade único, laudo técnico e certificado de análise — garantindo conformidade com normas ANVISA, USP e INMETRO.", icone:"📋" },
  { titulo:"Soluções Fatoradas", texto:"Soluções fatoradas têm concentração exatamente determinada por titulação analítica. São essenciais para análises volumétricas confiáveis em laboratórios de controle de qualidade.", icone:"⚗️" },
  { titulo:"Segurança Química", texto:"Produtos químicos classificados como perigosos exigem FISPQ atualizada, rotulagem GHS e armazenamento segregado por classe de risco — norma NBR 14725.", icone:"⚠️" },
];

const ERRO_ACERTO = [
  { situacao:"Frasco sem identificação encontrado na bancada.", errado:true, explicacao:"Todo frasco deve ter nome, concentração, data e responsável. Frasco não identificado = risco de contaminação cruzada e erro analítico." },
  { situacao:"Colaborador confere o pedido antes de liberar para expedição.", errado:false, explicacao:"Conferência pré-expedição evita devoluções, retrabalho e garante a satisfação do cliente. Atitude correta!" },
  { situacao:"EPI removido antes do término do manuseio do reagente.", errado:true, explicacao:"O EPI deve ser mantido durante todo o processo e removido apenas após a área estar segura e limpa." },
];

const MENSAGENS_RODAPE = [
  "Qualidade começa em cada etapa",
  "Segurança é compromisso diário",
  "Organização reduz retrabalho",
  "Excelência em cada processo",
  "Juntos fazemos a diferença",
  "Rastreabilidade é confiança",
];

/* ══════════════════════════════════════
   CSS GLOBAL
══════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,300;0,400;0,700;0,900;1,700&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body,html{width:100%;height:100%;overflow:hidden;background:#03080f}

@keyframes fadeIn   { from{opacity:0}to{opacity:1} }
@keyframes fadeOut  { from{opacity:1}to{opacity:0} }
@keyframes slideUp  { from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)} }
@keyframes scaleIn  { from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)} }
@keyframes glowPulse{ 0%,100%{text-shadow:0 0 10px #39e075,0 0 20px #39e07566}50%{text-shadow:0 0 30px #39e075,0 0 60px #00ff8888,0 0 100px #39e07533} }
@keyframes scanLine { 0%{top:-2px}100%{top:100%} }
@keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes particle { 0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:1}90%{opacity:.3}100%{transform:translateY(-120vh) translateX(var(--dx));opacity:0} }
@keyframes ticker   { 0%{transform:translateX(100%)}100%{transform:translateX(-100%)} }
@keyframes blink    { 0%,100%{opacity:1}50%{opacity:.15} }
@keyframes borderGlow{ 0%,100%{box-shadow:0 0 8px #39e07544,inset 0 0 8px #39e07511}50%{box-shadow:0 0 24px #39e07588,inset 0 0 16px #39e07522} }
@keyframes countIn  { from{opacity:0;transform:scale(1.4)}to{opacity:1;transform:scale(1)} }
@keyframes checkDraw{ from{stroke-dashoffset:100}to{stroke-dashoffset:0} }
@keyframes wrongShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)} }
@keyframes hologram { 0%,100%{opacity:1;filter:brightness(1)}50%{opacity:.85;filter:brightness(1.2) hue-rotate(10deg)} }
@keyframes lineMove { 0%{transform:scaleX(0)}100%{transform:scaleX(1)} }
@keyframes floatUp  { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
@keyframes gridMove { 0%{background-position:0 0}100%{background-position:40px 40px} }

.orb { font-family:'Orbitron',monospace; }
.mono{ font-family:'Share Tech Mono',monospace; }
.exo { font-family:'Exo 2',sans-serif; }
.glow-green { animation: glowPulse 2.5s ease-in-out infinite; }
.float { animation: floatUp 3s ease-in-out infinite; }
.hologram { animation: hologram 4s ease-in-out infinite; }
`;

/* ══════════════════════════════════════
   COMPONENTES BASE
══════════════════════════════════════ */

/* Partículas de fundo */
function Particles(){
  const pts = Array.from({length:18},(_,i)=>({
    id:i, x:Math.random()*100, delay:Math.random()*8,
    dur:6+Math.random()*8, size:2+Math.random()*3,
    dx:(Math.random()-0.5)*200,
    color: Math.random()>.5?G.verdeN:G.azulNeon,
  }));
  return(
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:1}}>
      {pts.map(p=>(
        <div key={p.id} style={{
          position:"absolute", bottom:-10, left:`${p.x}%`,
          width:p.size, height:p.size, borderRadius:"50%",
          background:p.color, boxShadow:`0 0 ${p.size*3}px ${p.color}`,
          "--dx":`${p.dx}px`,
          animation:`particle ${p.dur}s ${p.delay}s ease-in infinite`,
          opacity:0,
        }}/>
      ))}
    </div>
  );
}

/* Grade hexagonal */
function HexGrid(){
  return(
    <div style={{
      position:"absolute",inset:0,pointerEvents:"none",zIndex:0,opacity:.18,
      backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 17.3 L60 34.6 L30 52 L0 34.6 L0 17.3Z' fill='none' stroke='%2339e075' stroke-width='0.5'/%3E%3C/svg%3E")`,
      backgroundSize:"60px 52px",
      animation:"gridMove 20s linear infinite",
    }}/>
  );
}

/* Linha de scan */
function ScanLine(){
  return(
    <div style={{
      position:"absolute",left:0,right:0,height:2,pointerEvents:"none",zIndex:30,
      background:"linear-gradient(90deg,transparent,rgba(57,224,117,.4),rgba(0,170,255,.4),transparent)",
      animation:"scanLine 8s linear infinite",
    }}/>
  );
}

/* Logo ACS — imagem PNG real da empresa */
function LogoACS({size=1,animate=false}){
  const s=size;
  const glow = animate ? `drop-shadow(0 0 ${10*s}px rgba(61,191,138,0.75))` : "none";
  return(
    <div style={{display:"flex",alignItems:"center",gap:8*s,
      ...(animate?{animation:"hologram 4s ease-in-out infinite"}:{})}}>
      <svg width={56*s} height={52*s} viewBox="0 0 56 52" fill="none" style={{filter:glow}}>
        <defs>
          <linearGradient id="gtop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6edcb8"/>
            <stop offset="100%" stopColor="#3dbf96"/>
          </linearGradient>
          <linearGradient id="gleft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a9d7c"/>
            <stop offset="100%" stopColor="#1e7a5f"/>
          </linearGradient>
          <linearGradient id="gright" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ec9a0"/>
            <stop offset="100%" stopColor="#3aaf8a"/>
          </linearGradient>
        </defs>
        {/* Face topo */}
        <polygon points="28,2 54,16 28,30 2,16" fill="url(#gtop)"/>
        {/* Face esquerda */}
        <polygon points="2,16 28,30 28,50 2,36" fill="url(#gleft)"/>
        {/* Face direita */}
        {/* Recorte interno — buraco do cubo (logo ACS tem abertura) */}
        <polygon points="28,30 54,16 54,36 28,50" fill="url(#gright)"/>
        {/* Recorte topo */}
        <polygon points="28,10 46,19 28,28 10,19" fill="#1a6b52"/>
        {/* Recorte esquerda */}
        <polygon points="10,19 28,28 28,44 10,34" fill="#155c45"/>
        {/* Recorte direita */}
        <polygon points="28,28 46,19 46,34 28,44" fill="#1e7a5f"/>
        {/* Arestas */}
        <polyline points="28,2 54,16 28,30 2,16 28,2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/>
        <line x1="2" y1="16" x2="2" y2="36" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
        <line x1="28" y1="30" x2="28" y2="50" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
        <line x1="54" y1="16" x2="54" y2="36" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
        <polyline points="2,36 28,50 54,36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
        {/* Arestas internas do recorte */}
        <polyline points="10,19 46,19" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6"/>
        <line x1="10" y1="19" x2="10" y2="34" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6"/>
        <line x1="46" y1="19" x2="46" y2="34" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6"/>
        <polyline points="10,34 28,44 46,34" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6"/>
      </svg>
      <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <div style={{
          fontFamily:"'Arial Black','Arial',sans-serif",
          fontSize:26*s, fontWeight:900, lineHeight:1, color:"#3dbf96",
          letterSpacing:1*s,
          textShadow: animate?`0 0 16px rgba(61,191,138,0.6)`:"none",
        }}>ACS</div>
        <div style={{
          fontFamily:"Arial,sans-serif", fontSize:7.5*s, fontWeight:600,
          color: animate?"#7ab8e8":"#2c4a7c",
          letterSpacing:3.5*s, marginTop:1*s,
        }}>CIENTÍFICA</div>
      </div>
    </div>
  );
}

/* Relógio */
function Relogio(){
  const [t,setT]=useState("");
  useEffect(()=>{
    const upd=()=>setT(new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
    upd(); const id=setInterval(upd,1000); return()=>clearInterval(id);
  },[]);
  return <span className="mono" style={{fontSize:14,color:G.verdeN,letterSpacing:2}}>{t}</span>;
}

/* Cronômetro circular grande */
function BigTimer({total,chave,onEnd}){
  const [s,setS]=useState(total);
  useEffect(()=>{
    setS(total);
    const id=setInterval(()=>setS(p=>{ if(p<=1){clearInterval(id);onEnd&&onEnd();return 0;} return p-1; }),1000);
    return()=>clearInterval(id);
  },[total,chave]);
  const pct=s/total, r=52, cx=60,cy=60, circ=2*Math.PI*r;
  const cor=s>15?G.verdeN:s>5?"#f59e0b":"#ef4444";
  return(
    <div style={{position:"relative",width:120,height:120}}>
      <svg width={120} height={120} viewBox="0 0 120 120" style={{position:"absolute",inset:0}}>
        {/* Rings deco */}
        <circle cx={cx} cy={cy} r={58} fill="none" stroke="rgba(57,224,117,.06)" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={r+10} fill="none" stroke="rgba(57,224,117,.1)" strokeWidth="1" strokeDasharray="4 6"/>
        {/* BG */}
        <circle cx={cx} cy={cy} r={r} fill="#040c18" stroke="#1a3a6a" strokeWidth="5"/>
        {/* Progress */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={cor} strokeWidth="6"
          strokeDasharray={`${circ*pct} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{transition:"stroke-dasharray .9s linear,stroke .4s",filter:`drop-shadow(0 0 8px ${cor})`}}/>
        {/* Triangle */}
        <polygon points={`${cx},4 ${cx+7},16 ${cx-7},16`} fill={cor}
          style={{filter:`drop-shadow(0 0 4px ${cor})`}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",gap:2}}>
        <div className="mono" style={{fontSize:26,fontWeight:700,color:cor,lineHeight:1,
          animation:s<=5?"blink .5s ease-in-out infinite":"none",
          textShadow:`0 0 12px ${cor}`}}>
          {String(Math.floor(s/60)).padStart(2,"0")}:{String(s%60).padStart(2,"0")}
        </div>
        <div style={{fontSize:8,color:"rgba(255,255,255,.35)",letterSpacing:2,textTransform:"uppercase"}}>TEMPO</div>
      </div>
    </div>
  );
}

/* Ticker rodapé */
function Ticker(){
  const [idx,setIdx]=useState(0);
  useEffect(()=>{ const id=setInterval(()=>setIdx(i=>(i+1)%MENSAGENS_RODAPE.length),5000); return()=>clearInterval(id); },[]);
  return(
    <div style={{overflow:"hidden",flex:1,position:"relative",height:"100%",display:"flex",alignItems:"center"}}>
      <div key={idx} style={{
        whiteSpace:"nowrap",
        animation:"ticker 8s linear forwards",
        color:"rgba(255,255,255,.75)",fontSize:13,fontWeight:600,letterSpacing:2,
        textTransform:"uppercase",
      }}>
        ◆ {MENSAGENS_RODAPE[idx]} ◆
      </div>
    </div>
  );
}

/* Frasco químico SVG */
function Frasco({size=1,glow=false}){
  const s=size;
  return(
    <svg width={80*s} height={120*s} viewBox="0 0 80 120" fill="none"
      style={glow?{filter:`drop-shadow(0 0 16px ${G.verdeN})`}:{}}>
      <rect x={28} y={1} width={24} height={13} rx={4} fill="#9ca3af"/>
      <rect x={25} y={14} width={30} height={8} rx={3} fill="#6b7280"/>
      <path d="M16 22 Q6 40 6 72 Q6 112 40 112 Q74 112 74 72 Q74 40 64 22 Z" fill="#92400e" opacity=".85"/>
      <path d="M20 22 Q12 40 12 72 Q12 108 40 108 Q68 108 68 72 Q68 40 60 22 Z" fill="#b45309"/>
      <path d="M22 32 Q17 50 19 68" stroke="rgba(255,255,255,.2)" strokeWidth="4" strokeLinecap="round"/>
      <rect x={14} y={56} width={52} height={38} rx={4} fill="#1a3a6a"/>
      <rect x={14} y={56} width={52} height={6} fill={G.verde}/>
      <text x={40} y={75} textAnchor="middle" fontFamily="Arial Black" fontSize="8" fontWeight="900" fill="#fff">ACS</text>
      <text x={40} y={85} textAnchor="middle" fontFamily="Arial" fontSize="5" fill={G.verdeN} letterSpacing="2">CIENTÍFICA</text>
      <text x={40} y={90} textAnchor="middle" fontFamily="Arial" fontSize="4" fill="rgba(255,255,255,.6)">Reagente P.A.</text>
    </svg>
  );
}

/* Erlenmeyer SVG */
function Erlenmeyer(){
  return(
    <svg width={70} height={100} viewBox="0 0 70 100" fill="none">
      <rect x={28} y={1} width={14} height={10} rx={3} fill="#6b7280"/>
      <path d="M28 11 L28 35 L6 90 L64 90 L42 35 L42 11 Z" fill={`${G.verdeN}22`} stroke={G.verdeN} strokeWidth="1.5"/>
      <ellipse cx={35} cy={90} rx={29} ry={5} fill={`${G.verdeN}44`}/>
      <path d="M28 40 L12 82" stroke={`${G.verdeN}66`} strokeWidth="1" strokeDasharray="3 3"/>
      <ellipse cx={35} cy={65} rx={16} ry={10} fill={`${G.verdeN}33`}/>
    </svg>
  );
}

/* ══════════════════════════════════════
   TELAS
══════════════════════════════════════ */

/* ── ABERTURA ── */
function TelaAbertura({onDone}){
  const [step,setStep]=useState(0);
  useEffect(()=>{
    const ts=[800,1800,2800,3600,5000];
    const ids=ts.map((t,i)=>setTimeout(()=>setStep(i+1),t));
    const fim=setTimeout(onDone,6200);
    return()=>{ ids.forEach(clearTimeout); clearTimeout(fim); };
  },[]);
  return(
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",gap:32,zIndex:50,
      background:`radial-gradient(ellipse at 50% 60%,#0a1e3d 0%,#03080f 70%)`}}>
      <Particles/>
      <HexGrid/>
      {/* Círculos orbitais */}
      <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",
        border:"1px solid rgba(57,224,117,.1)",animation:"rotateSlow 20s linear infinite"}}/>
      <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",
        border:"1px solid rgba(0,170,255,.07)",animation:"rotateSlow 30s linear infinite reverse"}}/>

      {step>=1&&(
        <div style={{animation:"scaleIn .8s cubic-bezier(.22,1,.36,1) both"}}>
          <LogoACS size={1.8} animate/>
        </div>
      )}
      {step>=2&&(
        <div style={{height:2,width:0,background:`linear-gradient(90deg,transparent,${G.verdeN},transparent)`,
          animation:"lineMove .6s ease forwards",width:400}}/>
      )}
      {step>=3&&(
        <div style={{textAlign:"center",animation:"slideUp .7s ease both"}}>
          <div className="orb" style={{fontSize:52,fontWeight:900,color:G.branco,letterSpacing:4,
            textShadow:`0 0 40px ${G.verdeN}88`}} >
            ACS <span style={{color:G.verdeN}}>QUIZ</span>
          </div>
          <div className="exo" style={{fontSize:16,color:G.verdeN,letterSpacing:6,marginTop:8,fontWeight:300,
            textTransform:"uppercase"}}>
            Conhecimento que gera resultados
          </div>
        </div>
      )}
      {step>=4&&(
        <div style={{display:"flex",gap:16,animation:"fadeIn .6s ease both",flexWrap:"wrap",justifyContent:"center"}}>
          {["Produção","Qualidade","Segurança","Logística","RH","Comercial"].map((c,i)=>(
            <div key={c} style={{
              border:`1px solid ${G.verdeN}55`,borderRadius:30,
              padding:"6px 18px",fontSize:11,color:G.verdeN,
              letterSpacing:2,textTransform:"uppercase",fontWeight:700,
              background:"rgba(57,224,117,.08)",
              animation:`fadeIn .4s ${i*.1}s ease both`,
              boxShadow:`0 0 12px ${G.verdeN}22`
            }}>{c}</div>
          ))}
        </div>
      )}
      {step>=5&&(
        <div style={{position:"absolute",bottom:60,display:"flex",alignItems:"center",gap:8,
          color:"rgba(255,255,255,.4)",fontSize:12,animation:"fadeIn .5s ease both"}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:G.verdeN,
            boxShadow:`0 0 8px ${G.verdeN}`,animation:"blink .8s ease-in-out infinite"}}/>
          Iniciando quiz...
        </div>
      )}
    </div>
  );
}

/* ── TRANSIÇÃO DE CATEGORIA ── */
function TelaCategoria({cat,onDone}){
  useEffect(()=>{ const t=setTimeout(onDone,2800); return()=>clearTimeout(t); },[]);
  return(
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",gap:20,zIndex:40,
      background:`radial-gradient(ellipse at 50% 50%,#0a1e3d 0%,#03080f 80%)`}}>
      <Particles/>
      <div style={{fontSize:72,animation:"scaleIn .5s ease both"}}>{cat.icone}</div>
      <div className="orb" style={{fontSize:36,fontWeight:900,color:G.branco,letterSpacing:3,
        textAlign:"center",animation:"slideUp .6s .2s ease both",
        textShadow:`0 0 30px ${G.verdeN}66`}}>
        {cat.cat.toUpperCase()}
      </div>
      <div style={{height:2,width:200,background:`linear-gradient(90deg,transparent,${G.verdeN},transparent)`,
        animation:"lineMove .5s .4s ease both"}}/>
      <div className="exo" style={{fontSize:13,color:G.verdeN,letterSpacing:4,fontWeight:300,
        textTransform:"uppercase",animation:"fadeIn .5s .6s ease both"}}>
        Prepare-se para a pergunta
      </div>
    </div>
  );
}

/* ── QUIZ ── */
function TelaQuiz({q,num,onDone}){
  const [resp,setResp]=useState(null);
  const [fase,setFase]=useState("pergunta"); // pergunta | resposta

  const revelar=useCallback((i)=>{
    if(fase!=="pergunta") return;
    setResp(i); setFase("resposta");
    setTimeout(onDone,5500);
  },[fase,onDone]);

  const L=["A","B","C","D"];
  const corBtn=(i)=>{
    if(fase==="pergunta") return { bg:"rgba(255,255,255,.04)", border:"rgba(255,255,255,.12)", txt:"rgba(255,255,255,.85)" };
    if(i===q.correta)     return { bg:"rgba(29,185,84,.22)",   border:G.verdeN,               txt:"#fff" };
    if(i===resp&&i!==q.correta) return { bg:"rgba(239,68,68,.18)", border:"#ef4444", txt:"rgba(255,255,255,.5)" };
    return { bg:"rgba(255,255,255,.02)", border:"rgba(255,255,255,.05)", txt:"rgba(255,255,255,.3)" };
  };

  return(
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",zIndex:10}}>
      {/* Corpo */}
      <div style={{flex:1,display:"flex",gap:0,overflow:"hidden"}}>

        {/* ESQUERDA */}
        <div style={{width:190,flexShrink:0,background:"rgba(4,12,24,.97)",
          borderRight:"1px solid rgba(57,224,117,.18)",
          display:"flex",flexDirection:"column",padding:"16px 14px",gap:14}}>
          <div style={{animation:"hologram 4s ease-in-out infinite"}}>
            <LogoACS size={.75}/>
          </div>
          <div style={{height:1,background:`linear-gradient(90deg,${G.verdeN}44,transparent)`}}/>
          {/* Categorias */}
          <div style={{fontSize:9,color:"rgba(255,255,255,.35)",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>
            Categorias
          </div>
          {["Produção","Logística","Segurança","Comercial","RH & Cultura","Qualidade","Boas Práticas"].map(c=>{
            const ativa=q.cat.toLowerCase().includes(c.toLowerCase().split(" ")[0]);
            return(
              <div key={c} style={{
                display:"flex",alignItems:"center",gap:8,
                background:ativa?`linear-gradient(90deg,${G.verde}22,transparent)`:"transparent",
                border:ativa?`1px solid ${G.verdeN}44`:"1px solid transparent",
                borderRadius:6,padding:"5px 10px",transition:"all .3s",
                boxShadow:ativa?`0 0 12px ${G.verdeN}22`:""
              }}>
                <div style={{width:6,height:6,borderRadius:"50%",
                  background:ativa?G.verdeN:"rgba(255,255,255,.2)",
                  boxShadow:ativa?`0 0 6px ${G.verdeN}`:""}}/>
                <span style={{fontSize:10,fontWeight:ativa?700:400,
                  color:ativa?G.verdeN:"rgba(255,255,255,.45)",
                  textTransform:"uppercase",letterSpacing:.5}}>{c}</span>
              </div>
            );
          })}
          <div style={{marginTop:"auto"}}>
            <div style={{background:"rgba(57,224,117,.08)",border:"1px solid rgba(57,224,117,.2)",
              borderRadius:8,padding:"10px",textAlign:"center",
              animation:"borderGlow 3s ease-in-out infinite"}}>
              <div style={{color:G.verdeN,fontSize:10,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase"}}>
                PARTICIPE!
              </div>
              <div style={{color:"rgba(255,255,255,.45)",fontSize:8.5,marginTop:4,lineHeight:1.5}}>
                Toque na alternativa<br/>e responda!
              </div>
            </div>
          </div>
        </div>

        {/* CENTRO */}
        <div style={{flex:1,display:"flex",flexDirection:"column",padding:"16px 20px",gap:14,position:"relative"}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{background:`linear-gradient(135deg,${G.verde}22,${G.verde}08)`,
                border:`1px solid ${G.verdeN}44`,borderRadius:8,padding:"5px 14px",
                display:"flex",alignItems:"center",gap:6}}>
                <span>{q.icone}</span>
                <span className="exo" style={{fontSize:10,fontWeight:800,color:G.verdeN,letterSpacing:2,textTransform:"uppercase"}}>
                  {q.cat}
                </span>
              </div>
              <div className="mono" style={{fontSize:10,color:"rgba(255,255,255,.25)",letterSpacing:1}}>
                PERGUNTA #{String(num).padStart(3,"0")}
              </div>
            </div>
            <BigTimer key={`${num}-${fase}`} total={fase==="pergunta"?55:5} chave={`${num}-${fase}`}
              onEnd={()=>{ if(fase==="pergunta") revelar(-1); }}/>
          </div>

          {/* Pergunta */}
          <div style={{
            background:"linear-gradient(135deg,rgba(57,224,117,.07),rgba(57,224,117,.02))",
            border:"1px solid rgba(57,224,117,.2)",borderRadius:14,padding:"18px 22px",
            animation:"borderGlow 4s ease-in-out infinite"
          }}>
            <div className="exo" style={{fontSize:21,fontWeight:800,color:"#fff",lineHeight:1.5}}>
              {q.pergunta}
            </div>
          </div>

          {/* Alternativas */}
          <div style={{display:"flex",flexDirection:"column",gap:10,flex:1}}>
            {q.alternativas.map((alt,i)=>{
              const c=corBtn(i);
              const ok=fase==="resposta"&&i===q.correta;
              const err=fase==="resposta"&&resp===i&&i!==q.correta;
              return(
                <div key={i} onClick={()=>revelar(i)} style={{
                  display:"flex",alignItems:"center",gap:14,
                  background:c.bg, border:`1.5px solid ${c.border}`,
                  borderRadius:12, padding:"11px 16px",
                  cursor:fase==="pergunta"?"pointer":"default",
                  transition:"all .35s ease",
                  boxShadow:ok?`0 0 20px ${G.verdeN}44`:err?"0 0 12px #ef444433":"",
                  transform:ok?"scale(1.015)":"scale(1)",
                  animation:err?"wrongShake .4s ease":"none",
                }}>
                  <div style={{
                    width:42,height:42,borderRadius:10,flexShrink:0,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:ok||err?20:16, fontWeight:900,
                    background:ok?G.verde:err?"#ef4444":i===0?"rgba(29,185,84,.25)":"rgba(26,74,138,.7)",
                    color:"#fff",
                    boxShadow:ok?`0 0 16px ${G.verdeN}`:err?"0 0 12px #ef4444":"",
                    transition:"all .35s",
                  }}>
                    {ok?"✓":err?"✗":L[i]}
                  </div>
                  <span className="exo" style={{fontSize:14,fontWeight:ok?700:500,color:c.txt,lineHeight:1.4,transition:"color .3s"}}>
                    {alt}
                  </span>
                  {ok&&<div style={{marginLeft:"auto",fontSize:10,color:G.verdeN,fontWeight:700,letterSpacing:1,
                    textTransform:"uppercase",whiteSpace:"nowrap"}}>✓ Correta</div>}
                </div>
              );
            })}
          </div>

          {/* Explicação */}
          {fase==="resposta"&&(
            <div style={{
              background:"rgba(29,185,84,.1)",border:`1px solid ${G.verdeN}33`,
              borderRadius:10,padding:"12px 16px",borderLeft:`3px solid ${G.verdeN}`,
              animation:"slideUp .5s ease both"
            }}>
              <div style={{color:G.verdeN,fontSize:9,fontWeight:800,letterSpacing:2,
                textTransform:"uppercase",marginBottom:6}}>💡 Por que essa é a resposta?</div>
              <div className="exo" style={{fontSize:13,color:"rgba(255,255,255,.85)",lineHeight:1.6}}>
                {q.explicacao}
              </div>
            </div>
          )}
          {fase==="pergunta"&&(
            <div style={{textAlign:"center",color:"rgba(255,255,255,.18)",fontSize:9,letterSpacing:2,textTransform:"uppercase"}}>
              ● toque na alternativa para responder ●
            </div>
          )}
        </div>

        {/* DIREITA */}
        <div style={{width:200,flexShrink:0,display:"flex",flexDirection:"column",
          padding:"14px 13px",gap:13,background:"rgba(4,12,24,.6)",
          borderLeft:"1px solid rgba(57,224,117,.14)"}}>
          {/* Você Sabia */}
          {VOCE_SABIA.slice(0,2).map((v,i)=>(
            <div key={i} style={{background:"rgba(10,30,61,.9)",
              border:"1px solid rgba(57,224,117,.18)",borderRadius:12,padding:"12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}>
                <span style={{fontSize:16}}>{v.icone}</span>
                <span className="exo" style={{fontSize:9,fontWeight:800,color:G.verdeCl,letterSpacing:2,textTransform:"uppercase"}}>
                  Você Sabia?
                </span>
              </div>
              <div style={{fontSize:10.5,color:"rgba(255,255,255,.7)",lineHeight:1.6}}>{v.texto}</div>
            </div>
          ))}
          {/* Frasco */}
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",
            background:"rgba(10,30,61,.5)",border:"1px solid rgba(57,224,117,.1)",borderRadius:12,
            animation:"floatUp 4s ease-in-out infinite"}}>
            <Frasco size={.9} glow/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── VOCÊ SABIA (bloco especial) ── */
function TelaVoceSabia({item,onDone}){
  useEffect(()=>{ const t=setTimeout(onDone,7000); return()=>clearTimeout(t); },[]);
  return(
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",gap:28,zIndex:20,padding:"0 80px",
      background:`radial-gradient(ellipse at 30% 50%,#0a2a1a 0%,#03080f 70%)`}}>
      <Particles/>
      <div style={{animation:"scaleIn .6s ease both",fontSize:72}}>{item.icone}</div>
      <div className="orb" style={{fontSize:13,color:G.verdeN,letterSpacing:6,textTransform:"uppercase",
        animation:"fadeIn .5s .2s ease both"}}>● Você Sabia? ●</div>
      <div className="orb" style={{fontSize:34,fontWeight:900,color:"#fff",textAlign:"center",
        animation:"slideUp .6s .3s ease both",textShadow:`0 0 30px ${G.verdeN}55`}}>
        {item.titulo}
      </div>
      <div style={{height:2,width:300,background:`linear-gradient(90deg,transparent,${G.verdeN},transparent)`,
        animation:"lineMove .5s .5s ease both"}}/>
      <div className="exo" style={{fontSize:18,color:"rgba(255,255,255,.82)",textAlign:"center",
        lineHeight:1.7,maxWidth:700,animation:"fadeIn .7s .6s ease both"}}>
        {item.texto}
      </div>
      <div style={{display:"flex",gap:20,marginTop:8}}>
        <Erlenmeyer/><Frasco size={.7} glow/><Erlenmeyer/>
      </div>
    </div>
  );
}

/* ── ERRO OU ACERTO ── */
function TelaErroAcerto({item,onDone}){
  const [fase,setFase]=useState("situacao");
  useEffect(()=>{
    const t1=setTimeout(()=>setFase("veredicto"),3500);
    const t2=setTimeout(onDone,8000);
    return()=>{ clearTimeout(t1);clearTimeout(t2); };
  },[]);
  const errado=item.errado;
  return(
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",gap:28,zIndex:20,
      background:`radial-gradient(ellipse at 50% 40%,${errado?"#1a0a0a":"#0a1a0a"} 0%,#03080f 75%)`}}>
      <Particles/>
      <div className="orb" style={{fontSize:12,color:"rgba(255,255,255,.4)",letterSpacing:5,textTransform:"uppercase"}}>
        ● Erro ou Acerto? ●
      </div>
      <div style={{
        background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.12)",
        borderRadius:16,padding:"28px 48px",maxWidth:700,textAlign:"center",
        animation:"scaleIn .6s ease both"
      }}>
        <div className="exo" style={{fontSize:22,fontWeight:700,color:"#fff",lineHeight:1.5}}>
          {item.situacao}
        </div>
      </div>

      {fase==="veredicto"&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,animation:"slideUp .6s ease both"}}>
          <div style={{
            fontSize:64,
            filter:`drop-shadow(0 0 24px ${errado?"#ef4444":G.verdeN})`,
          }}>
            {errado?"❌":"✅"}
          </div>
          <div className="orb" style={{
            fontSize:30,fontWeight:900,
            color:errado?"#ef4444":G.verdeN,
            textShadow:`0 0 20px ${errado?"#ef4444":G.verdeN}`,
          }}>
            {errado?"ERRADO!":"CORRETO!"}
          </div>
          <div style={{
            background:errado?"rgba(239,68,68,.1)":"rgba(29,185,84,.1)",
            border:`1px solid ${errado?"#ef444444":G.verdeN+"44"}`,
            borderRadius:12,padding:"14px 28px",maxWidth:600,textAlign:"center",
            borderLeft:`3px solid ${errado?"#ef4444":G.verdeN}`
          }}>
            <div className="exo" style={{fontSize:15,color:"rgba(255,255,255,.85)",lineHeight:1.6}}>
              {item.explicacao}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── FECHAMENTO ── */
function TelaFechamento({onDone}){
  const [step,setStep]=useState(0);
  useEffect(()=>{
    const ts=[600,1400,2400,3800];
    const ids=ts.map((t,i)=>setTimeout(()=>setStep(i+1),t));
    const fim=setTimeout(onDone,6000);
    return()=>{ ids.forEach(clearTimeout);clearTimeout(fim); };
  },[]);
  return(
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",gap:32,zIndex:50,
      background:`radial-gradient(ellipse at 50% 40%,#071e14 0%,#03080f 70%)`}}>
      <Particles/>
      <HexGrid/>
      <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",
        border:"1px solid rgba(57,224,117,.08)",animation:"rotateSlow 25s linear infinite"}}/>
      {step>=1&&<div style={{animation:"scaleIn .8s ease both"}}><LogoACS size={1.6} animate/></div>}
      {step>=2&&(
        <div style={{height:2,width:400,background:`linear-gradient(90deg,transparent,${G.verdeN},transparent)`,
          animation:"lineMove .6s ease both"}}/>
      )}
      {step>=3&&(
        <div className="exo" style={{
          fontSize:22,fontWeight:300,color:"rgba(255,255,255,.85)",textAlign:"center",
          maxWidth:620,lineHeight:1.7,letterSpacing:1,
          animation:"slideUp .7s ease both"
        }}>
          "Juntos produzimos<br/>
          <strong style={{color:G.verdeN,fontWeight:700}}>qualidade, segurança e confiança.</strong>"
        </div>
      )}
      {step>=4&&(
        <div style={{display:"flex",gap:24,animation:"fadeIn .6s ease both"}}>
          <Frasco size={.8} glow/><Erlenmeyer/><Frasco size={.8} glow/>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   ORQUESTRADOR PRINCIPAL
══════════════════════════════════════ */
export default function ACSQuizTV(){
  // Sequência: abertura → [cat → quiz → ...] → vcsabia → erracerto → fechamento → loop
  const buildSequence=()=>{
    const seq=[{tipo:"abertura"}];
    PERGUNTAS.forEach((q,i)=>{
      seq.push({tipo:"categoria",data:q});
      seq.push({tipo:"quiz",data:q,num:i+1});
      if((i+1)%3===0){
        const vs=VOCE_SABIA[(i/3)%VOCE_SABIA.length];
        seq.push({tipo:"voce_sabia",data:vs});
      }
      if((i+1)%5===0){
        const ea=ERRO_ACERTO[Math.floor(i/5)%ERRO_ACERTO.length];
        seq.push({tipo:"erro_acerto",data:ea});
      }
    });
    seq.push({tipo:"fechamento"});
    return seq;
  };
  const SEQ=useRef(buildSequence());
  const [idx,setIdx]=useState(0);

  const next=useCallback(()=>{
    setIdx(i=>{ const n=i+1; if(n>=SEQ.current.length){ SEQ.current=buildSequence(); return 0; } return n; });
  },[]);

  const tela=SEQ.current[idx]||SEQ.current[0];
  const [relogio,setRelogio]=useState({h:"--",m:"--",data:""});
  useEffect(()=>{
    const upd=()=>{
      const n=new Date();
      setRelogio({
        h:String(n.getHours()).padStart(2,"0"),
        m:String(n.getMinutes()).padStart(2,"0"),
        data:`${String(n.getDate()).padStart(2,"0")}/${String(n.getMonth()+1).padStart(2,"0")}/${n.getFullYear()}`
      });
    };
    upd(); const id=setInterval(upd,1000); return()=>clearInterval(id);
  },[]);

  return(
    <>
      <style>{CSS}</style>
      <div style={{width:"100vw",height:"100vh",background:G.fundo,
        overflow:"hidden",position:"relative",
        display:"flex",flexDirection:"column"}}>

        <ScanLine/>
        <Particles/>
        <HexGrid/>

        {/* ── HEADER fixo (exceto abertura/fechamento) ── */}
        {tela.tipo!=="abertura"&&tela.tipo!=="fechamento"&&(
          <div style={{
            display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"8px 20px",
            background:"rgba(4,12,24,.98)",
            borderBottom:`2px solid ${G.verdeN}`,
            flexShrink:0,zIndex:25,
            boxShadow:`0 0 20px ${G.verdeN}22`
          }}>
            <div style={{background:`linear-gradient(90deg,${G.verde},#0fa84a)`,
              borderRadius:8,padding:"5px 16px",display:"flex",alignItems:"center",gap:8,
              boxShadow:`0 0 12px ${G.verde}44`}}>
              <span>🧪</span>
              <span className="exo" style={{fontSize:10,fontWeight:800,letterSpacing:2.5,color:"#fff",textTransform:"uppercase"}}>
                PRODUÇÃO · QUALIDADE · SEGURANÇA · LOGÍSTICA · COMERCIAL · PESSOAS
              </span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:20}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:"#ef4444",
                  boxShadow:"0 0 8px #ef4444",animation:"blink 1.2s ease-in-out infinite"}}/>
                <span className="mono" style={{fontSize:9,color:"#ef4444",letterSpacing:2,fontWeight:700}}>AO VIVO</span>
              </div>
              <Relogio/>
              <LogoACS size={.72}/>
            </div>
          </div>
        )}

        {/* ── ÁREA DE TELAS ── */}
        <div style={{flex:1,position:"relative",overflow:"hidden"}}>
          {tela.tipo==="abertura"   && <TelaAbertura onDone={next}/>}
          {tela.tipo==="categoria"  && <TelaCategoria key={idx} cat={tela.data} onDone={next}/>}
          {tela.tipo==="quiz"       && <TelaQuiz key={idx} q={tela.data} num={tela.num} onDone={next}/>}
          {tela.tipo==="voce_sabia" && <TelaVoceSabia key={idx} item={tela.data} onDone={next}/>}
          {tela.tipo==="erro_acerto"&& <TelaErroAcerto key={idx} item={tela.data} onDone={next}/>}
          {tela.tipo==="fechamento" && <TelaFechamento key={idx} onDone={next}/>}
        </div>

        {/* ── RODAPÉ fixo ── */}
        {tela.tipo!=="abertura"&&tela.tipo!=="fechamento"&&(
          <div style={{
            display:"flex",alignItems:"stretch",
            background:"rgba(4,12,24,.98)",
            borderTop:`2px solid ${G.verdeN}`,
            height:62,flexShrink:0,zIndex:25,
            boxShadow:`0 0 20px ${G.verdeN}22`
          }}>
            {[
              {icone:"🎯",titulo:"Nosso Propósito",texto:"Qualidade, segurança e confiança todos os dias."},
              null,
              {icone:"👥",titulo:"Somos ACS",texto:"Excelência em soluções que transformam."},
              {icone:"🛡️",titulo:"Qualidade",texto:"é atitude!"},
            ].map((item,i)=>{
              if(!item) return(
                <div key={i} style={{flex:1.4,display:"flex",flexDirection:"column",
                  alignItems:"center",justifyContent:"center",
                  padding:"0 16px",borderRight:"1px solid rgba(57,224,117,.12)"}}>
                  <div className="exo" style={{color:G.verdeN,fontSize:9,fontWeight:800,letterSpacing:2.5,textTransform:"uppercase"}}>
                    FOCO · COMPROMISSO · INOVAÇÃO
                  </div>
                  <div className="exo" style={{color:"rgba(255,255,255,.65)",fontSize:12,fontStyle:"italic",fontWeight:600,marginTop:3}}>
                    Juntos fazemos a diferença!
                  </div>
                </div>
              );
              return(
                <div key={i} style={{flex:1,display:"flex",alignItems:"center",gap:10,
                  padding:"0 14px",borderRight:"1px solid rgba(57,224,117,.12)"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,
                    background:`linear-gradient(135deg,${G.verde},#0a7a3a)`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,
                    boxShadow:`0 0 10px ${G.verde}44`}}>
                    {item.icone}
                  </div>
                  <div>
                    <div className="exo" style={{color:G.verdeN,fontSize:8.5,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase"}}>
                      {item.titulo}
                    </div>
                    <div className="exo" style={{color:"rgba(255,255,255,.55)",fontSize:9,lineHeight:1.4,marginTop:1}}>
                      {item.texto}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Ticker + relógio */}
            <div style={{flex:1,display:"flex",alignItems:"center",padding:"0 14px",
              borderRight:"1px solid rgba(57,224,117,.12)",overflow:"hidden"}}>
              <Ticker/>
            </div>
            <div style={{width:88,display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center",gap:1}}>
              <span>☀️</span>
              <div className="mono" style={{fontSize:16,fontWeight:700,color:"#fff",letterSpacing:2}}>
                {relogio.h}:{relogio.m}
              </div>
              <div style={{fontSize:8,color:"rgba(255,255,255,.3)",letterSpacing:1}}>{relogio.data}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
