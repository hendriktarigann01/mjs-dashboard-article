import { useNavigate } from "react-router-dom";
import Login from "./pages/Login";

const App = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return <Login onLogin={handleLogin} />;
};

export default App;
