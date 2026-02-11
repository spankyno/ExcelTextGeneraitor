
export type TokenType = 'field' | 'symbol';

export interface Token {
  id: string;
  type: TokenType;
  value: string;
}

export interface ExcelData {
  headers: string[];
  rows: Record<string, any>[];
}

export const SYMBOLS = [
  { label: 'Espacio', value: ' ' },
  { label: '@', value: '@' },
  { label: ',', value: ',' },
  { label: '.', value: '.' },
  { label: '-', value: '-' },
  { label: '(', value: '(' },
  { label: ')', value: ')' },
  { label: '[', value: '[' },
  { label: ']', value: ']' },
  { label: '{', value: '{' },
  { label: '}', value: '}' },
  { label: '&', value: '&' }
];
