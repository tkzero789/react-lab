import type { Id } from "./_generated/dataModel"
import { mutation, type MutationCtx, type QueryCtx } from "./_generated/server"

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})

/* Todo images are stored as plain strings. Skip IDs that are not valid or that point to a deleted file. */
export async function deleteFiles(ctx: MutationCtx, ids: string[]) {
  for (const id of ids) {
    const storageId = ctx.db.system.normalizeId("_storage", id)
    if (storageId && (await ctx.db.system.get("_storage", storageId))) {
      await ctx.storage.delete(storageId)
    }
  }
}

export async function getFileObject(ctx: QueryCtx, storageId: Id<"_storage">) {
  const metadata = await ctx.db.system.get("_storage", storageId)
  if (!metadata) return null

  const url = await ctx.storage.getUrl(storageId)

  return {
    url,
    storageId: metadata._id,
    contentType: metadata.contentType,
    size: metadata.size,
    sha256: metadata.sha256,
    creationTime: metadata._creationTime,
  }
}
