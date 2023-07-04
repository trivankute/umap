import { getSession } from "@/services/getSession";

export default async function handler(req, res) {
    const session = await getSession(req, res);
    if(req.method==='GET'){
        res.status(200).json({
            'center': session.center??null,
            'zoom': session.zoom??null
        })
    }

    if(req.method==='POST'){
    const data = JSON.parse(req.body)
    session.center = data.center
    session.zoom = data.zoom
    
    res.status(200).json({ saved: "Data saved in session" });
    return
  }
}