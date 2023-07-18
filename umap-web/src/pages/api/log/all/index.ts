import { PrismaClient } from "@prisma/client";

export default async function handler(req : any, res : any) {
    const prisma = new PrismaClient({log: ["query"]})
    const sid : string = req.cookies["sid"]
    
    if(req.method === "DELETE") {        
        const result = await prisma.$queryRawUnsafe(`
            DELETE FROM "umap".search_log
            WHERE uid = '${sid}'
        `)
        res.json({msg: "success"})
    }
}