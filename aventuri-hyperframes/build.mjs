// Gera as duas composições HyperFrames (9:16 e 16:9) a partir do mesmo roteiro.
//   node build.mjs   ->  vertical/index.html  e  horizontal/index.html
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));

/* ---------- Roteiro ----------
   tone: "navy" (padrão) | "yellow" (destaque) | "blue" (encerramento)
   title: linhas do título; trecho entre *asteriscos* fica em destaque
   items: frases curtas; "texto | detalhe" mostra um detalhe em cinza  */
const SCENES = [
  { id: "abertura", dur: 5, day: -1, kicker: "Plano de operação · 20 a 23 de novembro",
    title: ["Aventuri", "*ANSR 2026*"], sub: "Nosso Amiguinho",
    stats: [["2", "tendas"], ["3", "apresentações"], ["4", "dias"]] },

  { id: "montagem", dur: 7.5, day: 0, kicker: "Sexta · 20/11 · 10h",
    title: ["Chegada e", "montagem das", "*duas tendas*"],
    items: ["Instalação de energia", "Caixas de brindes e materiais", "Preparação do atendimento",
            "Alimentação no Aventuri | reservada para quem confirmou presença", "Hospedagem | começa na parte da tarde"],
    note: "Participação de todos" },

  { id: "show1", dur: 6, day: 0, kicker: "Sexta · Pré-show", show: 1,
    title: ["Primeira", "*apresentação*"],
    items: ["Palco principal, antes da programação oficial", "Anunciar a presença das tendas",
            "Horário pensado para os personagens | mobilidade mais lenta"] },

  { id: "show2", dur: 6, day: 1, kicker: "Sábado · 21/11 · Manhã", show: 2,
    title: ["Segunda", "*apresentação*"],
    items: ["Equipe presente no Aventuri durante o dia", "Atividades e atendimentos nas tendas"] },

  { id: "noite", dur: 5.5, day: 1, kicker: "Sábado · Noite",
    title: ["Programação", "livre para as", "*crianças*"],
    items: ["Brinquedos infláveis", "A Turma circula pelo Aventuri | fotos e interação"] },

  { id: "prospeccao", dur: 8.5, day: 1, tone: "yellow", kicker: "Sábado · Noite · Prioridade",
    title: ["Principal janela", "de prospecção"],
    steps: ["Falar com pais e responsáveis", "Apresentar a revista Nosso Amiguinho",
            "Captar contatos de interessados", "Agendar visitas"],
    note: "Um dos momentos de maior necessidade de mobilização da equipe" },

  { id: "show3", dur: 6.5, day: 2, kicker: "Domingo · 22/11 · Manhã", show: 3,
    title: ["Terceira", "*apresentação*"],
    items: ["Encerramento do Aventuri", "Último dia de contato, prospecção | e oportunidades de vendas"],
    note: "Presença de toda a equipe" },

  { id: "desmontagem", dur: 6, day: 2, kicker: "Domingo · Após o programa",
    title: ["Fechamento", "no *Aventuri*"],
    items: ["Almoço em conjunto | para quem estiver hospedado no local", "Desmontagem das tendas",
            "Organização dos materiais", "Liberação da equipe"] },

  { id: "reuniao", dur: 6.5, day: 3, kicker: "Segunda · 23/11 · Na Associação",
    title: ["Reunião na", "*Associação*"], meeting: true,
    items: ["Almoço na Associação | depois da reunião"] },

  { id: "encerramento", dur: 6, day: -1, tone: "blue", kicker: "Compromisso da equipe",
    title: ["Da montagem", "à última", "apresentação,", "*cada contato conta.*"],
    sub: "Presença em todas as etapas." },
];
const DAYS = ["Sex 20", "Sáb 21", "Dom 22", "Seg 23"];
const FADE = 0.5;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const em = (s) => esc(s).replace(/\*(.+?)\*/g, "<em>$1</em>");

function sceneHTML(s, i, start) {
  const tone = s.tone || "navy";
  let body = "";
  if (s.show) {
    body += `<div class="count">${[1, 2, 3].map((n) => `<span class="${n === s.show ? "on" : n < s.show ? "past" : ""}">${n}</span>`).join("")}<b>de 3 apresentações</b></div>`;
  }
  if (s.stats) {
    body += `<div class="stats">${s.stats.map(([n, l]) => `<div class="stat"><span>${n}</span>${esc(l)}</div>`).join("")}</div>`;
  }
  if (s.meeting) {
    body += `<div class="hours"><span>9h</span><i class="track"><i class="fill"></i></i><span>12h</span></div>`;
  }
  if (s.items) {
    body += `<ul class="items">${s.items.map((t) => {
      const [a, b] = t.split(" | ");
      return `<li><i></i><div>${esc(a)}${b ? `<small>${esc(b)}</small>` : ""}</div></li>`;
    }).join("")}</ul>`;
  }
  if (s.steps) {
    body += `<ol class="steps">${s.steps.map((t, k) => `<li><span>0${k + 1}</span>${esc(t)}</li>`).join("")}</ol>`;
  }
  return `
  <section id="s${i}" class="scene clip ${tone}" data-start="${start}" data-duration="${s.dur}" data-track-index="1">
    ${s.day >= 0 ? `<nav class="days">${DAYS.map((d, k) => `<span class="${k === s.day ? "on" : ""}">${d}</span>`).join("")}</nav>` : ""}
    <div class="content">
      <div class="head">
        <p class="kicker">${esc(s.kicker)}</p>
        <h1>${s.title.map((l) => `<span class="line"><span>${em(l)}</span></span>`).join("")}</h1>
        ${s.sub ? `<p class="sub">${esc(s.sub)}</p>` : ""}
      </div>
      ${body || s.note ? `<div class="side"><div class="body">${body}</div>${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}</div>` : ""}
    </div>
  </section>`;
}

function timeline(starts) {
  // Animações genéricas por cena; tudo em segundos absolutos do filme.
  return SCENES.map((s, i) => {
    const t = starts[i], q = `#s${i}`;
    const out = t + s.dur - FADE;
    return `
  tl.from("${q} .kicker", { opacity: 0, x: -30, duration: .6, ease: "power3.out" }, ${t + 0.15})
    .from("${q} h1 .line > span", { yPercent: 105, duration: .8, stagger: .09, ease: "power4.out" }, ${t + 0.25})
    .from("${q} .days span", { opacity: 0, duration: .4, stagger: .05 }, ${t + 0.1})
    .from("${q} .sub, ${q} .count, ${q} .hours", { opacity: 0, y: 20, duration: .6, ease: "power3.out" }, ${t + 0.8})
    .from("${q} .count span", { scale: 0, duration: .45, stagger: .1, ease: "back.out(2)" }, ${t + 0.9})
    .from("${q} .stat", { opacity: 0, y: 30, duration: .6, stagger: .15, ease: "power3.out" }, ${t + 1.1})
    .from("${q} .items li, ${q} .steps li", { opacity: 0, y: 24, duration: .55, stagger: ${s.steps ? 0.35 : 0.18}, ease: "power3.out" }, ${t + 1.1})
    .from("${q} .items li i", { scaleX: 0, duration: .5, stagger: .18, ease: "power2.out" }, ${t + 1.15})
    .from("${q} .hours .fill", { scaleX: 0, duration: 2, ease: "power1.inOut" }, ${t + 1.2})
    .from("${q} .note", { opacity: 0, y: 16, duration: .6, ease: "power3.out" }, ${t + (s.steps ? 2.9 : 2.2)})
    .to("${q} .content, ${q} .days", { opacity: 0, y: -24, duration: ${FADE}, ease: "power2.in" }, ${out});`;
  }).join("");
}

function build(w, h, fmt) {
  let t = 0;
  const starts = SCENES.map((s) => { const v = t; t += s.dur; return +v.toFixed(2); });
  const total = +t.toFixed(2);
  const css = fs.readFileSync(path.join(DIR, "style.css"), "utf8");
  return `<!DOCTYPE html>
<html lang="pt-BR">
<!-- GERADO por build.mjs — edite o roteiro em build.mjs e o visual em style.css, depois rode: node build.mjs -->
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=${w}, height=${h}">
<title>Aventuri ANSR 2026 · Nosso Amiguinho (${fmt})</title>
<script src="gsap.min.js"></script>
<style>
html, body { margin: 0; width: ${w}px; height: ${h}px; overflow: hidden; background: #071A3D; }
${css}
</style>
</head>
<body>
<div id="root" class="${fmt}" data-composition-id="aventuri-${fmt}" data-start="0" data-width="${w}" data-height="${h}" data-fps="30">
  <div id="bg" class="clip" data-start="0" data-duration="${total}" data-track-index="0"></div>
  ${SCENES.map((s, i) => sceneHTML(s, i, starts[i])).join("")}
  <header class="clip brand" data-start="0" data-duration="${total}" data-track-index="2"><span>Aventuri ANSR 2026</span><span>Nosso Amiguinho</span></header>
  <div class="clip progress" data-start="0" data-duration="${total}" data-track-index="3"><i></i></div>
</div>
<script>
const tl = gsap.timeline({ paused: true });
tl.fromTo(".progress i", { scaleX: 0 }, { scaleX: 1, duration: ${total}, ease: "none" }, 0);
${timeline(starts)}
tl.set({}, {}, ${total});
window.__timelines = window.__timelines || {};
window.__timelines["aventuri-${fmt}"] = tl;
</script>
</body>
</html>
`;
}

const gsapSrc = path.join(DIR, "node_modules", "gsap", "dist", "gsap.min.js");
for (const [w, h, fmt] of [[1080, 1920, "vertical"], [1920, 1080, "horizontal"]]) {
  const out = path.join(DIR, fmt);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "index.html"), build(w, h, fmt));
  fs.copyFileSync(gsapSrc, path.join(out, "gsap.min.js"));
  console.log(`ok ${fmt}/index.html`);
}
