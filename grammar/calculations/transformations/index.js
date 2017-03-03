'use strict';

const allTransformations = require('./all');
const expandTransformation = require('./expand');
const removeImmediateLeftRecursionTransformation = require('./removeImmediateLeftRecursion');
const leftFactorTransformation = require('./leftFactor');
const epsilonSeparateTransformation = require('./epsilonSeparate');
const removeUnreachableTransformation = require('./removeUnreachable');

module.exports = Object.assign({},
  allTransformations,
  expandTransformation,
  removeImmediateLeftRecursionTransformation,
  leftFactorTransformation,
  epsilonSeparateTransformation,
  removeUnreachableTransformation
);
