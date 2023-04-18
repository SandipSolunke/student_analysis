import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    const navigate = useNavigate()

    const handleLogin = (event) => {
        event.preventDefault();
        const username = event.target.username.value
        const password = event.target.password.value
        const role=event.target.role.value

        const userCreds = {
            username: username,
            password: password,
            role:role
        }

        axios
            .post("http://localhost:5000/login", userCreds)
            .then((response) => {
                console.log("response :", response.data)

                if (response.data.status === true) {
                    if(role==='student')
                        navigate(`/student/${username}`)
                    else
                        navigate(`/admin/${username}`)
                }
            })
            .catch((error) => {
                console.log(error);
            });
        setLoggedIn(true);
    };

    return (
        <div className="App">
            <div>
                <h1>Login</h1>
                <div>
                <form onSubmit={handleLogin}>
                    <label>
                        Username:
                        <input id="username" type="text" name="username" />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input id="password" type="password" name="password" />
                    </label>
                    <select id="role">
                        <option value="admin">Admin</option>
                        <option value="student">Student</option>
                    </select>
                    <br />
                    <button type="submit">Login</button>
                </form>
                </div>
            </div>
        </div>
    )
}

export default Login