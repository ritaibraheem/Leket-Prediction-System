import React, {useState} from "react";
import Navbar from "./Navbar";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import image4 from "./assets/images/image4.jpg"

export const Register = (props) => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [pass , setPass] = useState('');
    const [name , setName] = useState('');
    const [phoneNumber , setPhoneNumber] = useState('');
    // var message = '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post('//localhost:4000/users/Register', {
            username: name,
            email: email,
            phone: phoneNumber,
            password: pass,
            // role: 'unauthorized'
        })
        .then(response => {
            console.log(response.data);
            // show success message to the user here
            alert('User registered successfully!');
            navigate("/Login"); // navigate to success page
            // message = response.message
        })
        .catch(error => {
            console.error(error);
            // show error message to the user here
            // alert('Error registering user. Please try again later.');
            alert(error.message);
        });
    }
    

    return(
        <div>
            
            <div className="signup">
            {/* <Navbar className='nav' /> */}
            <div class ="wrapper">
                <h1 className="h11"> Create New Account</h1>
                <button className="without-back-button-signup2" onClick={()=> navigate("/Login")}> Already have an account ? login</button>
                <div className="register-form" onSubmit={handleSubmit}>
                    <label className="label2" htmlFor="name">Username</label>
                    <input className="input2" value = {name} onChange ={(e) => setName(e.target.value)} name='username' id ="name" placeholder="username"/>
                    <label className="label2" htmlFor = "email"> Email </label>
                    <input className="input2" value ={email} onChange ={(e) => setEmail(e.target.value)} type = "email" placeholder = "youremail@gmail.com" id="email" name="email" />
                    <label className="label2" htmlFor="phoneNumber">Phone</label>
                    <input className="input2" value = {phoneNumber} onChange ={(e) => setPhoneNumber(e.target.value)} name='phone' id ="phone" placeholder="Phone"/>
                    <label className="label2" htmlFor = "password"> Password </label>
                    <input className="input2" value = {pass} onChange ={(e) => setPass(e.target.value)} type = "password" placeholder = "****" id="password" name="password" />             
                 </div>
                 <button className="black-signup-button" type="submit">sign up</button>

                 </div>
            </div> 
        </div>
    )
}
