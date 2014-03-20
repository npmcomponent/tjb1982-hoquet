*This repository is a mirror of the [component](http://component.io) module [tjb1982/hoquet](http://github.com/tjb1982/hoquet). It has been modified to work with NPM+Browserify. You can install it using the command `npm install npmcomponent/tjb1982-hoquet`. Please do not open issues or send pull requests against this repo. If you have issues with this repo, report it to [npmcomponent](https://github.com/airportyh/npmcomponent).*
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
  return (
    ['html',
     ['head',
      ['title', c.title],
      h.styles('/css/reset.css',
               '/css/style.css'),
      c.head],
     ['body', {'ng-app':'MyApp'}, c.body]]
  );
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

convenience method for creating basic script tags by src attr

    hoquet.scripts('js/main.js', 'js/foo.js');
    // <script type="text/javascript" src="js/main.js"></script><script ...></script>

### .styles

convenience method for creating basic style tags by href attr

    hoquet.styles('css/main.css', 'css/foo.css');
    // <link rel="stylesheet" href="css/main.css" /><link ... />

### .doc

convenience method that creates an HTML document (only HTML5 right now):
    
    hoquet.doc('html5', hoquetArray);
    
which basically does:

    return "<!doctype html>" + hoquet.render(hoquetArray);

## Testing

From the repo root:

```
npm install
npm test
```

## License

MIT

