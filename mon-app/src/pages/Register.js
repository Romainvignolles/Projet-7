import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const Register = () => {


    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = (e) => {
        
        e.preventDefault();

        const generaleError = document.querySelector('.error_generale');
        const pseudoError = document.querySelector('.error_pseudo');
        const emailError = document.querySelector('.error_email');

        generaleError.innerHTML="";

        if (!email || !pseudo || !password ) {
           generaleError.innerHTML="Remplissez tout les champs du formulaire";
           emailError.innerHTML="";
           pseudoError.innerHTML="";
            
        } else {
            axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}api/auth/signup`,
            data: {
                pseudo,
                email,
                password,
            }
        })
            .then((res) => {
                console.log("okkkkkkkk");
                window.location = "/login";


            })
            .catch((err) => {
                console.log("pas okkkkkkkkkkk");
                console.log(err);
                if (err.response.status ==="403") {
                    emailError.innerHTML="email non valide!";
                }
                if (err.response.data.error.fields.pseudo) {
                    pseudoError.innerHTML="Le pseudo existe deja!";
                    emailError.innerHTML="";
                }
                if (err.response.data.error.fields.email) {
                    emailError.innerHTML="L'email existe deja!";
                    pseudoError.innerHTML="";

                }
                
                

            })
        }
        
    }

    return (
        <div className="login">

            <img className="backgroundimg" src="/images/alex-kotliarskyi-QBpZGqEMsKg-unsplash.jpg" alt="openspace" />
            <img className="login_logo" src="images/icon-left-font-monochrome-white.png" alt="Groupomania" />


            <div className="signup">
                <div className = "error_generale" ></div>
                <h1>Rejoignez nous!</h1>
                <form className="signup_form" action="" method="" onSubmit={handleSignup}>

                    <label htmlFor="pseudo">Pseudo</label>
                    <input className="signup_form_input" type="text" id="pseudo" name="pseudo" size="30" onChange={(e) => setPseudo(e.target.value)} value={pseudo} />
                    <div className ="error_pseudo"></div>

                    <label htmlFor="email">Email</label>
                    <input className="signup_form_input" type="text" id="email" name="email" size="30" onChange={(e) => setEmail(e.target.value)} value={email} />
                    <div className ="error_email"></div>

                    <label htmlFor="password">Mot de passe</label>
                    <input className="signup_form_input" type="password" id="password" name="password" size="30" onChange={(e) => setPassword(e.target.value)} value={password} />
                    <div className ="error_password"></div>


                    <input className="signup_form_button" type="submit" value="S'inscrire" />

                </form>
                <p >Déja inscrit?</p>
                <Link to="/login">
                    <button className="signup_form_button-header" >Connectez Vous!</button>
                </Link>


            </div>
        </div>
    );
};

export default Register;