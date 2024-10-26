import { QueryBuilder, Model, Page as ObjectionPage } from 'objection';

interface Page<T extends Model> extends ObjectionPage<T> {
  results: T[];
  currentPage: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

export async function paginate<T extends Model>(
  model: QueryBuilder<T, T>,
  page: number,
  limit: number,
): Promise<Page<T>> {
  const offset = (page - 1) * limit;
  const [items, total] = await Promise.all([
    model.offset(offset).limit(limit) as unknown as Promise<T[]>,
    model.resultSize(),
  ]);
  const nextPage = page * limit < total ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    currentPage: page,
    totalPages,
    nextPage,
    prevPage,
    results: items,
  };
}
