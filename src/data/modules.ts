import { TRADING_LESSONS, TRADING_PRETEST } from './trading';
import { RETIREMENT_LESSONS, RETIREMENT_PRETEST } from './retirement';

// module id -> lessons + pretest
export const MODULES = {
  1: {
    lessons: TRADING_LESSONS,
    pretest: TRADING_PRETEST
  },
  2: {
    lessons: RETIREMENT_LESSONS,
    pretest: RETIREMENT_PRETEST
  }
};