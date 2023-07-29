import { PromptFactory } from './commands/prompt.factory';

// Boostrapping
const promptFactory = new PromptFactory();

// App Start
const startTimeParamName = 'since';
const dateInput = promptFactory
  .acceptArgument(startTimeParamName)
  .extract()
  .find((x) => x.argName == startTimeParamName)?.value;

console.log(dateInput);
