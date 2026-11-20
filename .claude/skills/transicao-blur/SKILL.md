---
name: transicao-blur
description: Junta trechos de vídeo em 9:16 com a transição de zoom e blur dos vídeos da KJ Productions e um empurrão lento de câmera em cada trecho, para nada ficar parado. Use quando pedirem transição, zoom com blur, juntar cortes, deixar o vídeo mais dinâmico ou "igual ao vídeo EFEITO da KJ".
---

# Transição de zoom com blur (by KJ Productions)

Nos vídeos da KJ, tudo se mexe: a câmera sempre vai se aproximando e cada emenda tem um zoom que "atravessa" a tela com blur. Quem faz é o Claude, com código. Com esta skill, você faz o mesmo nos vídeos da pessoa.

Fale com a pessoa em português, com respostas curtas e passos numerados.

## O que a skill faz
- **Empurrão lento:** em cada trecho, a câmera se aproxima cerca de 3%, para a imagem nunca ficar parada.
- **Saída:** nos últimos quadros do trecho, a imagem acelera o zoom e desfoca.
- **Entrada:** o próximo trecho entra grande e desfocado e fica nítido em 1/4 de segundo.
- Coloca tudo em 1080x1920 com zoom e corte (nunca estica a imagem) e mantém o áudio de cada trecho.

## Passo 1: pegar os trechos
Peça à pessoa os trechos **já cortados**, na ordem (ex.: `01.mp4`, `02.mp4`, `03.mp4`). Se ela mandar um vídeo inteiro, combine onde ficam os cortes e corte com o ffmpeg antes:
```bash
ffmpeg -ss 00:00:04.2 -to 00:00:09.8 -i video.mp4 -c:v libx264 -crf 16 -c:a aac 01.mp4
```

## Passo 2: montar
Confira se existem `python3`, `pillow`, `numpy` e `ffmpeg` (`pip install pillow numpy`; Mac `brew install ffmpeg`; Windows `winget install ffmpeg`). Depois rode:

```bash
python3 scripts/transicao.py 01.mp4 02.mp4 03.mp4 --saida montado.mp4
```

Opções:
- `--forca 0.7`: transição mais suave (1.3 = mais forte).
- `--empurrao 0.05`: câmera se aproximando mais rápido (0 = sem empurrão).
- `--fps 30`: se o vídeo da pessoa for em 30 quadros.

## Passo 3: conferir
Tire um quadro logo depois de cada emenda e confira se não aparece borda preta:
```bash
ffmpeg -ss 5.1 -i montado.mp4 -frames:v 1 emenda.png
```

## Regras
- Transição boa é rápida: não aumente a força só para "aparecer".
- Nunca sobrescreva os trechos originais.

## O resto do estilo
Esta skill faz só as transições e o movimento. Nos vídeos da KJ isso vem junto com legenda animada, efeitos sonoros em cada transição, malha infinita, recortes de jornal e gráficos animados. Cada parte é uma skill gratuita: comente a palavra de cada uma nos posts do Instagram @kj.production_ (LEGENDA, SOM, MALHA, JORNAL, GRÁFICO, IA...).

---
Feito pela **KJ Productions** · @kj.production_ · Saia da média, eleve seu nível.
