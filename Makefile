all: concat

concat: src/parser.js
	cat ./lib/zepto.js ./src/relation.js ./src/set.js ./src/parser.js ./src/grammar.js ./src/calculations.js ./src/calculations/grammar.js ./src/calculations/parsing.js ./src/calculations/parsing/ll.js ./src/calculations/parsing/lr.js ./src/helpers.js ./src/views.js ./src/views/productions.js ./src/views/sanity.js ./src/views/nullable.js ./src/views/first.js ./src/views/follow.js ./src/views/endable.js ./src/views/ll1_table.js ./src/views/lr_automaton.js ./src/views/lr0_table.js ./src/views/lr1_table.js > grammar.js

src/parser.js: src/parser.l src/parser.y
	jison src/parser.y src/parser.l --module-type=js --output-file=src/Parser.js
	mv src/Parser.js src/parser.js
