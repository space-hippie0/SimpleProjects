import {PrismaClient} from "@prisma/client";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";


export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production"){
    globalThis.prisma = db;
}
