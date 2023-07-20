import { PrismaClient } from "@prisma/client";

export default async function handler(req : any, res : any) {
    const prisma = new PrismaClient({log: ["query"]})
    
    if(req.method === "DELETE") {
        const logId : string= req.query.id
        
        const result = await prisma.$queryRawUnsafe(`
            DELETE FROM "umap".search_log
            WHERE id = ${logId}
        `)
        res.json({msg: "success"})
    }
}