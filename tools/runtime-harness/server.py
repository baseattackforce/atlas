from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import unquote, urlparse

WORK_ROOT = Path(__file__).resolve().parent
REPO_ROOT = Path(r"C:\Users\danny\Documents\synergy")
READABLE_ROOT = REPO_ROOT / "deobfuscated"

class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, request_path):
        clean = unquote(urlparse(request_path).path).lstrip("/")
        if clean.startswith("source/"):
            return str(REPO_ROOT / clean.removeprefix("source/"))
        if clean.startswith("readable/"):
            return str(READABLE_ROOT / clean.removeprefix("readable/"))
        if clean == "sw.js":
            return str(WORK_ROOT / "sw.js")
        if clean.startswith("stuff/"):
            asset = clean.removeprefix("stuff/")
            if asset == "main.js":
                return str(READABLE_ROOT / asset)
            return str(REPO_ROOT / asset)
        return str(WORK_ROOT / clean)

if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 8765), Handler).serve_forever()
