import React, { useState } from "react";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";

import Login from '../components/Login'

function Home() {
  const [session, setSession] = useState(false);


  return (
    <HelmetProvider>
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      {session ? User() : <Login />}
    </HelmetProvider>
  );
}

// Guest
function Guest() {
  return (<main className="container py-20 mx-auto text-center">
    <h3 className="font-bold teext-4xl">
      Gust Homepagee
    </h3>
    <div className="flex justify-center">
      <Link to="/login">Login</Link>
    </div>
  </main>
  );
}

// Authorized User
function User() {
  return (<main className="container py-20 mx-auto text-center">
    <h3 className="font-bold teext-4xl">
      Authorized User Homepagee
    </h3>
    <div className="details">
      <h5>Unknown</h5>
      <h5>Unknown</h5>
    </div>

    <div className="flex justify-center">
      <button className="px-10 py-1 mt-5 bg-indigo-600 rounded-sm hover:bg-indigo-500">Sign Out</button>
    </div>


  </main>
  );
}
export default Home;
