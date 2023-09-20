import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./styles/Home.css";
import { Navigate } from "react-router-dom";
import { Context } from "..";
import toast from "react-hot-toast";

const Home = () => {
  const [Data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 20;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, cnt, setCnt } = useContext(Context);
  const [genderFilter, setGenderFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/empInfo/allData`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.userData);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e.response.data.message);
        setIsLoading(false);
      });
  }, []);

  const addToTeam = async (item) => {
    try {
      const { data } = await axios.post(
        `http://localhost:4000/teams/newTeam`,
        {
          first_name: item.first_name,
          last_name: item.last_name,
          email: item.email,
          gender: item.gender,
          avatar: item.avatar,
          domain: item.domain,
          available: item.available,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data.message === "member added") {
        setCnt(cnt + 1);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) return <Navigate to={"/login"} />;
  const startIndex = (currentPage - 1) * profilesPerPage;
  const endIndex = startIndex + profilesPerPage;
  let currentProfiles = Data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(Data.length / profilesPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages && i <= 10; i++) {
    pageNumbers.push(i);
  }

  const filteredProfiles = Data.filter((item) => {
    const matchesGender =
      genderFilter === "all" || item.gender === genderFilter;
    const matchesDomain =
      domainFilter === "all" || item.domain === domainFilter;
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "true" && item.available) ||
      (availabilityFilter === "false" && !item.available);

    return matchesGender && matchesDomain && matchesAvailability;
  });

  currentProfiles = filteredProfiles.slice(startIndex, endIndex);

  return (
    <div>
      <div>
        <select
          className="filter"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="all">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select
          className="filter"
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
        >
          <option value="all">All Domains</option>
          <option value="IT">IT</option>
          <option value="Business Development">Business Development</option>
          <option value="Finance">Finance</option>
          <option value="Management">Management</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="UI Designing">UI Designing</option>
        </select>

        <select
          className="filter"
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
        >
          <option value="all">All Availability</option>
          <option value={true}>Available</option>
          <option value={false}>Not Available</option>
        </select>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="mainBox">
          {currentProfiles.map((item) => (
            <div key={item._id} className="empInfo">
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
                  className="add"
                  onClick={() => {
                    addToTeam(item);
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {error ? (
        <div>Login First</div>
      ) : (
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
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={pageNumber === currentPage ? "selectedPage" : ""}
            >
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
      )}
    </div>
  );
};

export default Home;
