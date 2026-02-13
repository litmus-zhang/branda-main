import type { SQLWrapper } from "drizzle-orm"
import { desc, eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/postgres-js"
import { reset, seed } from "drizzle-seed"
import { NotFoundError } from "elysia"
import postgres from "postgres"
import { config } from "../config.ts"
import { PAGE_SIZE } from "./constants.ts"
import * as schema from "./schema.ts"

export * from "./events/index.ts"
export * from "./tickets/index.ts"

type TableName = keyof typeof schema

const queryClient = postgres(config.DATABASE_URL)

export const db = drizzle({
  client: queryClient,
  casing: "snake_case",
  schema,
})

export async function clearDb() {
  await reset(db, schema)
}
export async function seedDb() {
  await seed(db, schema, {
    count: 100,
  })
}
export async function updateUserRole(userId: string, role: string = "admin") {
  return db.update(schema.user)
    .set({ role })
    .where(eq(schema.user.id, userId))
    .returning()
}

export function getPaginatedMeta(page: number, pageSize: number = PAGE_SIZE, total: number) {
  const lastPage = Math.ceil(total / pageSize)
  return {
    page,
    total,
    totalPages: lastPage,
    prev: page > 1 ? page - 1 : null,
    next: page < lastPage ? page + 1 : null,
    pageSize,
  }
}
export async function insertOne<T extends TableName>(
  table: T,
  body: any,
) {
  try {
    const tableRef = schema[table] as unknown as SQLWrapper
    const res = await db.insert(tableRef as any).values(body).returning()
    return {
      message: `Successfully created a ${table}`,
      data: res[0],
    }
  }
  catch (error) {
    console.log({ error })
    throw new Error(`Failed to insert ${table}`, { cause: error })
  }
}
export async function updateOne<T extends TableName>(
  table: T,
  id: string,
  body: any,
) {
  try {
    const tableRef = schema[table] as unknown as SQLWrapper
    const res = await db
      .update(tableRef as any)
      .set(body)
      .where(eq((tableRef as any).id, id))
      .returning()
    return {
      message: `Successfully updated a ${table}`,
      data: res[0],
    }
  }
  catch (error) {
    console.log({ error })
    throw new Error(`Failed to update ${table}`, { cause: error })
  }
}

export async function getOneByID<T extends TableName>(
  table: T,
  id: string,
  // opts?: { includeRelations?: boolean },
) {
  try {
    const tableRef = schema[table] as any

    let row: any = null
    const res = await db
      .select()
      .from(tableRef)
      .where(eq(tableRef.id, id))
      .limit(1)

    row = res[0]

    if (!row)
      throw new NotFoundError(`Failed to find ${table} with id ${id}`)

    return {
      message: `Successfully retrieved ${table}`,
      data: row,
    }
  }
  catch (error) {
    if (error instanceof NotFoundError)
      throw error
    throw new Error(`Failed to find ${table}`, { cause: error })
  }
}

export async function deleteOne<T extends TableName>(
  table: T,
  id: string,
) {
  try {
    const tableRef = schema[table] as unknown as SQLWrapper
    const res = await db
      .delete(tableRef as any)
      .where(eq((tableRef as any).id, id))
      .returning()
    return {
      message: `Successfully deleted a ${table}`,
      data: res[0],
    }
  }
  catch (error) {
    console.log({ error })
    throw new Error(`Failed to delete ${table}`, { cause: error })
  }
}

export async function getUserMedia(userId: string) {
  const data = await db.query.files.findMany({
    where: eq(schema.files.uploaded_by, userId),
    orderBy: [desc(schema.files.createdAt)],
  })
  return {
    message: `Successfully retrieved all users media`,
    data,
  }
}
