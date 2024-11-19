import React, { useState, useEffect } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";

const HomePage = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Replace with your API endpoint
    axios.get("http://localhost:5000/api/jobs").then((response) => {
      setJobs(response.data);
    });
  }, []);

  return (
    <div className="container mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
