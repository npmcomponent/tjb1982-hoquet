# hoquet

JavaScript templating loosely based on Clojure's Hiccup.

## Example
```javascript
var http = require('http'),
    h = require('hoquet');

function layout(c) {
  var out =
    ["html",
     ["head",
      ["title", c.title],
      h.styles('/css/reset.css',
               '/css/style.css'),
      c.head],
     ["body", {"ng-app":"MyApp"}, c.body]];
  
  return out;
}

var index = layout({
  title: 'My Page',
  body: ["div", {"ng-view":""},
         ["h1", 'Hello world']],
  head: [["meta", {"name":"description",
                   "content":"Templating"}],
         h.scripts('/js/lib/angular.min.js',
                   '/js/lib/jquery.min.js')]
});

http.createServer(function(q,s) {
  s.writeHead(200, {"Content-Type": "text/html"});
  s.end( h.doc('html5', index) );
}).listen(8080);
```

outputs:

```html
<!doctype html>
<html>
  <head>
    <title>My Page</title>
    <link rel="stylesheet" type="text/css" href="/css/reset.css" />
    <link rel="stylesheet" type="text/css" href="/css/style.css" />
    <meta name="description" content="Templating" />
    <script type="text/javascript" src="/js/lib/angular.min.js"></script>
    <script type="text/javascript" src="/js/lib/jquery.min.js"></script>
  </head>
  <body ng-app="MyApp">
    <div ng-view="">
      <h1>Hello world</h1>
    </div>
  </body>
</html>
```

## Installation

Install with npm:

```
npm install --save hoquet
```


## API

### hoquet()


## Testing

From the repo root:

```
npm install
npm test
```
