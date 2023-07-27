# Changelog

* Introduce a helper for printing graphs in DOT format. This is used for the automaton components.

* Work around the sentences component not resetting when the grammar changes by wrapping it in another component that uses the grammar as a key.

* Update Viz.js to 3.x. Use `import()` so that the library isn't loaded until an automaton diagram needs to be displayed.

* Catch validation errors from the Grammar constructor.

* Grammar symbols can contain characters outside of ASCII range. Ensure that we can copy links to such grammars by encoding the grammar's spec as UTF-8 before encoding as base64, and decoding from UTF-8 when setting the initial spec.

* Work around URLSearchParams interpreting plus signs as spaces by replacing spaces with plus signs after getting the spec search param.

* Display a status message for a short time on the Copy Link button after the link is copied.

* Use writeText() to copy the grammar URL.

* Add a Copy Link button to the editor pane that copies a URL to the clipboard containing a link with the current grammar spec in a search param. On load, look for this search param and analyze the grammar it specifies if present.

* Change the parser to always succeed, even if there is a parse error. The parser will now return an object with a `productions` key if it succeeds, or an `error` key with an `Error` if it fails.

* Move the App component to its own file so that hot reloading works.

* Copy the LR(1) automaton used in the LALR(1) automaton calculation so that its `lookahead` properties are not replaced with `lookaheads`. Calculations are not supposed to modify the results of other calculations. Introduce a test that calls every possible pair of calculations on a grammar in sequence so that similar problems can be detected.

* Use Node 17.x in workflows. Specifically, this allows use of `structuredClone`.

* Fix that a previous transformation option could remain selected for a nonterminal after applying a transformation, preventing it from being selected again. Instead, the first option should always be selected.

* Correct the example outputs for the LR(1) automaton calculation. These actually had the output of the LALR(1) automaton calculation, which takes as input the LR(1) automaton, and incorrectly overwrites parts of it. This bug is fixed in a later commit.

* Clean up tests, and add test cases (beyond the example outputs) for several calculations.

* Introduce the `calculations` property on `Grammar` instances. This replaces the `getCalculation` method, which took a string identifying a calculation and dispatched to the correct calculation function, memoizing the result. The new property returns an object with individual memoized properties, which can be destructured in calculation functions, like this:

  ```js
  export default function({ symbols, nonterminals }) {
    // ...
  }
  ```
  
  This avoids passing the grammar instance to calculation functions, which aren't really supposed to modify it or depend on it other than asking for calculations, and removes the dotted calculation names like "grammar.terminals".
