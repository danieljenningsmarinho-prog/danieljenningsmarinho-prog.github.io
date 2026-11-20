#!/usr/bin/env python3
"""
Transição de zoom com blur (by KJ Productions).

Junta vários trechos de vídeo em um só, 9:16, com:
  - empurrão lento (a câmera vai se aproximando ~3% em cada trecho, nada fica parado);
  - transição de zoom com blur em cada emenda (o trecho que sai "atravessa" a tela
    e o próximo entra desfocado e grande, ficando nítido em 1/4 de segundo).

  python3 transicao.py trecho1.mp4 trecho2.mp4 trecho3.mp4 [--saida montado.mp4]
                       [--empurrao 0.03] [--forca 1.0] [--fps 24]

O áudio de cada trecho é mantido, na mesma ordem.
Precisa de: python3, pillow, numpy e ffmpeg.
"""
import argparse, json, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter

W, H = 1080, 1920


def info(caminho):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type",
                          "-of", "json", caminho], capture_output=True, text=True)
    if out.returncode != 0:
        sys.exit(f"Não consegui ler {caminho}.")
    j = json.loads(out.stdout)
    tem_audio = any(s.get("codec_type") == "audio" for s in j.get("streams", []))
    return float(j["format"]["duration"]), tem_audio


def quadros(caminho, fps):
    """Lê o vídeo já em 1080x1920 (zoom proporcional + corte, nunca estica)."""
    vf = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={fps}"
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", caminho, "-vf", vf, "-f", "rawvideo",
                          "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    tam = W * H * 3
    while True:
        b = p.stdout.read(tam)
        if len(b) < tam:
            break
        yield Image.frombuffer("RGB", (W, H), b)
    p.wait()


def zoom(img, z):
    if abs(z - 1) < 1e-4:
        return img
    cw, ch = W / z, H / z
    x0, y0 = (W - cw) / 2, (H - ch) / 2
    return img.resize((W, H), Image.BICUBIC, box=(x0, y0, x0 + cw, y0 + ch))


def main():
    ap = argparse.ArgumentParser(description="Transição de zoom com blur (KJ)")
    ap.add_argument("trechos", nargs="+")
    ap.add_argument("--saida", default="montado.mp4")
    ap.add_argument("--empurrao", type=float, default=0.03)
    ap.add_argument("--forca", type=float, default=1.0, help="intensidade da transição (0.5 a 1.5)")
    ap.add_argument("--fps", type=int, default=24)
    a = ap.parse_args()

    fps = a.fps
    SAI, ENTRA = 3, 6                      # quadros de saída e de entrada em cada emenda
    infos = [info(t) for t in a.trechos]
    video_tmp = a.saida + ".video.mp4"
    enc = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                            "-s", f"{W}x{H}", "-r", str(fps), "-i", "-", "-c:v", "libx264", "-crf", "16",
                            "-preset", "medium", "-pix_fmt", "yuv420p", video_tmp], stdin=subprocess.PIPE)
    ultimo = len(a.trechos) - 1
    for i, (trecho, (dur, _)) in enumerate(zip(a.trechos, infos)):
        n = max(1, int(round(dur * fps)))
        for k, q in enumerate(quadros(trecho, fps)):
            z = 1 + a.empurrao * (k / n)                     # empurrão lento
            blur = 0
            if i > 0 and k < ENTRA:                          # entrada: grande e desfocado -> nítido
                p = 1 - k / ENTRA
                p = p * p
                z *= 1 + 0.22 * a.forca * p
                blur = 14 * a.forca * p
            if i < ultimo and k >= n - SAI:                  # saída: atravessa a tela
                p = (k - (n - SAI) + 1) / SAI
                z *= 1 + 0.16 * a.forca * p
                blur = max(blur, 10 * a.forca * p)
            q = zoom(q, z)
            if blur > 0.3:
                q = q.filter(ImageFilter.GaussianBlur(blur))
            enc.stdin.write(q.tobytes())
        print(f"Trecho {i + 1}/{len(a.trechos)} pronto")
    enc.stdin.close()
    if enc.wait() != 0:
        sys.exit("Erro no ffmpeg (vídeo).")

    # áudio: os trechos em sequência (trecho sem áudio vira silêncio)
    entradas, filtros = [], []
    for i, (trecho, (dur, tem_audio)) in enumerate(zip(a.trechos, infos)):
        if tem_audio:
            entradas += ["-i", trecho]
        else:
            entradas += ["-f", "lavfi", "-t", f"{dur:.3f}", "-i", "anullsrc=r=48000:cl=stereo"]
        filtros.append(f"[{i + 1}:a]aresample=48000,aformat=channel_layouts=stereo[a{i}]")
    junta = "".join(f"[a{i}]" for i in range(len(a.trechos)))
    filtro = ";".join(filtros) + f";{junta}concat=n={len(a.trechos)}:v=0:a=1[a]"
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", video_tmp] + entradas + [
        "-filter_complex", filtro, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac",
        "-b:a", "256k", "-shortest", "-movflags", "+faststart", a.saida]
    if subprocess.call(cmd) != 0:
        sys.exit("Erro no ffmpeg (áudio).")
    try:
        import os
        os.remove(video_tmp)
    except OSError:
        pass
    print("Pronto:", a.saida)


if __name__ == "__main__":
    main()
