export type IndexList = {
  seq: number;
  name: string;
  unique: 0 | 1;
  origin: string;
  partial: 0 | 1;
};

export type ForeignKey = {
  id: number;
  seq: number;
  table: string;
  from: string;
  to: string;
  on_update: string;
  on_delete: string;
  match: string;
};
