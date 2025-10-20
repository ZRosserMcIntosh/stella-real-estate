// Server-side Prisma client helper (use only in server contexts / API routes)
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined
}

if (import.meta.env.DEV) {
  if (!globalThis.__prisma__) {
    globalThis.__prisma__ = new PrismaClient()
  }
  prisma = globalThis.__prisma__
} else {
  prisma = new PrismaClient()
}

export { prisma }
