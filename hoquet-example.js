var http = require('http'),
    h = require('./hoquet');

function layout(c) {
  var out;
  return out =
    ['html',
     ['head',
      ['title', c.title],
      h.styles('/css/reset.css',
               '/css/style.css'),
      c.head],
     ['body', {'ng-app':'MyApp'}, c.body]];
}

var index = layout({
  title: 'My Page',
  body: ['div', {'ng-view':''},
         ['h1', 'Hello world!']],
  head: [['meta', {'name':'description',
                   'content':'Templating'}],
         h.scripts('/js/lib/angular.min.js',
                   '/js/lib/jquery.min.js')]
});

http.createServer(function(q,s) {
  s.writeHead(200, {'Content-Type': 'text/html'});
  s.end( h.doc('html5', index) );
}).listen(8080);

