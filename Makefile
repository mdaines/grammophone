parser: src/parser.js

src/parser.js: src/parser.l src/parser.y
	jison src/parser.y src/parser.l --module-type=js --output-file=src/Parser.js
	mv src/Parser.js src/parser.js

clean:
	rm src/parser.js
