import { useState, useEffect } from "react";

import Notes from "./components/Notes";
import NoteForm from "./components/NoteForm";
import LoginForm from "./components/LoginForm";
import Footer from "./components/Footer";
import FilterButton from "./components/FilterButton";
import Header from "./components/Header";
import LogoutButton from "./components/LogoutButton";

import noteService from "./services/notes";
import loginService from "./services/login";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };
    noteService.create(noteObject).then((createdNote) => {
      setNotes(notes.concat(createdNote));
      setNewNote("");
    });
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((updatedNote) => {
        setNotes(notes.map((note) => (note.id === id ? updatedNote : note)));
      })
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from the server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedNoteappUser");
  };

  const isLoggedIn = user !== null;

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <Header errorMessage={errorMessage} />

      {!isLoggedIn && (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      )}
      {isLoggedIn && (
        <div>
          <p>{user.name} logged in</p>
          <NoteForm
            addNote={addNote}
            newNote={newNote}
            handleNoteChange={handleNoteChange}
          />
        </div>
      )}
      <FilterButton showAll={showAll} setShowAll={setShowAll} />
      <Notes
        notesToShow={notesToShow}
        toggleImportanceOf={toggleImportanceOf}
      />
      {user !== null && <LogoutButton handleLogout={handleLogout} />}
      <Footer />
    </div>
  );
};

export default App;
