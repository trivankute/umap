import { PrismaClient } from "@prisma/client";

export default async function handler(req : any, res : any) {
    const prisma = new PrismaClient({log: ["query"]})
    const sid : string = req.cookies["sid"]
    console.log(sid)
    if(req.method === "GET") {
        const logs = await prisma.$queryRawUnsafe(`
            SELECT id, content
            FROM umap."search_log"
            WHERE uid = '${sid}'
        `)
        res.json(logs)
    }
    if(req.method === "POST") {
        const searchContent : string= req.body.content
        
        const insertedValue = `('${sid}', to_timestamp(${Date.now()/1000.0}), '${searchContent}')`
        const result = await prisma.$queryRawUnsafe(`
            INSERT INTO umap."search_log"(uid, timestamp, content)
            VALUES ${insertedValue};
        `)

        res.json({msg: "success"})
    }
}