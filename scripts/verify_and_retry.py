import hashlib
import os
import time
import subprocess

def get_wiki_url(filename):
    m = hashlib.md5(filename.encode('utf-8')).hexdigest()
    return f"https://upload.wikimedia.org/wikipedia/commons/{m[0]}/{m[0:2]}/{filename}"

tiles = {}
for i in range(1, 10): tiles[f"m{i}"] = f"MJw{i}-.svg"
for i in range(1, 10): tiles[f"p{i}"] = f"MJt{i}-.svg"
for i in range(1, 10): tiles[f"s{i}"] = f"MJs{i}-.svg"
tiles["z1"] = "MJf1-.svg"; tiles["z2"] = "MJf2-.svg"; tiles["z3"] = "MJf3-.svg"; tiles["z4"] = "MJf4-.svg"
tiles["z5"] = "MJd3-.svg"; tiles["z6"] = "MJd2-.svg"; tiles["z7"] = "MJd1-.svg"
tiles["f1"] = "MJh3-.svg"; tiles["f2"] = "MJh4-.svg"; tiles["f3"] = "MJh8-.svg"; tiles["f4"] = "MJh7-.svg"
tiles["f5"] = "MJh1-.svg"; tiles["f6"] = "MJh2-.svg"; tiles["f7"] = "MJh5-.svg"; tiles["f8"] = "MJh6-.svg"

os.makedirs("src/assets/tiles", exist_ok=True)

for local_id, wiki_file in tiles.items():
    filepath = f"src/assets/tiles/{local_id}.svg"

    # Check if file exists and is valid
    is_error = False
    if os.path.exists(filepath):
        with open(filepath, 'r', errors='ignore') as f:
            content = f.read(1000)
            if "Wikimedia Error" in content:
                is_error = True
    else:
        is_error = True

    if is_error:
        url = get_wiki_url(wiki_file)
        print(f"Retrying {local_id} from {url}...")
        # Use curl directly to avoid SSL issues in python
        subprocess.run(["curl", "-L", "-o", filepath, url])
        time.sleep(1.0) # Increased delay
    else:
        print(f"{local_id} is OK.")
