var name;

%s NAME
%s PRIMES

%%

<INITIAL>\"(\\.|[^\\"])*\" { yytext = yytext.substr(1, yyleng - 2).replace(/\\(.)/g, "$1"); return "NAME"; }
<INITIAL>\'(\\.|[^\\'])*\' { yytext = yytext.substr(1, yyleng - 2).replace(/\\(.)/g, "$1"); return "NAME"; }
<INITIAL>\s+ { }

<INITIAL>"->"    { return "ARROW"; }
<INITIAL>"|"     { return "CHOICE"; }
<INITIAL>"."     { return "STOP"; }
<INITIAL><<EOF>> { }

<INITIAL>"\\". { this.begin("NAME"); name = yytext[1]; }
<INITIAL>[\"\'] { return "INVALID"; }
<INITIAL>. { this.begin("NAME"); name = yytext; }

<NAME>"->"    { this.unput("->"); this.begin("INITIAL"); yytext = name; return "NAME"; }
<NAME>"|"     { this.unput("|"); this.begin("INITIAL"); yytext = name; return "NAME"; }
<NAME>"."     { this.unput("."); this.begin("INITIAL"); yytext = name; return "NAME"; }
<NAME><<EOF>> { yytext = name; return "NAME"; }

<NAME>\s+ { this.begin("INITIAL"); yytext = name; return "NAME"; }
<NAME>"\\". { name += yytext[1]; }

<NAME>\"   { return "INVALID"; }
<NAME>\'   { this.begin("PRIMES"); name += "'"; }

<NAME>.   { name += yytext; }

<PRIMES>\' { name += "'"; }
<PRIMES>\s+ { this.begin("INITIAL"); yytext = name; return "NAME"; }
<PRIMES>"->"    { this.unput("->"); this.begin("INITIAL"); yytext = name; return "NAME"; }
<PRIMES>"|"     { this.unput("|"); this.begin("INITIAL"); yytext = name; return "NAME"; }
<PRIMES>"."     { this.unput("."); this.begin("INITIAL"); yytext = name; return "NAME"; }
<PRIMES><<EOF>> { yytext = name; return "NAME"; }
<PRIMES>. { return "INVALID"; }

<INITIAL>. { return "INVALID"; }

%%