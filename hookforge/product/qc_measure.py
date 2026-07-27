# HookForge QC 실측 스크립트 (Production Bible §8)
# 용도: before/after 데모 영상의 피부 개선도 + 배경 조명 드리프트 실측
# 실행: Higgsfield 샌드박스에서 `python3 qc_measure.py <video.mp4>` (ffmpeg·numpy·PIL 필요)
# 판정 기준은 production_bible.md §2 (L2: 밝기 +8~12%, Lstd -20~28%, 배경 ΔL<=3, Δb<=2)
import subprocess, re, json, sys
import numpy as np
from PIL import Image


def cuts(path):
    p = subprocess.run(
        ['ffmpeg', '-i', path, '-vf', "select='gt(scene,0.22)',metadata=print:file=-",
         '-an', '-f', 'null', '-'], capture_output=True, text=True)
    ts = []
    for line in (p.stdout + p.stderr).splitlines():
        m = re.search(r'pts_time:([0-9.]+)', line)
        if m:
            ts.append(round(float(m.group(1)), 2))
    return sorted(set(ts))


def grab(path, t, out):
    subprocess.run(['ffmpeg', '-y', '-ss', str(t), '-i', path, '-frames:v', '1', out],
                   capture_output=True)


def rgb2lab(a):
    a = a.copy()
    m = a > 0.04045
    a[m] = ((a[m] + 0.055) / 1.055) ** 2.4
    a[~m] = a[~m] / 12.92
    M = np.array([[0.4124, 0.3576, 0.1805],
                  [0.2126, 0.7152, 0.0722],
                  [0.0193, 0.1192, 0.9505]])
    xyz = a @ M.T
    xyz = xyz / np.array([0.95047, 1.0, 1.08883])
    e = 0.008856
    k = 903.3
    f = np.where(xyz > e, np.cbrt(xyz), (k * xyz + 16) / 116)
    return 116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])


def metrics(img):
    im = np.asarray(Image.open(img).convert('RGB'), dtype=np.float64) / 255.0
    H, W, _ = im.shape
    face = im[int(H * 0.08):int(H * 0.60), int(W * 0.18):int(W * 0.82)]
    bg = np.concatenate([
        im[int(H * 0.05):int(H * 0.50), :int(W * 0.12)].reshape(-1, 3),
        im[int(H * 0.05):int(H * 0.50), int(W * 0.88):].reshape(-1, 3)])
    r, g, b = face[..., 0], face[..., 1], face[..., 2]
    Y = 0.299 * r + 0.587 * g + 0.114 * b
    Cr = (r - Y) * 0.713 + 0.5
    Cb = (b - Y) * 0.564 + 0.5
    mask = (Cr > 0.531) & (Cr < 0.682) & (Cb > 0.302) & (Cb < 0.498) & (Y > 0.15) & (Y < 0.95)
    if mask.sum() < 4000:
        return None
    L, A, _ = rgb2lab(face)
    gy, gx = np.gradient(L)
    tex = np.sqrt(gy ** 2 + gx ** 2)[mask]
    Lb, Ab, Bb = rgb2lab(bg.reshape(-1, 1, 3))
    return dict(n=int(mask.sum()), L=float(L[mask].mean()), Lstd=float(L[mask].std()),
                a=float(A[mask].mean()), astd=float(A[mask].std()), tex=float(tex.mean()),
                bgL=float(Lb.mean()), bgb=float(Bb.mean()))


def measure(path):
    cs = cuts(path)
    main = [c for c in cs if 3.0 < c < 9.5]
    cut = main[0] if main else 6.0
    pre = [max(0.6, cut * 0.3), cut * 0.6, max(0.7, cut - 0.9)]
    post = [min(11.3, cut + 0.9), cut + (11.3 - cut) * 0.55, 11.1]

    def avg(ts, pref):
        ms = []
        for i, t in enumerate(ts):
            f = f'/tmp/qc_{pref}{i}.png'
            grab(path, t, f)
            m = metrics(f)
            if m:
                ms.append(m)
        return {k: float(np.mean([m[k] for m in ms])) for k in ms[0]} if ms else None

    b, a = avg(pre, 'b'), avg(post, 'a')
    rep = dict(cuts=cs[:6], cut_used=cut, before=b, after=a)
    if b and a:
        rep['deltas'] = {
            'brightness_pct': round((a['L'] - b['L']) / b['L'] * 100, 1),
            'uniformity_pct': round((b['Lstd'] - a['Lstd']) / b['Lstd'] * 100, 1),
            'blotch_pct': round((b['astd'] - a['astd']) / b['astd'] * 100, 1),
            'texture_pct': round((b['tex'] - a['tex']) / b['tex'] * 100, 1),
            'bg_dL': round(a['bgL'] - b['bgL'], 1),
            'bg_db': round(a['bgb'] - b['bgb'], 1),
        }
        d = rep['deltas']
        rep['lighting_ok'] = abs(d['bg_dL']) <= 3 and abs(d['bg_db']) <= 2
    return rep


if __name__ == '__main__':
    print(json.dumps(measure(sys.argv[1]), indent=1))
