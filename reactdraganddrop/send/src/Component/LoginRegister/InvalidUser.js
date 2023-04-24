import { Link } from "react-router-dom";

const AuthUser = () => {
  return (
    <div>
      <h1>
        You are not Logged in please login here.
        <Link to={{ pathname: "/login" }}>Login</Link>
      </h1>
    </div>
  );
};

export default AuthUser;
