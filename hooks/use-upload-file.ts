"use client"

/* Upload a file to Convex storage and return its storage ID */

import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

export function useUploadFile() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  return async function uploadFile(file: File) {
    const postUrl = await generateUploadUrl()
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    })
    if (!result.ok) throw new Error("Could not upload the image")
    const { storageId } = (await result.json()) as {
      storageId: Id<"_storage">
    }
    return storageId
  }
}
