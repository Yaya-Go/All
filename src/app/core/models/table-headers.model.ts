import { TableHeaders } from "src/app/shared/custom-table/custom-table.component";

export const NAME_ONLY_HEADER: TableHeaders[] = [
  { name: 'Name' }
];

export const TRANSACTION_HEADERS: TableHeaders[] = [
  { name: 'Date' },
  { name: 'Name' },
  { name: 'Category' },
  { name: 'Amount' }
];

export const TRANSACTION_ITEM_HEADERS: TableHeaders[] = [
  { name: 'Name' },
  { name: 'Rates' },
  { name: 'Amount' },
  { name: 'Comments' }
];

export const INCOME_HEADERS: TableHeaders[] = [
  { name: 'Date' },
  { name: 'From' },
  { name: 'Type' },
  { name: 'Amount' }
];
