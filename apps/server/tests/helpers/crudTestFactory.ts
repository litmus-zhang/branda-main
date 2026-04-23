import { describe, it } from "bun:test"
import * as pactum from "pactum"
import { numberRegex } from "./payload.ts"

interface CrudTestOptions<T> {
  resource: string // e.g. "opportunity"
  basePath: string // e.g. "/opportunity"
  withAuth?: boolean // require auth or not
  createPayload: () => T // function producing fake data
  updatePayload?: (orig: T) => T
  storeId?: string // e.g. "opportunityId"
}

export function createCrudTestSuite<T>(opts: CrudTestOptions<T>) {
  const storeKey = opts.storeId ?? `${opts.resource}Id`
  const base = opts.basePath

  describe(`${opts.resource} CRUD`, () => {
    const original = opts.createPayload()

    it(`should create ${opts.resource}`, async () => {
      const spec = pactum.spec().post(`${base}/new`).withJson(original)
      if (opts.withAuth)
        spec.withBearerToken("$S{authToken}")
      await spec.expectStatus(200).stores(storeKey, "data.id")
    })

    it(`should list all ${opts.resource}`, async () => {
      const spec = pactum.spec().get(base)
      if (opts.withAuth)
        spec.withBearerToken("$S{authToken}")
      await spec.expectStatus(200)
      await spec.expectJsonLike({
        message: `Successfully retrieved all ${opts.resource}`,
        data: [],
        meta: {
          page: numberRegex,
          total: numberRegex,
          totalPages: numberRegex,
          prev: numberRegex,
          next: numberRegex,
          pageSize: numberRegex,
        },
      })
      // await spec.inspect()
    })

    it(`should get one ${opts.resource}`, async () => {
      const spec = pactum.spec().get(`${base}/$S{${storeKey}}`)
      if (opts.withAuth)
        spec.withBearerToken("$S{authToken}")
      await spec.expectStatus(200)
    })

    if (opts.updatePayload) {
      it(`should update ${opts.resource}`, async () => {
        const spec = pactum
          .spec()
          .put(`${base}/$S{${storeKey}}`)
          .withJson(opts.updatePayload(original))
        if (opts.withAuth)
          spec.withBearerToken("$S{authToken}")
        await spec.expectStatus(200)
      })
    }

    it(`should delete ${opts.resource}`, async () => {
      const spec = pactum.spec().delete(`${base}/$S{${storeKey}}`)
      if (opts.withAuth)
        spec.withBearerToken("$S{authToken}")
      await spec.expectStatus(200)
    })
  })
}
