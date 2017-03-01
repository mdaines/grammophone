Grammophone
===========

This is a client-side web app for analyzing and transforming context-free grammars. It was developed with the support and guidance of [Robin Cockett](http://pages.cpsc.ucalgary.ca/~robin/) at the [Univerity of Calgary](http://ucalgary.ca), and it's based on his [Context Free Grammar Checker](http://smlweb.cpsc.ucalgary.ca).


Become a Patron
---------------

Help make Grammophone better by [supporting me on Patreon](https://patreon.com/mdaines). Thank you!


Building the app
----------------

Rake and Sprockets are used to concatenate the JavaScript source files, compile templates, etc. Install sprockets with `gem install sprockets` and build the app with the default rake task, just `rake`.

[jison](http://zaach.github.com/jison/) is used to build the app's grammar specification parser, but the parser (src/parser.js) is checked into the repository, so you don't have to install jison.

For development, a Rack application is provided which rebuilds the application on every request (see `config.ru`). Install Rack with `gem install rack` and use the `rackup` command to start. By default, the application is available at [http://localhost:9292/](http://localhost:9292).


Tests
-----

Tests can be run by starting the development Rack application with `rackup`, and then opening one of the test pages with your web browser. For example, [http://localhost:9292/test/parsing.html](http://localhost:9292/test/parsing.html) runs the parser tests. Results appear in the browser console.
