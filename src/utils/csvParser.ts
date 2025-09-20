import { ParseResult } from 'papaparse';
import { ZodSchema } from 'zod';

export function parseCsvData<T>(
  results: ParseResult<string[]>,
  schema: ZodSchema<T>,
  transformFn: (row: string[]) => unknown,
): T[] {
  const dataRows = results.data.slice(1);
  const parsedData = dataRows.reduce<T[]>((acc, row) => {
    const candidate = transformFn(row);
    const parsed = schema.safeParse(candidate);

    if (parsed.success) {
      acc.push(parsed.data);
    }

    return acc;
  }, []);

  return parsedData;
}
