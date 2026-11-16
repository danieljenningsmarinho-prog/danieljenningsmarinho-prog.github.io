# Aventuri ANSR 2026 · Nosso Amiguinho — versão minimalista (HyperFrames)

- `vertical/index.html` (1080×1920) e `horizontal/index.html` (1920×1080): as composições HyperFrames. **São geradas** por `build.mjs`.
- `build.mjs`: o roteiro (textos e duração de cada cena) e as animações GSAP. `style.css`: o visual.
- `renders/`: os MP4 prontos (63,5 s, sem áudio). `index.html`: player com loop, pausar, voltar/avançar cena e troca 9:16 ⇄ 16:9.

```bash
npm install
node build.mjs                                   # regenera as duas composições
npx hyperframes preview vertical                 # pré-visualizar
npx hyperframes render vertical   -o renders/aventuri-vertical.mp4   --quality delivery
npx hyperframes render horizontal -o renders/aventuri-horizontal.mp4 --quality delivery
```

Com o Aponta: na pasta `vertical/` ou `horizontal/`, diga "abre o Aponta nesse vídeo". Como os HTML são gerados, as correções devem ir para `build.mjs`/`style.css`, seguidas de `node build.mjs`.
