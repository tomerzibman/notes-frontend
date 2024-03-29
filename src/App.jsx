import { useState, useEffect, useRef } from 'react';

import Notes from './components/Notes';
import NoteForm from './components/NoteForm';
import Footer from './components/Footer';
import FilterButton from './components/FilterButton';
import Header from './components/Header';
import LogoutButton from './components/LogoutButton';

import noteService from './services/notes';
import loginService from './services/login';
import Toggleable from './components/Toggleable';
import LoginForm from './components/LoginForm';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  const noteFormRef = useRef();

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility();
    noteService.create(noteObject).then((createdNote) => {
      setNotes(notes.concat(createdNote));
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
          `Note '${note.content}' was already removed from the server`,
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('loggedNoteappUser');
  };

  const isLoggedIn = user !== null;

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <Header errorMessage={errorMessage} />

      {!isLoggedIn && (
        <Toggleable buttonLabel="login">
          <LoginForm handleLogin={handleLogin} />
        </Toggleable>
      )}
      {isLoggedIn && (
        <div>
          <p>{user.name} logged in</p>
          <Toggleable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm createNote={addNote} />
          </Toggleable>
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
