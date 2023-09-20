import axios from "axios";
import { useContext } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Context } from "../index.js";
import './styles/Header.css'
import logBtn from "./img/logoutImg.png";
const Header = () => {
  const { isAuthenticated, setIsAuthenticated, loading, setLoading,cnt } =
    useContext(Context);

  const logoutHandler = async () => {
    setLoading(true);
    try {
      await axios.get(`http://localhost:4000/users/logout`, {
        withCredentials: true,
      });
      toast.success("Logged Out Successfully");
      setIsAuthenticated(false);
      setLoading(false);
     
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthenticated(true);
      setLoading(false);
    }
  };

  


  return (
    <nav className="header">
      <div>
        <p>DashBoard</p>
      </div>
      {isAuthenticated && (
        <article className="headBar">
          <Link className="item" to={"/"}>
            Home
          </Link>
          <Link className="item" to={"/profile"}>
            Profile
          </Link>
          <h2 className="item memberCnt">{cnt}</h2>
          <button className="item" disabled={loading} onClick={logoutHandler} >
            <img src={logBtn} alt="" />
          </button>
        </article>
      )}
    </nav>
  );
};

export default Header;
