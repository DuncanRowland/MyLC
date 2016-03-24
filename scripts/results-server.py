import tornado.httpserver
import tornado.ioloop
import tornado.web
import json
import re
from subprocess import check_output
import datetime

class csvRequestHandler(tornado.web.RequestHandler):
    def get(self):
        jsonStrings = check_output(["mongoexport","--host=127.0.0.1","--port=3001","--db=meteor","--collection=votes"])
        for jsonString in jsonStrings.split('\n'):
           result=""
           try:
               obj = json.loads(jsonString)
               result+=obj['timestamp']+","
               result+=obj['userid']+","
               result+='"'+re.sub(r'\p{Graph}+'," ",obj['comment'])+'",'
               try:
                  for x in range(0,10):
                     result+=obj[str(x)]+','
               except:
                  pass
               self.write(result[:-1]+"\n")
           except:
               pass
        self.set_header('Content-Type', 'text/csv')
        self.set_header('Content-Disposition', 'attachment; filename=results.csv')

class htmlRequestHandler(tornado.web.RequestHandler):
    def get(self):
        jsonStrings = check_output(["mongoexport","--host=127.0.0.1","--port=3001","--db=meteor","--collection=votes"])
        self.write('<html><head><script src="static/sorttable.js"></script></head><body>')
        self.write('<table class="sortable" style="width:100%;border-collapse:collapse" border="1">')
        self.write('<tr><th>Date</th><th>Map</th><th>Comment</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr>')
        for jsonString in jsonStrings.split('\n'):
           result='<tr>'
           try:
              obj = json.loads(jsonString)
              ts=obj['timestamp']
              d=datetime.datetime.fromtimestamp(14400.0+(float(ts)/1000.0)).strftime('%Y-%m-%d %H:%M:%S')
              result+='<td>'+d+'</td>'
              result+='<td><a href=http://www.mylincolnshirecollection.org/r/'+obj['userid']+'>Map</a></td>'
              result+='<td>'+re.sub(r'\p{Graph}+'," ",obj['comment'])+'</td>'
              try:
                 for x in range(0,10):
                    result+='<td>'+obj[str(x)]+'</td>'
              except:
                 pass
              self.write(result[:-1]+'</tr>')
           except:
               pass
        self.write('</table></body></html>')
        self.set_header('Content-Type', 'text/html')

application = tornado.web.Application([
    (r"/results.csv", csvRequestHandler),
    (r"/results.html", htmlRequestHandler),
    (r"/static/(.*)", tornado.web.StaticFileHandler, {'path': 'static'})
])

if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(43210)
    tornado.ioloop.IOLoop.instance().start()

