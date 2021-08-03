Grammophone
===========

This is a client-side web app for analyzing and transforming context-free grammars. It was developed with the support and guidance of [Robin Cockett](http://pages.cpsc.ucalgary.ca/~robin/) at the [University of Calgary](http://ucalgary.ca), and it's based on his [Context Free Grammar Checker](http://smlweb.cpsc.ucalgary.ca).


Building the app
----------------

Currently the app is built using both Browserify and Rake. Install the JavaScript development dependencies using `yarn`, and ensure you have the version of Ruby installed that is specified by `.ruby-version`.

    yarn install
    rake

Open `build/index.html` to use the app.

To run tests:

    yarn test
