import Navbar from "./Navbar"
import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AdminHome = (props) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dailog,setDailog]=useState('None')

    const { admin_name } = useParams();


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
            console.log(response.data)
            setDailog(response.data.massage)
          })
          .catch((error) => {
            setDailog('Error While Uploading PDF!')
            console.log(error);
          });
      };
    
    
    return (
        <div>
            <Navbar />
            <h1>This is Admin Home</h1>

            <h3>Admin Name:{admin_name}</h3>

            <h1>Upload Marks</h1>

            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Submit</button>
            </form>

            <h3>Response :{dailog}</h3>
        </div>
    )
}


export default AdminHome