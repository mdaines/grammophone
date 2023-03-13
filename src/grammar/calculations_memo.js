import * as Calculations from "./calculations/index.js";

export function makeCalculationsMemo(productions) {
  let obj = {
    productions
  };

  for (let k of Object.keys(Calculations)) {
    Object.defineProperty(obj, k, {
      configurable: true,
      enumerable: true,
      get() {
        Object.defineProperty(this, k, { value: Calculations[k](this), enumerable: true });
        return this[k];
      }
    });
  }

  return obj;
}
