interface Arg {
  argName: string;
  value: string;
}

export interface IPromptFactory {
  acceptArgument(paramName: string): IPromptFactory;

  extract(): Array<Arg>;
}

export class PromptFactory implements IPromptFactory {
  private _paramNames: string[] = [];

  acceptArgument(paramName: string): IPromptFactory {
    this._paramNames.push(paramName);

    return this;
  }

  extract(): Arg[] {
    const args = process.argv.slice(2);
    const result: Arg[] = [];

    this._paramNames.forEach((name) => {
      const argIndexValue = args.indexOf('--' + name) + 1;

      if (argIndexValue > 0) {
        result.push({ argName: name, value: args[argIndexValue] });
      }
    });

    return result;
  }
}
