export interface IPrinter {
  printTable<T>(data: T[]): void;
}

export class Printer implements IPrinter {
  printTable<T>(data: T[]): void {
    console.table(data);
  }
}
