import React, { useState } from "react";
import axios from "axios";
import './Style.css'
import Login from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import StudentHome from "./StudentHome";
import AdminHome from "./AdminHome";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [marksData, setMarksData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);

    axios
      .post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setMarksData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    // code to handle student login
    setLoggedIn(true);
  };

  return (
    <div >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student/:roll_no" element={<StudentHome />} />
          <Route path="/admin/:admin_name" element={<AdminHome />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
