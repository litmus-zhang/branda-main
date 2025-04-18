import { QueryBuilder, Model, Page as ObjectionPage } from 'objection';

export interface PaginatedResult<T extends Model> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export async function paginate<T extends Model>(
  model: QueryBuilder<T, T[]>,
  page: number,
  limit: number,
): Promise<PaginatedResult<T>> {
  // Get the knex instance from the model class.
  const knexInstance = model.modelClass().knex();

  return knexInstance.transaction(async (trx) => {
    const offset = (page - 1) * limit;
    const [items, total] = await Promise.all([
      // Clone the model query to avoid mutations and attach the transaction.
      (await model
        .clone()
        .transacting(trx)
        .offset(offset)
        .limit(limit)) as unknown as Promise<T[]>,
      await model.clone().transacting(trx).resultSize(),
    ]);
    const nextPage = page * limit < total ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;
    const totalPages = Math.ceil(total / limit);
    return {
      data: items,
      meta: {
        total,
        lastPage: totalPages,
        currentPage: page,
        perPage: limit,
        prev: prevPage,
        next: nextPage,
      },
    };
  });
}
