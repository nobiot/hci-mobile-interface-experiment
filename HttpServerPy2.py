## Porting HttpServer.py to Python 2
import os
import SimpleHTTPServer
import SocketServer
import json
import csv
import collections


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

        # json object is not sorted by the trial
        # thus ordered dictionary object is used to sort by trial
        s = json.loads(data.decode("utf-8"))
        o = collections.OrderedDict(sorted(s.items()))
        print(s)
        print(o)
        participant = o['1'][0]

filename = PREFIX + participant + EXTENSION
        path = os.path.join(os.getcwd(), DIRECTORY, filename)
        with open(path, 'w') as file:
            w = csv.writer(file, 'excel')
            w.writerows(o.values())
            
        # Send success response.
        self.send_header('Content-type', 'text/json')
        self.send_response(200, 'OK')
        self.end_headers()
        
Handler = HTTPRequestHandler
httpd = SocketServer.TCPServer(("", PORT), Handler)
print("serving at port", PORT)
httpd.serve_forever()
        
        