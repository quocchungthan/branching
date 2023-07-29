import { addDays, earlier } from '../util/date.helper';

export interface BirthGraphProbability {
  identifier: string;
  distinceBirthDateCount: number;
  alivePersonCount?: number | undefined; // dont have any clue!
}

export class BirthGraphApp {
  private _startTime: Date;
  private _currentStatistic: BirthGraphProbability[];

  since(startTime: Date) {
    this._startTime = startTime;
  }

  reCalculate(): void {
    const tempDictionary: {
      [key: string]: BirthGraphProbability;
    } = {};
    let iterater = new Date(this._startTime.getTime());

    while (earlier(iterater)) {
      const identifier = this._getIdentifierAccordingToNumerology(iterater);

      if (!tempDictionary[identifier]) {
        tempDictionary[identifier] = { identifier, distinceBirthDateCount: 0 };
      }

      tempDictionary[identifier].distinceBirthDateCount++;

      iterater = addDays(iterater, 1);
    }

    this._currentStatistic = Object.values(tempDictionary);
  }

  print(): void {
    console.log(this._currentStatistic);
  }

  private _getIdentifierAccordingToNumerology(date: Date): string {
    const stringNothing = '';
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();

    const digits = stringNothing + day + month + year;

    return digits
      .split(stringNothing)
      .filter((x) => x != '0')
      .sort((d1, d2) => +d1 - +d2)
      .join(stringNothing);
  }
}
