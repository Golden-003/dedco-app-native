#!/usr/bin/env python3
"""Split the preview HTML into chunks for chat paste."""
from pathlib import Path

html = Path("/home/z/my-project/download/dedcco-design-system-preview.html").read_text(encoding="utf-8")
print(f"Total: {len(html)} chars ({len(html)//1024}KB)")

# Split into chunks of ~35000 chars
CHUNK_SIZE = 35000
chunks = []
for i in range(0, len(html), CHUNK_SIZE):
    chunks.append(html[i:i+CHUNK_SIZE])

print(f"Chunks: {len(chunks)}")
for i, c in enumerate(chunks):
    out = Path(f"/tmp/dedco-chunk-{i+1}.txt")
    out.write_text(c, encoding="utf-8")
    print(f"  Chunk {i+1}: {len(c)} chars → {out}")
