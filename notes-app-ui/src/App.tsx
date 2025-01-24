import {useState, React, useEffect} from 'react';
import './App.css';

type Note = {
  id: number;
  title: string;
  content: string;
  deleted: boolean;
  time: number;
}

function App() {

  // use useState React hook to add a state variables 
  const [notes, setNotes] = useState < Note[] >([]);
  const [title, setTitle] = useState < string >('');
  const [content, setContent] = useState < string >('');
  const [time, setTime] = useState < number >(0);
  const [deleted, setDeleted] = useState < boolean > (false);
  const [selectedNote, setSelectedNote] = useState < Note | null > (null);
  const timeOptons = [5,10,15,20,25,30,40,50,60];

  // use useEffect hook to sync components with api
  useEffect(()=> {
    const fetchNotes = async () => {
        try{
          const response = await fetch( "http://localhost:5001/api/notes");
          const notes:Note[] = await response.json();
          setNotes(notes);

        } catch(e){
          console.log(e)
        }
    };
    fetchNotes();
  }, []);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTime(note.time);
    setDeleted(note.deleted);
  }

  //UpdateNote
  // use useEffect hook to sync components with api
  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedNote) {
      return;
    }

    try{

      const response = await fetch(
        `http://localhost:5001/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify({
            title,
            content,
            time,
            deleted
          })
        }
      )

      const updatedNote = await response.json();

      const updatedNotesList = notes.map((notes) =>
        notes.id === selectedNote.id ? updatedNote : notes)
  
      setNotes(updatedNotesList);
      setTitle('');
      setContent('');
      setTime(0);
      setSelectedNote(null);
      setDeleted(false);


    } catch(e){
      console.log(e)
    }

  };

  const handleCancel = () => {
    setSelectedNote(null);
    setTitle('');
    setContent('');
    setTime(0);
    setDeleted(false);
  }

  //DeleteNote
  // use useEffect hook to sync components with api
  const deleteNote = async (e: React.MouseEvent, noteId: number) => {

    e.stopPropagation();

    try{
      const response = await fetch(
        `http://localhost:5001/api/notes/delete/${noteId}`,
        {
          method: "PUT", //method: "DELETED",
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify({
            title,
            content,
            time,
            deleted:true
          })
        }
      );
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
      setDeleted(true);
    } catch(e){
      console.log(e)
    }
  }

  //AddNote
  // use useEffect hook to sync components with api
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
      const response = await fetch( 
        "http://localhost:5001/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            content,
            time,
            deleted
          }),
        }
      );
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setTitle('');
      setContent('');
      setTime(0);
      setDeleted(false);
    } catch(e){
        console.log(e)
    }
    // const newNote: Note = {
    //   id: notes.length + 1,
    //   title,
    //   content
    // }

  
  }

  return (
    <div className="app-container">
     <form className='note-form' 
      onSubmit={(e) => 
      selectedNote ? handleUpdateNote(e) : handleAddNote(e)}>
      
      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Title' 
        required
      ></input>
      <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='Content'
        required
        rows={10}
      ></textarea>

      <select
        value={time}
        onChange={(e)=> setTime(parseInt(e.target.value))}
      >
        <option value="0">Est. Time</option>
        {
        timeOptons.map((timeItem) => (
            <option value={timeItem}>{timeItem}</option>
        ))
        }
      </select> 

      {selectedNote ? (
        <div className='edit-buttons'>
          <button type='submit'>Save</button>
          <button onClick={handleCancel}>Cancel</button>
          </div>
          ): (
            <button type='submit'>Add Note</button>
          )}
     </form>
    
      <div className='notes-grid'>
        {notes.map((note) => (
          <div className='note-item' 
          key={note.id}
          onClick={() => handleNoteClick(note)}>
            <div className='notes-header'>
            <button onClick={(e) => 
            deleteNote(e, note.id)
            }>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            {
            parseInt(note.time) > 0 ?
              <p>Est. Time: {note.time}</p> : ''
            }
          </div>
        ))}
      </div>
    </div>

  );
}

export default App;
