'use strict';

const classificationCalculation = require('./classification');
const nonterminalsCalculation = require('./nonterminals');
const terminalsCalculation = require('./terminals');
const symbolInfoCalculation = require('./symbolInfo');
const startCalculation = require('./start');
const productionsCalculation = require('./productions');
const unreachableCalculation = require('./unreachable');
const unrealizableCalculation = require('./unrealizable');
const cycleCalculation = require('./cycle');
const nullAmbiguityCalculation = require('./nullAmbiguity');
const nullableCalculation = require('./nullable');
const firstCalculation = require('./first');
const followCalculation = require('./follow');
const endableCalculation = require('./endable');
const sentencesCalculation = require('./sentences');
const ambiguousCalculation = require('./ambiguous');

module.exports = Object.assign({},
  classificationCalculation,
  nonterminalsCalculation,
  terminalsCalculation,
  symbolInfoCalculation,
  startCalculation,
  productionsCalculation,
  unreachableCalculation,
  unrealizableCalculation,
  cycleCalculation,
  nullAmbiguityCalculation,
  nullableCalculation,
  firstCalculation,
  followCalculation,
  endableCalculation,
  sentencesCalculation,
  ambiguousCalculation
);
