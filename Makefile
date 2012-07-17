parser: javascripts/parser.js

javascripts/parser.js: javascripts/parser.l javascripts/parser.y
	jison javascripts/parser.y javascripts/parser.l --module-type=js --output-file=javascripts/Parser.js
	mv javascripts/Parser.js javascripts/parser.js
