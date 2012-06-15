var quotedString;

%s QUOTED

%%

<INITIAL>"\"" { this.begin("QUOTED"); quotedString = ""; }
<QUOTED>[\"] { this.begin("INITIAL"); yytext = quotedString; return "NAME"; }
<QUOTED><<EOF>> { return "INVALID"; }
<QUOTED>[^\"]* { quotedString += yytext; }

<INITIAL>\s+ { }

<INITIAL>"->"    { return "ARROW"; }
<INITIAL>"|"     { return "CHOICE"; }
<INITIAL>"."     { return "STOP"; }
<INITIAL><<EOF>> { return "EOF"; }

<INITIAL>"\\". { yytext = yytext.slice(1); return "NAME"; }
<INITIAL>[^\s|.]+ { return "NAME"; }

<INITIAL>. { return "INVALID"; }

%%