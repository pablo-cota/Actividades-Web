const { redirect } = require("express/lib/response");
const fs = require("fs"); //importamos fs para escribir y leer archivos
const { request } = require("http");
const { title } = require("process");
const { stringify } = require("querystring")

const addNote = function (id, title, body) {
  //creacion de addNote para formar la estructura del archivo
  console.log("El ID de la nota", id);
  console.log("El título de la nota", title);
  console.log("El cuerpo de la nota", body);
  const notes = loadNotes();
  const duplicateNote = notes.find((note) => note.id === id); 
  if (!duplicateNote) {
    notes.push(
      { id: id, title: title, body: body }
    );
    saveNotes(notes); 
    console.log("Nota creada");
  } else {
    console.log("Nota duplicada");
    const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;

    id= maxId+1;
    console.log("id",id);
    id2= String(id);
    console.log(typeof id2);
    notes.push(
    
      //agregamos los valores que recibe yargs
      { id: id, title: title, body: body }
    );
    saveNotes(notes); //validación si existe o no una nota con el mismo titulo
  }
};

//Guardar notas
const saveNotes = function(notes){
  const dataJSON = JSON.stringify(notes)
  fs.writeFileSync("notes.json", dataJSON)
}

//Cargar notas
const loadNotes = function(){
  try {
      const dataBuffer = fs.readFileSync("notes.json")
      const dataJSON = dataBuffer.toString()
      return JSON.parse(dataJSON)
  } catch (e) {
      return []
  }
}

//Listar notas
const listNotes = function(){
  const notes = loadNotes()
  notes.forEach((note)=>{
      console.log("El título de la nota: ", note.title)
      console.log("El cuerpo de la nota: ", note.body) 
      return JSON.parse(dataJSON) 
  });
}

//Quitar notas
/*
const removeNote = function(id){
  const notes = loadNotes()
  const notesToKeep = notes.filter((note)=>note.id != id)
  if (notes.length >notesToKeep.length){
      console.log("Note removed!!")
      saveNotes(notesToKeep)
      return true
  } else{
      console.log("Note not found!!")
      return false
  }
}*/

const removeNote = function (id) {
  const notes = loadNotes();
  const notesToKeep = notes.filter((note) => note.id != id);

    saveNotes(notesToKeep);

};


//Leer nota
const readOneNote = function (id) {
  console.log(id);
  const notes = loadNotes();
  const note = notes.find((note) => note.id === id);

  console.log(note);
  if (note) {
    console.log("Nota encontrada");
    console.log(note.id, note.title, note.body);
    return note
  } else {
    console.log("Nota no encontrada");
    return false
  }
};


//Modificar nota, ejmeplo de la Dra
const modifyNote = function(id, ntitle, nbody){
  const notes = loadNotes();
  console.log("id recibido",id);
  let ids= Number(id)
  console.log("id despues del cambio",ids);
  let note = notes.findIndex((note) =>note.id === ids);
  console.log("holi",note);
  newnote =
  notes.splice(note, 1, {id:ids, title: ntitle, body: nbody});
  console.log("esto que es_ ",notes);
  saveNotes(notes);
  console.log("Nota modificada");
}



module.exports = {
  readOneNote: readOneNote,
  addNote: addNote,
  loadNotes: loadNotes,
  saveNotes: saveNotes,
  removeNote: removeNote,
  listNotes: listNotes,
  modifyNote: modifyNote
};
