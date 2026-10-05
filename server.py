"""Local MethodA demo: static website + real JSON request/response endpoints.
No contact messages are saved or sent. Python 3 standard library only.
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
import json, re, argparse
ROOT = Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def json_response(self, status, data):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)
    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/api/blogs':
            return self.json_response(200, json.loads((ROOT/'data/blogs.json').read_text()))
        if path.startswith('/api/'):
            return self.json_response(404, {'ok':False,'message':'Endpoint not found.'})
        if path.endswith(('.py','.md')) or '/.' in path:
            return self.send_error(404)
        return super().do_GET()
    def do_POST(self):
        if urlsplit(self.path).path != '/api/contact':
            return self.json_response(404, {'ok':False,'message':'Endpoint not found.'})
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= 16384:
                return self.json_response(413, {'ok':False,'message':'Request too large or empty.'})
            if self.headers.get_content_type() != 'application/json':
                return self.json_response(415, {'ok':False,'message':'Use application/json.'})
            data = json.loads(self.rfile.read(length))
            if not isinstance(data,dict): raise ValueError()
            for key in ('name','email','subject','message'):
                if not isinstance(data.get(key),str) or not data[key].strip(): raise ValueError()
            if not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+',data['email'].strip()): raise ValueError()
            if not 10 <= len(data['message'].strip()) <= 3000 or len(data['name'])>100 or len(data['email'])>254: raise ValueError()
            if data['subject'] not in ['Product Question','Premium Account / Refund','Store / Coins','Support','Early Access','Partnership']: raise ValueError()
        except (ValueError,TypeError,UnicodeDecodeError):
            return self.json_response(400, {'ok':False,'message':'Please provide valid name, email, subject and message fields.'})
        return self.json_response(200, {'ok':True,'demo':True,'message':'Demo enquiry received successfully. No message was stored or sent to MethodA. Thank you for testing the form.'})
    def list_directory(self, path):
        self.send_error(404)
        return None
if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--port',type=int,default=8765)
    args=parser.parse_args()
    print(f'MethodA preview: http://127.0.0.1:{args.port}',flush=True)
    ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
