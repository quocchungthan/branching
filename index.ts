import { BirthGraphApp } from './application/brithdaygrapp.app';
import { IPrinter, Printer } from './commands/printer.factory';
import { IPromptFactory, PromptFactory } from './commands/prompt.factory';
import { stringToDate } from './util/date.helper';

// Boostrapping
const printer: IPrinter = new Printer();
const promptFactory: IPromptFactory = new PromptFactory();
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
