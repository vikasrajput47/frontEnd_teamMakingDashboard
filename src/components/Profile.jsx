import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "..";
import { Link, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
const Profile = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 20;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated ,cnt,setCnt} = useContext(Context);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/teams/getTeam`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.members);
        setIsLoading(false);
        setCnt(res.data.members.length);

      })
      .catch((e) => {
        setError(e.response.data.message);
        setIsLoading(false);
      });
  }, [ ]);

  const deleteMember = async (itemId) => {
      try {
        const { data } = await axios.delete(
          `http://localhost:4000/teams/${itemId}`,
          {
            withCredentials: true,
          }
        );
        toast.success(data.message);
        setData((prevData) => prevData.filter((item) => item._id !== itemId));
        setCnt(cnt - 1);

      } catch (error) {
        toast.error(error.response.data.message);
      }
  }
  if (!isAuthenticated) return <Navigate to={"/login"} />;

  if (isLoading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>{error}</p>;
  } else if (data.length === 0) {
    return (
      <div>
        <p>Empty Team</p>
        <p>
          
          <Link to="/">Add Members</Link>
        </p>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * profilesPerPage;
  const endIndex = startIndex + profilesPerPage;
  const currentProfiles = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / profilesPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages && i <= 10; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <h1>MY TEAM</h1>
      <div className="mainBox">
        {currentProfiles.map((item) => (
          <div className="empInfo" key={item._id}>
            <div className="imgUser">
              <img src={item.avatar} alt="" />
            </div>
            <div className="userInfo">
              <div className="ques">
                <p>Name</p>
                <p>Email</p>
                <p>Gender</p>
                <p>Domain</p>
                <p>Available</p>
              </div>
              <div className="ans">
                <p>
                  {item.first_name} {item.last_name}
                </p>
                <p>{item.email}</p>
                <p>{item.gender}</p>
                <p> {item.domain}</p>
                <p>{item.available ? "Yes" : "No"}</p>
              </div>
            </div>

            <div>
              <button
                className="remove "
                onClick={() => {
                  deleteMember(item._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="pageTracker">
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((pageNumber) => (
          <button key={pageNumber} onClick={() => setCurrentPage(pageNumber)}>
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Profile;
