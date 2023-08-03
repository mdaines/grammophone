import PathComponent from "./analysis/path_component.jsx";

import * as NonterminalsComponent from "./analysis/nonterminals_component.jsx";
import * as ParsingComponent from "./analysis/parsing_component.jsx";
import * as SanityComponent from "./analysis/sanity_component.jsx";
import * as ShortSentencesComponent from "./analysis/short_sentences_component.jsx";
import * as SentencesComponent from "./analysis/sentences_component.jsx";
import * as LL1TableComponent from "./analysis/parsing/ll1_table_component.jsx";
import * as LR0TableComponent from "./analysis/parsing/lr0_table_component.jsx";
import * as LR1TableComponent from "./analysis/parsing/lr1_table_component.jsx";
import * as LALR1TableComponent from "./analysis/parsing/lalr1_table_component.jsx";
import * as SLR1TableComponent from "./analysis/parsing/slr1_table_component.jsx";
import * as LR0AutomatonComponent from "./analysis/parsing/lr0_automaton_component.jsx";
import * as LR1AutomatonComponent from "./analysis/parsing/lr1_automaton_component.jsx";
import * as LALR1AutomatonComponent from "./analysis/parsing/lalr1_automaton_component.jsx";

import { createHashRouter, RouterProvider, useMatches, Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext, createContext, useEffect } from "react";

export const GrammarContext = createContext(null);

function GrammarContextHost({ Component }) {
  const grammar = useContext(GrammarContext);

  return <Component grammar={grammar} />;
}

const router = createHashRouter([
  {
    path: "/",
    element: <Analysis />,
    handle: { title: "Analysis" },
    children: [
      {
        index: true,
        element: (
          <>
            <GrammarContextHost Component={SanityComponent.default} />
            <GrammarContextHost Component={ShortSentencesComponent.default} />
            <GrammarContextHost Component={NonterminalsComponent.default} />
            <GrammarContextHost Component={ParsingComponent.default} />
          </>
        )
      },
      {
        path: "sentences",
        handle: { title: SentencesComponent.TITLE },
        element: <GrammarContextHost Component={SentencesComponent.default} />
      },
      {
        path: "ll1-table",
        handle: { title: LL1TableComponent.TITLE },
        element: <GrammarContextHost Component={LL1TableComponent.default} />
      },
      {
        path: "lr0-automaton",
        handle: { title: LR0AutomatonComponent.TITLE },
        element: <GrammarContextHost Component={LR0AutomatonComponent.default} />
      },
      {
        path: "lr0-table",
        handle: { title: LR0TableComponent.TITLE },
        element: <GrammarContextHost Component={LR0TableComponent.default} />
      },
      {
        path: "slr1-table",
        handle: { title: SLR1TableComponent.TITLE },
        element: <GrammarContextHost Component={SLR1TableComponent.default} />
      },
      {
        path: "lr1-automaton",
        handle: { title: LR1AutomatonComponent.TITLE },
        element: <GrammarContextHost Component={LR1AutomatonComponent.default} />
      },
      {
        path: "lr1-table",
        handle: { title: LR1TableComponent.TITLE },
        element: <GrammarContextHost Component={LR1TableComponent.default} />
      },
      {
        path: "lalr1-automaton",
        handle: { title: LALR1AutomatonComponent.TITLE },
        element: <GrammarContextHost Component={LALR1AutomatonComponent.default} />
      },
      {
        path: "lalr1-table",
        handle: { title: LALR1TableComponent.title },
        element: <GrammarContextHost Component={LALR1TableComponent.default} />
      },
      {
        path: "*",
        element: <CatchAll />
      }
    ]
  }
]);

function CatchAll() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  });
}

function PathNav() {
  let matches = useMatches();
  let components = matches.filter(m => m.handle?.title);

  return (
    <nav id="path">
      <ol>
        {components.map((m, index) => (
          <li key={index}><NavLink to={m.pathname}>{m.handle?.title}</NavLink></li>
        ))}
      </ol>
    </nav>
  );
}

function Analysis() {
  return (
    <main id="analysis">
      <PathNav />
      <Outlet />
    </main>
  );
}

export default function({ grammar }) {
  return (
    <GrammarContext.Provider value={grammar}>
      <RouterProvider router={router} />
    </GrammarContext.Provider>
  );
}
