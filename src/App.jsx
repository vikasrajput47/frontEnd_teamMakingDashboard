import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import { useContext, useEffect } from "react";
import axios from "axios";
import { Context } from ".";
import Profile from "./components/Profile";
import { Toaster } from "react-hot-toast";
const App = () => {
    const { setUser, setIsAuthenticated, setLoading } = useContext(Context);

    useEffect(() => {
      setLoading(true);
      axios
        .get(`http://localhost:4000/teams/getTeam`, {
          withCredentials: true,
        })
        .then((res) => {
          setUser(res.data.user);
          setIsAuthenticated(true);
          setLoading(false);
         
        })
        .catch(() => {
          setUser({});
          setIsAuthenticated(false);
          setLoading(false);
        });
    }, []);

  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
       
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;