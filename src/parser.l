var name;

%s QUOTED
%s NAME

%%

<INITIAL>"\"" { this.begin("QUOTED"); name = ""; }
<QUOTED>[\"] { this.begin("INITIAL"); yytext = name; return "NAME"; }
<QUOTED><<EOF>> { return "INVALID"; }
<QUOTED>[^\"]* { name += yytext; }

<INITIAL>\s+ { }

<INITIAL>"->"    { return "ARROW"; }
<INITIAL>"|"     { return "CHOICE"; }
<INITIAL>"."     { return "STOP"; }
<INITIAL><<EOF>> { }

<INITIAL>"\\". { this.begin("NAME"); name = yytext[1]; }
<INITIAL>. { this.begin("NAME"); name = yytext; }

<NAME>"->"    { this.unput("->"); this.begin("INITIAL"); yytext = name; return "NAME"; }
<NAME>"|"     { this.unput("|"); this.begin("INITIAL"); yytext = name; return "NAME"; }
<NAME>"."     { this.unput("."); this.begin("INITIAL"); yytext = name; return "NAME"; }
<NAME><<EOF>> { yytext = name; return "NAME"; }

<NAME>\s+ { this.begin("INITIAL"); yytext = name; return "NAME"; }
<NAME>"\\". { name += yytext[1]; }
<NAME>.   { name += yytext; }

<INITIAL>. { return "INVALID"; }

%%