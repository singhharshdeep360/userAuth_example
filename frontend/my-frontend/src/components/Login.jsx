import axios from "axios";

import { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleLogin = async () => {
        try {
            console.log(email);
            console.log(password)
            const response = await axios.post("http://localhost:3000/users/authuser", {
                params: {
                    emailAddress: email,
                    password: password,
                }
            });
            
        console.log(response.data);
        } catch (e) {
        console.error(e);
        }
    };
    
    return (
        <div>
        <h1>Login</h1>
        <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        </div>
    );
    }
 export default Login;