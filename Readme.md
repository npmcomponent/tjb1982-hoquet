
# hoquet

  Simple JavaScript templating based on Clojure's Hiccup


## Installation

Install with [component(1)](http://component.io):

    $ component install tjb1982/hoquet

Install with npm:

    $ npm install --save hoquet


## Example
```javascript
var http = require('http'),
    h = require('hoquet');

function layout(c) {
  var out =
    ['html',
     ['head',
      ['title', c.title],
      h.styles('/css/reset.css',
               '/css/style.css'),
      c.head],
     ['body', {'ng-app':'MyApp'}, c.body]];
  
  return out;
}

var index = layout({
  title: 'My Page',
  body: ['div', {'ng-view':''},
         ['h1', 'Hello world']],
  head: [['meta', {'name':'description',
                   'content':'Templating'}],
         h.scripts('/js/lib/angular.min.js',
                   '/js/lib/jquery.min.js')]
});

http.createServer(function(q,s) {
  s.writeHead(200, {'Content-Type': 'text/html'});
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

## API

### .render

function that takes a structured array or a variable list of structured arrays and converts them to a String of HTML.

e.g.

```javascript

    var hoquet = require('hoquet');
    
    hoquet.render(['p','foo'],['p','bar']);
    // <p>foo</p><p>bar</p>
    
    hoquet.render([['p','foo'],['p','bar']]);
    // <p>foo</p><p>bar</p>
    
    hoquet.render([[[[[['p','foo'],['p','bar']]]]]]);
    // <p>foo</p><p>bar</p>

    
    hoquet.render(['p', 'This is a ', ['span', 'paragraph'], ' with a span']);
    // <p>This is a <span>paragraph</span> with a span</p>

    hoquet.render(['div',{id: 'foo', class: 'bar'}, null]);
    //<div id="foo" class="bar"></div>

    hoquet.render(['meta', {foo: 'bar'}]);
    // <meta foo="bar" />

    hoquet.render(['ul', ['bread', 'milk', 'eggs'].map(function(x) {
      return(['li', x]);
    })]);
    // <ul><li>bread</li><li>milk</li><li>eggs</li></ul>
```

> for more specifics, see `./test/test.js`

### .scripts

convenience method for creating script tags by src attr

### .styles

convenience method for creating style tags by href attr


## Testing

From the repo root:

```
npm install
npm test
```

## License

MIT

