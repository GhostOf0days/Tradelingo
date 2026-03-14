// This file serves as a central registry for all modules in the app, mapping module IDs to their respective lessons and pretests.
import { TRADING_LESSONS, TRADING_PRETEST } from './trading';
import { RETIREMENT_LESSONS, RETIREMENT_PRETEST } from './retirement';
import { CRYPTOCURRENCIES_LESSONS, CRYPTOCURRENCIES_PRETEST } from './Cryptocurrencies';
import { BROKERS_LESSONS, BROKERS_PRETEST } from './Brokers';

export const MODULES = {
  1: {
    lessons: TRADING_LESSONS,
    pretest: TRADING_PRETEST
  },
  2: {
    lessons: RETIREMENT_LESSONS,
    pretest: RETIREMENT_PRETEST
  },
  3: {
    lessons: CRYPTOCURRENCIES_LESSONS,
    pretest: CRYPTOCURRENCIES_PRETEST
  },
  4: {
    lessons: BROKERS_LESSONS,
    pretest: BROKERS_PRETEST
  }
};