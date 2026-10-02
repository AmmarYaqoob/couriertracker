export interface ListRepository<T> {
  insertMany(rows: T[]): Promise<number>;
  list(): Promise<T[]>;
  count(): Promise<number>;
}
