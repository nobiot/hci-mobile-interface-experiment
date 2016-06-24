# https://reecon.wordpress.com/2014/04/02/simple-http-server-for-testing-get-and-post-requests-python/
# https://docs.python.org/3/library/http.server.html
# http://georgik.sinusgear.com/2011/01/07/how-to-dump-post-request-with-python/

import os
from http.server import BaseHTTPRequestHandler, HTTPServer, http
import socketserver
import logging
import cgi

# Port on which server will run.
PORT = 8080
 
 
class HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
 
    def do_GET(self):
        """ Handle GET Request"""
        logging.error(self.headers)
        http.server.SimpleHTTPRequestHandler.do_GET(self)
 
    def do_POST(self):
        """ Handle POST Request"""
        # Check if path is there.
        if self.path:
 
            # Get length of the data and read it.
            length = self.headers['content-length']
            data = self.rfile.read(int(length))
 
            # Write the data to a file in current dir.
            with open(os.getcwd() + self.path, 'wb') as file:
                file.write(data)
 
            # Send success response.
            self.send_header('Content-type', 'text/json')
            self.send_response(200, 'OK')
            self.end_headers()
        http.server.SimpleHTTPRequestHandler.do_GET(self)  
 

Handler = HTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)
print("serving at port", PORT)
httpd.serve_forever()