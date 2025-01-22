import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { REPLCommand } from 'repl';


const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors(
    {
        origin: "http://localhost:3000", // Allow requests from the frontend
        methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
        allowedHeaders: ["Content-Type"], // Allowed headers
      }
));

app.get("/api/notes", async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json(notes);
});

app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        // return res.status(400)
    //     .send('Title and content are required')
    //  //   .json({ error: 'Title and content are required' });
    }
    
    try{
        const note = await prisma.note.create({
            data: {
                title,
                content
            }
        });
        res.json(note);
    } catch(error){
        res.status(500)
        .send("Oops something went wrong")
    }

});    


app.put("/api/notes/:id", async (req, res) => {
    const {title, content } = req.body;
    const id = parseInt(req.params.id);
    // if(!id || isNaN(id)){
    //     return res.status(400).send("ID must be a valid number")
    // }


    if (!title || !content) {
        // return res.status(400)
    //     .send('Title and content are required')
    //  //   .json({ error: 'Title and content are required' });
    }

    try{
        const updatedNote = await prisma.note.update({
            where: {id},
            data: {title, content}
        });
        res.json(updatedNote)
    }catch (error){
        res.status(500).send("Oops, something went wrong");
    }
});


app.delete("/api/notes/:id", async (req,res) => {
    const id = parseInt(req.params.id);

    // if(!id || isNaN(id)){
    //     return res.status(400).send("ID must be a valid number")
    // }

    try{
        const deleteNote = await prisma.note.delete({
            where: {id}
        });
        //res.status(204).send();
     
        res.json(deleteNote)
    } catch(error){
        res.status(500).send("Oops, something went wrong");
    }

});


app.listen(5001, () => {
  console.log('Server running on port 5001');
});