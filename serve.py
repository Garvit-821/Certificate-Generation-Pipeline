#!/usr/bin/env python3
"""
Lightweight Web Server for Genesis Certificate Studio
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}/web/index.html"
        print(f"\n=======================================================")
        print(f"🌟 Genesis Certificate Studio & Visual Pipeline")
        print(f"🌐 Server running at: {url}")
        print(f"💡 Press Ctrl+C to stop server")
        print(f"=======================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")

if __name__ == "__main__":
    run()
