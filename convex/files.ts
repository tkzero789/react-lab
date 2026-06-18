import type { Id } from "./_generated/dataModel"
import { mutation, type QueryCtx } from "./_generated/server"

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})

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
