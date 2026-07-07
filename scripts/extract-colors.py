#!/usr/bin/env python3
"""
Extrait les codes couleurs dominants de l'image uploadée.
Utilise KMeans clustering pour identifier les couleurs principales.
"""
from PIL import Image
import numpy as np
from collections import Counter

img_path = '/home/z/my-project/upload/IMG_9775_Original.jpg'
img = Image.open(img_path).convert('RGB')

# Resize pour accélérer (garde les ratios)
img_small = img.resize((200, 150))
pixels = np.array(img_small).reshape(-1, 3)

# Compte les couleurs les plus fréquentes
counter = Counter(tuple(p) for p in pixels)
top_colors = counter.most_common(20)

print("=== 20 couleurs les plus fréquentes ===")
print(f"{'Rang':<5} {'HEX':<10} {'RGB':<20} {'Occurrences':<12} {'%':<6}")
print("-" * 60)
total = sum(c for _, c in top_colors)
for i, ((r, g, b), count) in enumerate(top_colors, 1):
    hex_color = f"#{r:02X}{g:02X}{b:02X}"
    pct = (count / total) * 100
    print(f"{i:<5} {hex_color:<10} ({r:>3}, {g:>3}, {b:>3})       {count:<12} {pct:>5.1f}%")

# Cherche aussi les couleurs vives/saturées (probables couleurs de marque)
print("\n=== Couleurs vives/saturées (potentielles couleurs de marque) ===")
print(f"{'HEX':<10} {'RGB':<20} {'Saturation':<12} {'Luminosité':<12}")
print("-" * 60)
vibrant_colors = []
for (r, g, b), count in top_colors:
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    sat = (max_c - min_c) / max_c if max_c > 0 else 0
    lum = (max_c + min_c) / 2 / 255
    # Filtre : saturation > 0.3 ET luminosité entre 0.2 et 0.85
    if sat > 0.3 and 0.2 < lum < 0.85:
        vibrant_colors.append(((r, g, b), sat, lum, count))

# Trie par occurrences décroissantes
vibrant_colors.sort(key=lambda x: -x[3])
for (r, g, b), sat, lum, count in vibrant_colors[:15]:
    hex_color = f"#{r:02X}{g:02X}{b:02X}"
    print(f"{hex_color:<10} ({r:>3}, {g:>3}, {b:>3})       {sat*100:>8.1f}%   {lum*100:>8.1f}%")

# KMeans clustering pour grouper les couleurs similaires
print("\n=== 8 couleurs principales (KMeans) ===")
from sklearn.cluster import KMeans
kmeans = KMeans(n_clusters=8, random_state=42, n_init=10)
kmeans.fit(pixels)
centers = kmeans.cluster_centers_.astype(int)
labels = kmeans.labels_
label_counts = Counter(labels)

# Trie par taille de cluster
sorted_clusters = sorted(range(8), key=lambda i: -label_counts[i])
for i in sorted_clusters:
    r, g, b = centers[i]
    hex_color = f"#{r:02X}{g:02X}{b:02X}"
    pct = (label_counts[i] / 8) * 12.5  # approx
    real_pct = (label_counts[i] / len(pixels)) * 100
    print(f"  {hex_color}  ({r:>3}, {g:>3}, {b:>3})  — {real_pct:>5.1f}% des pixels")
