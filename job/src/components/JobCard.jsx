import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="border p-4 rounded shadow">
      <h3 className="text-lg font-bold">{job.title}</h3>
      <p>{job.description}</p>
      <Link
        to={`/job/${job._id}`}
        className="text-blue-500 mt-2 inline-block"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
