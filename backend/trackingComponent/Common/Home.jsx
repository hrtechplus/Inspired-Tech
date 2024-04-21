import React from "react";
import { Link } from "react-router-dom";

// define routes and the to other traking routes
export default function Home() {
  return (
    <div>
      <h1>Menu</h1>
      <br />
      <Link to="/login">Login(admin)</Link>
      <br />
      <Link to="/register">Register</Link>
      <br />
      <Link to="/parcel">Track Your paarcel</Link>
      <br />
      <Link to="/edit">edit parcel data</Link>
      <br />
      <Link to="/test">Test screen for the grid layout</Link>
    </div>
  );
}
