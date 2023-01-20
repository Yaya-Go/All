import { TableHeaders } from "src/app/shared/custom-table/custom-table.component";

export const NAME_ONLY_HEADER: TableHeaders[] = [
  { name: 'Name' }
];

export const TRANSACTION_HEADERS: TableHeaders[] = [
  { name: 'Date', className: 'd-none d-md-table-cell' },
  { name: 'Name' },
  { name: 'Category', className: 'd-none d-md-table-cell' },
  { name: 'Amount' }
];

export const TRANSACTION_ITEM_HEADERS: TableHeaders[] = [
  { name: 'Name' },
  { name: 'Rates', className: 'd-none d-md-table-cell' },
  { name: 'Amount' },
  { name: 'Comments', className: 'd-none d-md-table-cell' }
];

export const INCOME_HEADERS: TableHeaders[] = [
  { name: 'Date', className: 'd-none d-md-table-cell' },
  { name: 'From' },
  { name: 'Type', className: 'd-none d-md-table-cell' },
  { name: 'Amount' }
];

export const MORTGAGE_HEADERS: TableHeaders[] = [
  { name: 'Date', className: 'd-none d-md-table-cell' },
  { name: 'Name' },
  { name: 'Amount' }
];
