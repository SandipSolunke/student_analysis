import { useParams } from "react-router-dom";
import Navbar from "./Navbar"
import axios from "axios";
import { useEffect, useState } from "react";



const StudentHome = (props) => {
    const { roll_no } = useParams();
    const [marks ,setMarks]=useState([])

    const getStudentResult = async () => {
        axios
            .get("http://localhost:5000/getStudentResult", { params: { roll_no:roll_no } })
            .then((response) => {
                if (response.data.status === true) {
                    setMarks(response.data.data)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getStudentResult()
    }, [])
    return (
        <div>
            <Navbar />
            <h1>This is Student Home</h1>

            <h3>Roll no:{roll_no}</h3>

            <hr></hr>
            <h2>Result </h2>

            {
                marks.map((el,index)=>{
                    return <div> <li key={index}>sub name :{el.subject_name}....mark :{el.mark}</li> </div>
                })
            }
        </div>
    )
}


export default StudentHome