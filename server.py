"""Serves xmen-history.html and forwards ComicVine requests, adding your API key server-side.
1. Paste your key below (or set the COMICVINE_KEY environment variable).
2. Run:  python3 server.py   then open http://localhost:8000
"""
import os, json, urllib.request, urllib.error
from urllib.parse import urlsplit, parse_qsl, urlencode
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

API_KEY = os.environ.get('COMICVINE_KEY', 'PASTE_YOUR_KEY_HERE')
PORT = 8000

class Handler(SimpleHTTPRequestHandler):
    def reply(self, code, body, ctype='application/json'):
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parts = urlsplit(self.path)
        if parts.path.startswith('/cv/api/'):
            if API_KEY == 'PASTE_YOUR_KEY_HERE':
                return self.reply(500, b'{"status_code":0,"error":"Add your key to server.py"}')
            q = [(k, v) for k, v in parse_qsl(parts.query) if k != 'api_key'] + [('api_key', API_KEY)]
            url = 'https://comicvine.gamespot.com' + parts.path[3:] + '?' + urlencode(q)
            req = urllib.request.Request(url, headers={'User-Agent': 'xmen-history-app'})
            try:
                with urllib.request.urlopen(req, timeout=15) as r:
                    return self.reply(r.status, r.read())
            except urllib.error.HTTPError as e:
                return self.reply(e.code, e.read())
            except Exception as e:
                return self.reply(502, json.dumps({'status_code': 0, 'error': str(e)}).encode())
        if parts.path in ('/', '/xmen-history.html'):  # serve only the page, never server.py
            self.path = '/xmen-history.html'
            return super().do_GET()
        self.send_error(404)

if __name__ == '__main__':
    print(f'Open http://localhost:{PORT}')
    ThreadingHTTPServer(('', PORT), Handler).serve_forever()
