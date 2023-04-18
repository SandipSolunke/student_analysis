import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const navigate=useNavigate()

    return (
        <div>
            <Navbar />

            <h1>This is Home Page</h1>

            <button onClick={()=> navigate('/login')}>Login</button>
        </div>
    )
}

export default Home