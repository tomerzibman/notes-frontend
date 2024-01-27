const LogoutButton = ({ handleLogout }) => {
  return (
    <div>
      <button
        onClick={() => {
          handleLogout();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
