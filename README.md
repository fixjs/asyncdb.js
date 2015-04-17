# AsyncDB

AsyncDB is a lightweight wrapper on top of [async-local-storage](https://github.com/slightlyoff/async-local-storage) which allows to have a simple and async `localStorage` without having to deal with as said: all the [performance hazards of localStorage.](https://blog.mozilla.org/tglek/2012/02/22/psa-dom-local-storage-considered-harmful/).

All credits goes to [async-local-storage](https://github.com/slightlyoff/async-local-storage) API and of course [lodash](https://lodash.com/).

## Installation

Install with [Bower](http://bower.io):

```
bower install --save asyncdb
```

The component can be used as a CommonJS module, an AMD module, or a global.

## API
To use AsyncDB in your JavaScript code, you could simply add it as a script tag:

```html
<script src="asyncdb.js"></script>
```
Or require it as an AMD or CommonJS module. Then you could use it like:

```javascript
var AsyncDB = require('asyncdb'),
  db = AsyncDB.load(['users', 'apps']);

db.users.insert({  })
  .then(function(userId){
    
  });

db.users.findOne({  })
  .then(function(user){
    
  });

db.apps.findOne({  })
  .then(function(app){
    
  });
```

or using `ES6` function generators and `yield` keyword and a helper library like [DefineJS](https://github.com/fixjs/define.js) or [co](https://github.com/tj/co):

```javascript
var userId = yield db.users.insert({ });

var user = yield db.users.findOne({ });

var app = yield db.apps.findOne({ });
```

It is all about making it easy to store offline data in the browser.