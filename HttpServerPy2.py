## Porting HttpServer.py to Python 2
import os
import SimpleHTTPServer
import SocketServer
import json


# Port on which server will run.
PORT = 8080
# File path relative to the current directory
# TODO file name should be dynamically determined.
# Prhaps send a content from the app
PREFIX    = "p"
DIRECTORY = "results"
EXTENSION = ".csv"

class HTTPRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    
    def do_POST(self):
        # Get length of the data and read it.
        length = self.headers['content-length']
        data = self.rfile.read(int(length)) #TODO: Now I am sending JSON. Parse it to create unique file names
        
# Write the data to a file in current dir.
        filename = PREFIX + json.loads(data.decode("utf-8"))['participant'] + EXTENSION
        path = os.path.join(os.getcwd(), DIRECTORY, filename)
        with open(path, 'wb') as file:
            file.write(data)  
            
        # Send success response.
        self.send_header('Content-type', 'text/json')
        self.send_response(200, 'OK')
        self.end_headers()
        
Handler = HTTPRequestHandler
httpd = SocketServer.TCPServer(("", PORT), Handler)
print("serving at port", PORT)
httpd.serve_forever()
        
        