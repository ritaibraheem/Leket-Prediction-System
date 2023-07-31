import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const Register = (props) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [pass , setPass] = useState('');
    const [name , setName] = useState('');
    const [phoneNumber , setPhoneNumber] = useState('');

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Sending registration data to the server
        axios.post('//localhost:4000/users/Register', {
            username: name,
            email: email,
            phone: phoneNumber,
            password: pass,
        })
        .then(response => {
            console.log(response.data);
            // Show success message to the user here
            alert('User registered successfully!');
            navigate("/Login"); // Navigate to success page (Login)
        })
        .catch(error => {
            console.error(error);
            // Show error message to the user here
            alert(error.message);
        });
    }

    return(
        <div>
            <div className="signup">
                {/* Navbar */}
                {/* <Navbar className='nav' /> */}

                <div className="wrapper">
                    <h1 className="h11"> Create New Account</h1>
                    <button className="without-back-button-signup2" onClick={() => navigate("/Login")}> Already have an account? Login</button>
                    
                    <div className="register-form" onSubmit={handleSubmit}>
                        {/* Input fields for registration data */}
                        <label className="label2" htmlFor="name">Username</label>
                        <input className="input2" value={name} onChange={(e) => setName(e.target.value)} name='username' id="name" placeholder="username" />

                        <label className="label2" htmlFor="email">Email</label>
                        <input className="input2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" />

                        <label className="label2" htmlFor="phoneNumber">Phone</label>
                        <input className="input2" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} name='phone' id="phone" placeholder="Phone" />

                        <label className="label2" htmlFor="password">Password</label>
                        <input className="input2" value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="****" id="password" name="password" />
                    </div>
                    {/* Button to submit the registration form */}
                    <button className="black-signup-button" type="submit">Sign Up</button>
                </div>
            </div> 
        </div>
    )
}
