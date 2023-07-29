export interface IPrinter {
  printTable<T>(data: T[]);
}

export class Printer implements IPrinter {
  printTable<T>(data: T[]) {
    console.table(data);
  }
}
