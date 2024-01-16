export interface Repository<N extends { id: string }> {
  getAll(): Promise<N[]>;
  getById(id: N['id']): Promise<N>;
  create(newData: Omit<N, 'id'>): Promise<N>;
  update(id: N['id'], newData: Partial<N>): Promise<N>;
  delete(id: N['id']): Promise<void>;
}
