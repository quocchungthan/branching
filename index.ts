import { BirthGraphApp } from './application/brithdaygrapp.app';
import { PromptFactory } from './commands/prompt.factory';
import { stringToDate } from './util/date.helper';

// Boostrapping
const promptFactory = new PromptFactory();
const numerology = new BirthGraphApp();

// App Start
const startTimeParamName = 'since';
const dateInput = promptFactory
  .acceptArgument(startTimeParamName)
  .extract()
  .find((x) => x.argName == startTimeParamName)?.value;

if (dateInput != undefined) {
  numerology.since(stringToDate(dateInput));
  numerology.reCalculate();
  numerology.print();
}
