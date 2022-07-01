import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';



const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        const emailError = document.querySelector('.error_email');
        const passwordError = document.querySelector('.error_password');

        axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}api/auth/login`,
            withCredentials: true,
            data: {
                email,
                password,
            }
        })
            .then((res) => {
                console.log(res.data);
                localStorage.setItem("id",res.data.userId);
                localStorage.setItem("token",res.data.token);
                localStorage.setItem("pseudo",res.data.pseudo);
                localStorage.setItem("email",res.data.email);
                localStorage.setItem("userImage",res.data.image);
                localStorage.setItem("role",res.data.role);
                window.location = "/Homepage";

            })
            .catch((err) => {
                console.log(err);
                if (err.response.data.error === "Utilisateur non trouvé !") {
                    emailError.innerHTML = err.response.data.error;
                    passwordError.innerHTML = "";
                } else if (err.response.data.error === 'Mot de passe incorrect !') { 
                    passwordError.innerHTML = err.response.data.error;
                    emailError.innerHTML = "";
                }
            })

    }

    return (
        <div className="login">
            <img className="backgroundimg" src="/images/alex-kotliarskyi-QBpZGqEMsKg-unsplash.jpg" alt=" openspace" />
            <img className="login_logo" src="images/icon-left-font-monochrome-white.png" alt="logo Groupomania" />
            <div className="signup">
                <h1>Bienvenue!</h1>
                <form id="loginForm" className="signup_form" onSubmit={handleLogin} action="" method="">

                    <label htmlFor="email">email</label>
                    <input className="signup_form_input" type="text" id="email" name="email" size="30" onChange={(e) => setEmail(e.target.value)} value={email} />
                    <div className ="error_email"></div>

                    <label htmlFor="password">Mot de passe</label>
                    <input className="signup_form_input" type="password" id="password" name="password" size="30" onChange={(e) => setPassword(e.target.value)} value={password} />
                    <div className ="error_password"></div>

                    <input className="signup_form_button" type="submit" value="Se connecter" />

                </form>
                <p > Vous souhaitez creer un compte?</p>
                <Link to="/">
                    <button className="signup_form_button-header" >Inscrivez Vous!</button>
                </Link>

            </div>
        </div>
    );
};

export default Login;