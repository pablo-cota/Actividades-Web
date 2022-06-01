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
  console.log("funcion para crear nota post");
  tools.addNote(request.body.title, request.body.bodyr);
  response.redirect('/list_notes');
});

app.get("/actualizar/:id", (request, response) => {
  //let titulo = request.params.title;
  const id = Number(request.params.id)
  const notes = tools.loadNotes();
  const note = notes.find((note) => note.id === id);
  response.render("actualizar", {note});
});

app.post("/update", (request, response) => {
  const id = Number(request.body.id)
  const title = request.body.ntitle
  const body = request.body.nbody
  tools.modifyNote(id, title, body);
  response.redirect("/list_notes");

});

app.get("/delete/:title", (request, response) => {
  const title = request.params.title
  console.log(typeof(title))
  console.log(title)
  tools.removeNote(title)
  if (result){
    response.redirect("/list_notes")
  }else{
    response.redirect("/error")
  }
})

app.get("/error",(request,response)=>{
  response.render("error.hbs")
})

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

app.post("/api/notes/add", (request, response) => {
  /* const note = request.body
    console.log(note)

    response.json(note)*/
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  const note = request.body;
  note.id = maxId + 1;
  notes = notes.concat(note);
  response.json(note);
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
