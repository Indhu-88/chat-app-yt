import { BiLogOut } from "react-icons/bi";
import { useLogout } from "../../hooks/useLogout";

const LogoutButton = () => {
  const { loading, logout } = useLogout(); //loading means sending req to backend

  return (
    <>
      <div className="mt-auto">
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <BiLogOut
            className="w-6 h-6 text-white cursor-pointer"
            onClick={logout}
          />
        )}
      </div>
    </>
  );
};

export default LogoutButton;

// mt-auto -->pushes logo to the bottom making space above
