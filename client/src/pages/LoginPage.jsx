import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  // const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/login", {
        email,
        password,
      });
      setUser(response.data);
      alert("Login successful");
      setRedirect(true);
      // navigate("/");
    } catch (error) {
      alert("Login failed");
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around ">
      <div className="mb-64 w-full">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <div className="text-center">
          <p className="text-sm  text-yellow-600">
            Login Demo email: test@test.com, password: 12345
          </p>
          <p className="text-sm text-yellow-600 ">
            Or you can create a fake account to test it out.
          </p>
        </div>

        <form className="max-w-md mx-auto" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button className="primary">Login</button>

          <div className="text-center py-2 text-gray-500">
            Do not have an account yet?{" "}
            <Link className="underline text-[#F5385D]" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
