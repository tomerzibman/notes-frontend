import Note from './Note';

const Notes = ({ notesToShow, toggleImportanceOf }) => {
  return (
    <ul>
      {notesToShow.map((note) => (
        <Note
          key={note.id}
          note={note}
          toggleImportance={() => {
            toggleImportanceOf(note.id);
          }}
        />
      ))}
    </ul>
  );
};

export default Notes;
