const express = require("express");
const app = express();
app.use(express.json());
const tools = require("./tools.js");
const hbs = require("hbs");

hbs.registerPartials(__dirname + "/views/partials", function (err) {});
app.set("view engine", "hbs");
app.set("views", __dirname + "/views/");
app.use(express.static(__dirname + "/public"));
const bodyParser = require("body-parser");
const { redirect } = require("express/lib/response");
const { request } = require("express");
app.use(express.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);



app.get("/", (request, response) => {
  response.render("index");
});

app.get("/list_notes", (request, response) => {
  let notes1 = tools.loadNotes();
  console.log(notes1);
  response.render("lista", { notes1 });
});

app.get("/agregar", (request, response) => {
  response.render("agregar");
});

app.post("/agregarNota", (request, response) => {
  console.log("Funcion para crear nota");
  const notes = tools.loadNotes();
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  const note = request.body;
  note.id = maxId + 1;
  console.log("Nota ", note.id);
  tools.addNote(note.id, request.body.title, request.body.bodyr);
  response.redirect("/list_notes");
});

app.get("/actualizar/:id", (request, response) => {
  //let titulo = request.params.title;
  let id = Number(request.params.id)
  console.log(id)
  const notes = tools.loadNotes();
  const note = notes.find((note) => note.id === id);
  response.render("actualizar", {note});
});

app.post("/update", (request, response) => {
  let id = String(request.body.id);
  let title = request.body.ntitle;
  let body = request.body.nbody;
  console.log("ID ", id);
  console.log("Titulo ", title);
  console.log("Cuerpo ", body);

  tools.modifyNote(id, title, body);
  response.redirect("/list_notes");

});

/*
app.get("/delete/:id", (request, response) => {
  const id = Number(request.params.id)
  const result = tools.removeNote(id)
  if (result){
    response.redirect("/list_notes")
  }else{
    response.redirect("/error")
  }
})*/

app.get("/delete/:id", (request, response) => { 
  const id = Number(request.params.id); 
  tools.removeNote(id)
  response.redirect("/list_notes"); 
});

app.get("/error",(request,response)=>{
  response.render("error.hbs")
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
