import hashlib
import urllib.request
import os
import time

def get_wiki_url(filename):
    # Calculate MD5 hash of the filename
    m = hashlib.md5(filename.encode('utf-8')).hexdigest()
    # Path is /hash[0]/hash[0:2]/filename
    return f"https://upload.wikimedia.org/wikipedia/commons/{m[0]}/{m[0:2]}/{filename}"

tiles = {}

# Characters (Man) 1-9
for i in range(1, 10):
    tiles[f"m{i}"] = f"MJw{i}-.svg"

# Dots (Pin) 1-9
for i in range(1, 10):
    tiles[f"p{i}"] = f"MJt{i}-.svg"

# Bamboo (Sou) 1-9
for i in range(1, 10):
    tiles[f"s{i}"] = f"MJs{i}-.svg"

# Honors (Winds)
tiles["z1"] = "MJf1-.svg"
tiles["z2"] = "MJf2-.svg"
tiles["z3"] = "MJf3-.svg"
tiles["z4"] = "MJf4-.svg"

# Honors (Dragons)
tiles["z5"] = "MJd3-.svg" # White
tiles["z6"] = "MJd2-.svg" # Green
tiles["z7"] = "MJd1-.svg" # Red

# Flowers & Seasons
tiles["f1"] = "MJh3-.svg" # Plum
tiles["f2"] = "MJh4-.svg" # Orchid
tiles["f3"] = "MJh8-.svg" # Bamboo (Flower)
tiles["f4"] = "MJh7-.svg" # Chrysanthemum
tiles["f5"] = "MJh1-.svg" # Spring
tiles["f6"] = "MJh2-.svg" # Summer
tiles["f7"] = "MJh5-.svg" # Autumn
tiles["f8"] = "MJh6-.svg" # Winter

os.makedirs("src/assets/tiles", exist_ok=True)

for local_id, wiki_file in tiles.items():
    url = get_wiki_url(wiki_file)
    print(f"Downloading {local_id} from {url}...")
    try:
        # User agent to avoid generic bot blocking if any
        req = urllib.request.Request(url, headers={'User-Agent': 'MahjongHandBuilder/1.0 (Contact: sagelga.com)'})
        with urllib.request.urlopen(req) as response:
            with open(f"src/assets/tiles/{local_id}.svg", 'wb') as f:
                f.write(response.read())
        time.sleep(0.5) # Be nice to Wikimedia
    except Exception as e:
        print(f"Failed to download {local_id}: {e}")
