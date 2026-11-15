import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fontes locais (public/fonts) — licença SIL Open Font License.
loadFont({ family: "Inter Tight", url: staticFile("fonts/InterTight.woff2"), weight: "100 900" });
loadFont({ family: "Instrument Serif", url: staticFile("fonts/InstrumentSerif.woff2"), weight: "400" });
loadFont({ family: "Instrument Serif Italic", url: staticFile("fonts/InstrumentSerif-Italic.woff2"), weight: "400" });
loadFont({ family: "JetBrains Mono", url: staticFile("fonts/JetBrainsMono.woff2"), weight: "100 800" });

export const fonts = {
  sans: "Inter Tight",
  serif: "Instrument Serif",
  serifItalic: "Instrument Serif Italic",
  mono: "JetBrains Mono",
};

export const colors = {
  paper: "#F6F5F2",
  ink: "#121212",
  muted: "#6B6B6B",
  line: "#E4E2DD",
  purple: "#7B6CF0",
  highlight: "#C8BFFB",
  amber: "#E39A3B",
  brown: "#9C6B45",
  dark: "#2A2A2E",
  green: "#2F8F5B",
  red: "#E5484D",
};

// Edite aqui os textos do vídeo.
export const textos = {
  marca: "colportor",
  handle: "@colportor",
  citacao1: {
    texto:
      "Se há uma obra mais importante do que outra, é a de levar ao público as nossas publicações, levando-o assim a examinar as Escrituras.",
    destaque: "mais importante",
    fonte: "Ellen G. White · Colportor-Evangelista, p. 7",
  },
  citacao2: {
    texto:
      "A obra de colportagem, devidamente dirigida, é obra missionária da mais elevada ordem.",
    destaque: "da mais elevada ordem",
    fonte: "Ellen G. White · Testemunhos para a Igreja, v. 6, p. 313",
  },
  citacao3: {
    texto:
      "Deus chama obreiros de todas as igrejas dentre nosso povo para entrarem em Seu serviço como colportores-evangelistas.",
    destaque: "Deus chama obreiros",
    fonte: "Ellen G. White · Colportor-Evangelista, p. 20",
  },
};
