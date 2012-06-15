%%

\s+ { }

[^\s\->|.]+ { return "NAME" }

"->"    { return "ARROW" }
"|"     { return "CHOICE" }
"."     { return "STOP" }
<<EOF>> { return "EOF" }

. { return "INVALID" }

%%