import Notification from './Notification';

const Header = ({ errorMessage }) => {
  return (
    <>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
    </>
  );
};

export default Header;
