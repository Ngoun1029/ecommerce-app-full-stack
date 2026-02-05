export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  clickable?: boolean;
};