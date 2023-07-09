import prisma from "@/lib/prisma";
import nextSession from "next-session";
import { promisifyStore } from "next-session/lib/compat";
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
export const getSession = nextSession({
    store: promisifyStore(new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000,  //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        })),
});