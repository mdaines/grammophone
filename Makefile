all: concat

concat: src/parser.js
	cat `find ./lib ./src -type f -name '*.js' | sort | tr '\n' ' '` > grammar.js

src/parser.js: src/parser.l src/parser.y
	jison src/parser.y src/parser.l --module-type=js --output-file=src/Parser.js
	mv src/Parser.js src/parser.js
