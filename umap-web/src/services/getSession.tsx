import nextSession from "next-session";
import { promisifyStore } from "next-session/lib/compat";
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
export const getSession = nextSession({
    store: promisifyStore(new PrismaSessionStore(
        new PrismaClient(),
        {
            checkPeriod: 2 * 60 * 1000,  //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        })),
});