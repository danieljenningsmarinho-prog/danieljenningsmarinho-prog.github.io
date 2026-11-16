# Aventuri ANSR 2026 · Nosso Amiguinho — motion graphic (Remotion)

Plano de operação da equipe Nosso Amiguinho no Aventuri da ANSR, de 20 a 23/11/2026.

- `index.html` — player com os vídeos renderizados: loop automático, pausar/reproduzir, voltar/avançar cena e alternância 9:16 ⇄ 16:9.
- `out/AventuriVertical.mp4` (1080×1920) e `out/AventuriHorizontal.mp4` (1920×1080) — 65 s, sem áudio.
- `src/` — projeto Remotion (cenas em `src/scenes.tsx`, ícones SVG em `src/icons.tsx`).

```bash
npm install
npx remotion studio            # editar/pré-visualizar
npx remotion render src/index.ts AventuriVertical out/AventuriVertical.mp4
npx remotion render src/index.ts AventuriHorizontal out/AventuriHorizontal.mp4
```
