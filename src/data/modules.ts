// Aggregates topic-specific lesson arrays into numbered modules the UI and API both understand.
import { TRADING_LESSONS, TRADING_PRETEST } from './trading';
import { RETIREMENT_LESSONS, RETIREMENT_PRETEST } from './retirement';
import { CRYPTOCURRENCIES_LESSONS, CRYPTOCURRENCIES_PRETEST } from './Cryptocurrencies';
import { BROKERS_LESSONS, BROKERS_PRETEST } from './Brokers';

export const MODULES = {
  1: { title: "Stock Market Fundamentals", experiencePoints: 600, lessons: TRADING_LESSONS, pretest: TRADING_PRETEST },
  2: { title: "Retirement Planning", experiencePoints: 800, lessons: RETIREMENT_LESSONS, pretest: RETIREMENT_PRETEST },
  3: { title: "Cryptocurrencies", experiencePoints: 700, lessons: CRYPTOCURRENCIES_LESSONS, pretest: CRYPTOCURRENCIES_PRETEST },
  4: { title: "Brokers and Trading Platforms", experiencePoints: 600, lessons: BROKERS_LESSONS, pretest: BROKERS_PRETEST },
};