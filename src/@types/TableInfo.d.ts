export type TableInfo = {
  cid: number;
  name: string;
  type: "NULL" | "INTEGER" | "REAL" | "TEXT" | "BLOB";
  notnull: 0 | 1;
  dflt_value: string | null;
  pk: 0 | 1;
};
