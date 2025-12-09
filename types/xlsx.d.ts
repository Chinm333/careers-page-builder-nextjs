// Type declarations for xlsx module
declare module 'xlsx' {
  export interface WorkBook {
    SheetNames: string[];
    Sheets: { [sheet: string]: any };
  }

  export interface ParsingOptions {
    type?: 'base64' | 'binary' | 'buffer' | 'file' | 'array' | 'string';
    cellDates?: boolean;
    cellNF?: boolean;
    cellStyles?: boolean;
    sheetStubs?: boolean;
    sheetRows?: number;
    bookType?: string;
    bookFiles?: number;
    bookSheets?: boolean;
    bookProps?: boolean;
    bookVBA?: boolean;
    password?: string;
    WTF?: boolean;
  }

  export function read(data: any, opts?: ParsingOptions): WorkBook;
  export function readFile(filename: string, opts?: ParsingOptions): WorkBook;

  export namespace utils {
    function sheet_to_json<T = any>(sheet: any, opts?: any): T[];
    function json_to_sheet(data: any[], opts?: any): any;
  }
}

