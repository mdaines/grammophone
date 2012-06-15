all:
	jison src/parser.y src/parser.l --module-type=js --output-file=src/Parser.js
	mv src/Parser.js src/parser.js
