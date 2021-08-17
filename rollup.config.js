import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "src/application.js",
  output: {
    file: "build/assets/application.js",
    format: "iife",
    name: "ApplicationController",
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs({
      include: ["node_modules/**", "src/**"]
    }),
    uglify()
  ]
};
