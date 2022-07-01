import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faPenToSquare, faPhotoFilm, faGear } from "@fortawesome/free-solid-svg-icons";




const Profil = (e) => {

  const [loaded, setLoaded] = useState();                               //permet un refresh dynamique de la page
  const [pseudo, setPseudo] = useState(localStorage.getItem("pseudo"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [image, setImage] = useState(localStorage.getItem("userImage"));
  const [isModifUploaded, setIsModifUploaded] = useState(true)
  const [togglePopup, setTogglePopup] = useState(true)






  useEffect(() => {     //  recuperation des donnée user dans le local storage
    setPseudo(localStorage.getItem("pseudo"));
    setEmail(localStorage.getItem("email"));
    setImage(localStorage.getItem("userImage"));
  }, [loaded])



  const infoPopup = (e) => {

    if (togglePopup === true) {

      setTogglePopup(false)
    }
    if (togglePopup === false) {
      setTogglePopup(true)
    }

  }
  const modifColorChange = (e) => {


    if (e.target.value) {

      setIsModifUploaded(false)

    } else {
      setIsModifUploaded(true)
    }


  }
  const modifPseudo = (e) => {
    let pseudoInput = document.getElementById("pseudoInput");
    pseudoInput.disabled = false;
    document.getElementById("pseudoInput").focus();


  }
  const modifEmail = (e) => {
    let emailInput = document.getElementById("emailInput");
    emailInput.disabled = false;
    document.getElementById("emailInput").focus();


  }
  const submitInfo = (e) => {
    let emailInput = document.getElementById("emailInput");           //disable input
    let pseudoInput = document.getElementById("pseudoInput");

    let userId = localStorage.getItem("id");


    const pseudoError = document.querySelector('.error_pseudo');      //gestion html des erreurs
    const emailError = document.querySelector('.error_email');


    let pseudoInputValue = document.getElementById("pseudoInput").value;       //recup la value pour envoi vers la bdd
    let emailInputValue = document.getElementById("emailInput").value;


    let file = document.getElementById("file").files[0];


    console.log(file);

    if (!file) {
      axios({                                                           // envoi des donnée recuperées vers la BDD via AXIOS
        method: "put",
        url: `${process.env.REACT_APP_API_URL}api/auth/user/${userId}`,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: {
          pseudo: pseudoInputValue,
          email: emailInputValue,
        }
      })
        .then((res) => {
          setLoaded(res)
          console.log(res);
          pseudoError.innerHTML = "";
          emailError.innerHTML = "";
          localStorage.setItem("pseudo", pseudoInputValue)
          localStorage.setItem("email", emailInputValue)
          emailInput.disabled = true;
          pseudoInput.disabled = true;
          setTogglePopup(true)
          setIsModifUploaded(true)

        })
        .catch((err) => {
          if ((err.response.data.message === "Champs invalide") || (err.response.data.message === `l'adresse mail est invalide`)) {
            console.log("champ invalide");
          }
          if (err.response.data.error.fields.pseudo) {
            pseudoError.innerHTML = "Le pseudo existe deja!";
            emailError.innerHTML = "";
            console.log("ce pseudo existe deja");
          }
          if (err.response.data.error.fields.email) {
            console.log("cet email existe deja");
            emailError.innerHTML = "L'email existe deja!";
            pseudoError.innerHTML = "";
          }
        })


    } else {
      axios({                                                           // envoi des donnée recuperées vers la BDD via AXIOS
        method: "put",
        url: `${process.env.REACT_APP_API_URL}api/auth/user/${userId}`,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: {
          pseudo: pseudoInputValue,
          email: emailInputValue,
          image: file
        }
      })
        .then((res) => {
          setLoaded(res)
          console.log(res);
          pseudoError.innerHTML = "";
          emailError.innerHTML = "";
          localStorage.setItem("pseudo", pseudoInputValue)
          localStorage.setItem("email", emailInputValue)
          localStorage.setItem("userImage", res.data.thingObject.image)
          emailInput.disabled = true;
          pseudoInput.disabled = true;
          setTogglePopup(true)
          setIsModifUploaded(true)

        })
        .catch((err) => {
          if ((err.response.data.message === "Champs invalide") || (err.response.data.message === `l'adresse mail est invalide`)) {
            console.log("champ invalide");
          }
          if (err.response.data.error.fields.pseudo) {
            pseudoError.innerHTML = "Le pseudo existe deja!";
            emailError.innerHTML = "";
            console.log("ce pseudo existe deja");
          }
          if (err.response.data.error.fields.email) {
            console.log("cet email existe deja");
            emailError.innerHTML = "L'email existe deja!";
            pseudoError.innerHTML = "";
          }
        })

    }


  }
  const deleteUser = (e) => {

    const deleteValidation = window.confirm("voulez-vous vraiment supprimer ce compte?")

    if (deleteValidation) {
      let userId = localStorage.getItem("id");

      const logOut = (e) => {
        localStorage.clear();
        window.location = "/login";
      }

      axios({
        method: "delete",
        url: `${process.env.REACT_APP_API_URL}api/auth/user/delete/${userId}`,
        withCredentials: true,
      })
        .then((res) => {
          console.log(res);
          logOut()
        })
        .catch((err) => {
          console.log(err);
        })


    } else {
      console.log("vous avez refuser de supprimer ce compte");
    }

  }





  return (
    <div className='profil' >
      <span className="profil__name">Bienvenue {pseudo}</span>

      <div className='profil__content'>
        <button className='profil__button' onClick={infoPopup}><FontAwesomeIcon icon={faGear} /></button>

        <div className='profil__img'>
          <img className="profil__avatar" src={image} alt="" />
        </div>


        <div className={togglePopup ? "profil__infoOff" : "profil__info"}>

          <button className='profil__suppUser' onClick={deleteUser} >Supprimer ce compte</button>

          <div className='profil__infoPseudo'>
            <input disabled className='profil__infoPseudo__inputPseudo' type="text" id="pseudoInput" defaultValue={pseudo} required />
            <div className="error_pseudo"></div>
            <button className="profil__infoPseudo__modifBtn" onClick={modifPseudo}> <FontAwesomeIcon icon={faPenToSquare} /></button>
          </div>

          <div className='profil__infoEmail'>
            <input disabled className='profil__infoEmail__inputEmail' type="email" id="emailInput" defaultValue={email} required />
            <div className="error_email"></div>
            <button className="profil__infoEmail__modifBtn" onClick={modifEmail}> <FontAwesomeIcon icon={faPenToSquare} /></button>
          </div>

          <div className='profil__logo'>
            <label className={isModifUploaded ? "profil__logo__file" : "profil__logo__fileOff"} htmlFor="file">
              <FontAwesomeIcon icon={faPhotoFilm} />
            </label>
            <input hidden className="profil__logo__file" id="file" type="file" name='image' onChange={modifColorChange} />
            <button className="profil__logo__submit" onClick={submitInfo}> <FontAwesomeIcon icon={faShare} /></button>
          </div>


        </div>


      </div>

    </div>
  );
}

export default Profil;