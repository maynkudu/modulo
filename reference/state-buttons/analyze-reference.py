"""Measure the delivered video. Output observations, not recovered source code."""

import hashlib
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
VIDEO = ROOT / "raw/source.mp4"


def frames(crop):
    command = ["ffmpeg", "-v", "error", "-i", str(VIDEO), "-vf", crop,
               "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    result = subprocess.run(command, check=True, capture_output=True)
    return np.frombuffer(result.stdout, dtype=np.uint8).reshape(-1, 170, 170, 3)


samples = []
for y in (221, 810):
    images = frames(f"crop=170:170:408:{y}")
    cells = []
    for image in images:
        cells.append([
            np.median(image[14 + row * 23:19 + row * 23,
                            14 + col * 23:19 + col * 23], axis=(0, 1)).astype(int).tolist()
            for row in range(7) for col in range(7)
        ])
    samples.append(cells)

data = {"fps": 60, "duration": 4, "columns": 7, "rows": 7,
        "method": "Median RGB of 5x5 center patches in each decoded cell, no inferred easing.",
        "buttons": samples}
(ROOT / "observations/grid-samples.json").write_text(json.dumps(data, separators=(",", ":")))

label_result = subprocess.run([
    "ffmpeg", "-v", "error", "-i", str(VIDEO), "-vf", "crop=540:160:620:235",
    "-f", "rawvideo", "-pix_fmt", "rgb24", "-"
], check=True, capture_output=True)
labels = np.frombuffer(label_result.stdout, dtype=np.uint8).reshape(-1, 160, 540, 3)
minimum = labels.min(axis=0).mean(axis=2)
alpha = np.clip((minimum - 1) / 101, 0, 1)
alpha[alpha < .04] = 0
mask = np.zeros((160, 540, 4), dtype=np.uint8)
mask[:, :, :3] = 255
mask[:, :, 3] = (alpha * 255).astype(np.uint8)
Image.fromarray(mask).save(ROOT / "observations/reference-label-mask.png")
text_colors = []
for label in labels:
    text_colors.append([
        np.percentile(label[:, x:x+8][alpha[:, x:x+8] > .95], 90, axis=0).astype(int).tolist()
        if (alpha[:, x:x+8] > .95).any() else [102, 102, 102]
        for x in range(0, 540, 8)
    ])
(ROOT / "observations/text-samples.json").write_text(json.dumps(text_colors, separators=(",", ":")))

probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_frames",
                        "-show_entries", "frame=pts,pts_time,duration_time", "-of", "json", str(VIDEO)],
                       check=True, capture_output=True, text=True)
(ROOT / "observations/frame-timestamps.json").write_text(probe.stdout)

frame = Image.open(ROOT / "captures/frame-000.png")
frame.crop((312, 152, 1288, 458)).save(ROOT / "captures/top-button-000.png")
frame.crop((312, 741, 1288, 1047)).save(ROOT / "captures/bottom-button-000.png")

origins = {
    "source.m3u8": "https://video.twimg.com/amplify_video/2125155320184127488/pl/avc1/1600x1200/8loedCHH4lfkz233.m3u8",
    "init.mp4": "https://video.twimg.com/amplify_video/2125155320184127488/vid/avc1/0/0/1600x1200/i93gd0MYl2CsIXwd.mp4",
    "segment.m4s": "https://video.twimg.com/amplify_video/2125155320184127488/vid/avc1/0/4000/1600x1200/4EBl2m__Tt8-ZeCr.m4s",
}
manifest = {"source": "https://x.com/uixamjad/status/2125155886922625241",
            "captured": "2026-11-25", "manifestGeneratedAtUtc": datetime.now(timezone.utc).isoformat(), "resources": []}
for path in sorted((ROOT / "raw").iterdir()):
    manifest["resources"].append({"path": str(path.relative_to(ROOT)),
                                   "origin": origins.get(path.name, "Local codec-copy remux of source.m3u8"),
                                   "method": "curl binary download" if path.name in origins else "ffmpeg -c copy, no video re-encoding",
                                   "contentType": "application/vnd.apple.mpegurl" if path.suffix == ".m3u8" else "video/mp4",
                                   "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                                   "bytes": path.stat().st_size,
                                   "terms": "Unknown. Local visual reference only; not licensed for redistribution."})
(ROOT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
print(json.dumps({"frames": len(samples[0]), "cellsPerFrame": 49,
                  "decodedVideoSha256": hashlib.sha256(VIDEO.read_bytes()).hexdigest()}))
