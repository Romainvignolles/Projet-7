import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown, faPhotoFilm, faShare, faComment, faCircleXmark, faPenToSquare, faTrashCan, faDoorOpen, } from "@fortawesome/free-solid-svg-icons";
import Profil from '../components/Profil';







const Homepage = () => {

  let storageId = parseInt(localStorage.getItem('id')); //récupération du l'userID depuis le local storage pour afficher le bouton modif
  let role = (localStorage.getItem('role')); //récupération du role depuis le local storage pour afficher le bouton modif


  const [load, setLoad] = useState("");                    //permet un refresh dynamique de la page
  const [items, setItems] = useState([]);

  const fetchData = async () => {
    const result = await axios(`${process.env.REACT_APP_API_URL}api/publication`)
    setItems(result.data)
  };

  useEffect(() => {     //  recuperation des donnée 'publication'
    fetchData()
  }, [load])


  const [title, setTitle] = useState("");                 // récupération des value text
  const [textContent, setTextContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [isUploaded, setIsUploaded] = useState(true)
  const [isModifUploaded, setIsModifUploaded] = useState(true)
  const [isCommentUploaded, setisCommentUploaded] = useState(true)





  const createPost = (e) => {                             //fonction au clic
    e.preventDefault();

    let inputFile = document.querySelector(".navbar__postFiles").files[0];   // récupération du fichier image
    let storageId = localStorage.getItem('id'); //récupération du l'userID depuis le local storage
    let token = localStorage.getItem('token');




    axios.interceptors.request.use(                         //ajouter le token au headers
      config => {
        config.headers.authorization = `Bearer ${token}`
        return config
      },
      error => {
        return Promise.reject(error);
      }
    );

    axios({                                                           // envoi des donnée recuperées vers la BDD via AXIOS
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/publication/`,
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        title,
        textContent,
        image: inputFile,
        utilisateurId: storageId,
        usersLiked: "",
        usersDisliked: ""
      }
    })
      .then((res) => {
        setTitle("");
        setTextContent("");
        setLoad(e);
        console.log(res);
        document.getElementById("navbar__postFiles").value = "";
        setIsUploaded(true)
        toast("publication crée avec succès!");




      })
      .catch((err) => {
        console.log(err);
      })


  }
  const createComment = (e) => {                             //fonction au clic
    e.preventDefault();

    let file = document.querySelector(".form_files").files[0]     // récupération du fichier image
    let storageId = localStorage.getItem('id');                    //récupération du l'userID depuis le local storage
    let publicationId = localStorage.getItem('postId'); // recupération de l'ID de la publication depuis le local storage

    axios({                                                           // envoi des donnée recuperées vers la BDD via AXIOS
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/commentaire`,
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        commentContent,
        image: file,
        utilisateurId: storageId,
        publicationId,
        usersLiked: "",
        usersDisliked: ""
      }
    })
      .then((res) => {
        setCommentContent("")
        setLoad(e)
        console.log(res);
        document.getElementById("form_files").value = "";
        setisCommentUploaded(true)


      })
      .catch((err) => {
        console.log(err);
      })

  }
  const likeFunction = (e) => {
    e.preventDefault();

    let like = e.currentTarget.value;

    let storageId = localStorage.getItem('id');

    let postId = e.currentTarget.getAttribute("data-postid");


    axios({     // envoi des donnée recuperées vers la BDD via AXIOS
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/publication/like`,
      withCredentials: true,
      data: {
        id: postId,
        like: parseInt(like),
        userId: storageId
      }
    })
      .then((res) => {
        setLoad(e)
        console.log(res);

      })
      .catch((err) => {
        console.log(err);
      })

  }
  const postLikeFunction = (e) => {
    e.preventDefault();

    let like = e.currentTarget.value;

    let storageId = localStorage.getItem('id');

    let commentaireid = e.currentTarget.getAttribute("data-commentaireid");


    axios({     // envoi des donnée recuperées vers la BDD via AXIOS
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/commentaire/like`,
      withCredentials: true,
      data: {
        id: commentaireid,
        like: parseInt(like),
        userId: storageId
      }
    })
      .then((res) => {
        setLoad(e)
        console.log(res);

      })
      .catch((err) => {
        console.log(err);
      })

  }

  //Change color file
  const colorChange = (e) => {

    if (e.target.value) {

      setIsUploaded(false)

    } else {
      setIsUploaded(true)
    }

  }
  const commentColorChange = (e) => {

    if (e.target.value) {

      setisCommentUploaded(false)

    } else {
      setisCommentUploaded(true)

    }

  }
  const modifColorChange = (e) => {


    if (e.target.value) {

      setIsModifUploaded(false)

    } else {
      setIsModifUploaded(true)
    }


  }
  const commentPopup = (e) => {

    let body = document.body;
    body.classList.add("removeScroll")      // desactive le scroll 

    let publicationId = e.currentTarget.getAttribute("data-postid"); // recupération de l'ID de la publication
    localStorage.setItem("postId", publicationId);


    let el = e.currentTarget;
    let next = el.parentElement;
    let element = next.nextElementSibling;

    if (element.className === "commentPopupOff") {
      element.classList.remove("commentPopupOff");
      element.classList.add("commentPopupOn")
    }
  }
  const closePopup = (e) => {

    let body = document.body;
    body.classList.remove("removeScroll")

    let el = e.currentTarget;
    let next = el.parentElement;


    if (next.className === "commentPopupOn") {
      next.classList.remove("commentPopupOn");
      next.classList.add("commentPopupOff")
    }
  }
  const modifyPost = (e) => {
    e.preventDefault();

    let postId = localStorage.getItem("postId")      //cible les input de chaque publication 
    let post = document.getElementById(postId)
    let div = post.firstChild
    let form = div.firstChild
    let ciblingTitle = form.firstChild
    let br = ciblingTitle.nextElementSibling
    let text = br.nextElementSibling



    let title = ciblingTitle.value;
    let textContent = text.value;



    let inputFile = document.querySelector(".modif__postFiles").files[0];   // récupération du fichier image

    let localId = localStorage.getItem('postId'); //récupération du l'id du commentaire depuis le local storage
    let token = localStorage.getItem('token');

    axios.interceptors.request.use(                         //ajouter le token au headers
      config => {
        config.headers.authorization = `Bearer ${token}`
        return config
      },
      error => {
        return Promise.reject(error);
      }
    );

    axios({                                                           // envoi des donnée recuperées vers la BDD via AXIOS
      method: "put",
      url: `${process.env.REACT_APP_API_URL}api/publication/${localId}`,
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        title: title,
        textContent: textContent,
        image: inputFile
      }
    })
      .then((res) => {
        setLoad(res);
        console.log(res);
        document.getElementById("navbar__postFiles").value = "";
        setIsModifUploaded(true)
      })
      .catch((err) => {
        console.log(err);
      })

  }
  const modifPopup = (e) => {

    let publicationId = e.currentTarget.getAttribute("data-postid");
    let defautlTitle = e.currentTarget.getAttribute("default-title");
    let defaultText = e.currentTarget.getAttribute("default_textcontent");
    localStorage.setItem("postId", publicationId);
    localStorage.setItem("defautlTitle", defautlTitle);
    localStorage.setItem("defaultText", defaultText);



    let el = e.currentTarget;
    let parent = el.parentNode;
    let cibling = parent.previousSibling;


    if (cibling.className === "modifOff") {
      cibling.classList.remove("modifOff");
      cibling.classList.add("modif")
    } else {
      cibling.classList.remove("modif");
      cibling.classList.add("modifOff")

    }
  }
  const deletePost = (e) => {
    const deleteValidation = window.confirm("voulez-vous vraiment supprimer cette publication?")


    if (deleteValidation) {
      let publicationId = e.currentTarget.getAttribute("data-postid"); // recupération de l'ID de la publication
      let publicationComment = e.currentTarget.getAttribute("data-postcomment"); // recupération des commentaire lié a la publication

      let token = localStorage.getItem('token');
      axios.interceptors.request.use(                         //ajouter le token au headers
        config => {
          config.headers.authorization = `Bearer ${token}`
          return config
        },
        error => {
          return Promise.reject(error);
        }
      );

      if (publicationComment) {

        axios({
          method: "delete",
          url: `${process.env.REACT_APP_API_URL}api/publication/commentaire/${publicationId}`,
          withCredentials: true,
        })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })

        axios({
          method: "delete",
          url: `${process.env.REACT_APP_API_URL}api/publication/${publicationId}`,
          withCredentials: true,
        })
          .then((res) => {
            setLoad(res);
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })

      } else {

        axios({
          method: "delete",
          url: `${process.env.REACT_APP_API_URL}api/publication/${publicationId}`,
          withCredentials: true,
        })
          .then((res) => {
            setLoad(res);
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })
      }
    } else {
      console.log("vous avez refusé de supprimer la publication");
    }

  }
  const deleteComment = (e) => {
    const deleteValidation = window.confirm("voulez-vous vraiment supprimer ce commentaire?")


    if (deleteValidation) {
      let commentId = e.currentTarget.getAttribute("data-commentid"); // recupération de l'ID de la publication

      let token = localStorage.getItem('token');
      axios.interceptors.request.use(                         //ajouter le token au headers
        config => {
          config.headers.authorization = `Bearer ${token}`
          return config
        },
        error => {
          return Promise.reject(error);
        }
      );


      axios({
        method: "delete",
        url: `${process.env.REACT_APP_API_URL}api/commentaire/${commentId}`,
        withCredentials: true,
      })
        .then((res) => {
          setLoad(res);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })

    }

  }
  const logOut = (e) => {
    localStorage.clear();
    window.location = "/login";

  }






  return (
    <div className='homepage'>
      <img className="backgroundimg" src="/images/architectural-blueprints.jpg" alt="openspace" />

      <div className='navbar'>
        <button className='navbar_logOut' onClick={logOut}><FontAwesomeIcon icon={faDoorOpen} />Déconnexion</button>

        <div className='navbar__createPublication'>
          <form className="navbar__post" onSubmit={createPost} action="/upload" method="post" >
            <input className="navbar__postTitle" placeholder="Votre titre" type="text" id="title" name="title" size="30" onChange={(e) => setTitle(e.target.value)} value={title} required />
            <br />
            <input className="navbar__postContent" placeholder="Qu'avez vous a raconter?" type="text" id="content" name="content" size="30" onChange={(e) => setTextContent(e.target.value)} value={textContent} required />
            <br />
            <div className='navbar__logo'>

              <label className='navbar__postSubmitLabel' htmlFor="navbar__postSubmit">
                <FontAwesomeIcon icon={faShare} />
              </label>
              <input hidden className="navbar__postSubmit" id="navbar__postSubmit" type="submit" value="Publier" />

              <label className={isUploaded ? "navbar__postFileLabel" : "navbar__postFileLabel--load"} htmlFor="navbar__postFiles">
                <FontAwesomeIcon icon={faPhotoFilm} />
              </label>
              <input hidden className="navbar__postFiles" id="navbar__postFiles" type="file" name='image' onChange={colorChange} />

            </div>
          </form>
        </div>
      </div>

      <div className='section'>
        <Profil />
        <div className='actu'>
          {items.map(publication => (
            <div key={publication.id} id={publication.id} className='publication'>

              {/* modification d'une publication */}
              <div className="modifOff">

                <form className="modif__post" id={publication.id} onSubmit={modifyPost} action="/upload" method="put" >
                  <input className="modif__postTitle" id="newTitle" placeholder="Votre titre" type="text" name="newTitle" size="30" defaultValue={publication.title} />
                  <br />
                  <input className="modif__postContent" id="newTextContent" placeholder="Qu'avez vous a raconter?" type="text" name="newContent" size="30" defaultValue={publication.textContent} />
                  <br />
                  <div className='modif__logo'>

                    <label className='modif__postSubmitLabel' htmlFor="modif__postSubmit">
                      <FontAwesomeIcon icon={faShare} />
                    </label>
                    <input hidden className="modif__postSubmit" id="modif__postSubmit" type="submit" value="modif" />

                    <label className={isModifUploaded ? "modif__postFileLabel" : "modif__postFileLabel--load"} htmlFor="modif__postFiles">
                      <FontAwesomeIcon icon={faPhotoFilm} />
                    </label>
                    <input hidden className="modif__postFiles" id="modif__postFiles" type="file" name='image' onChange={modifColorChange} />

                  </div>
                </form>
              </div>

              <div className={publication.utilisateurId === storageId || role == "admin" ? "suppModifOff" : "suppModif"}>
                <button className="modifPopup" data-postid={publication.id} default-title={publication.title} default_textcontent={publication.textContent} onClick={modifPopup} > <FontAwesomeIcon icon={faPenToSquare} /></button>
                <button className="suppPost" data-postid={publication.id} data-postcomment={publication.commentaires} onClick={deletePost} > <FontAwesomeIcon icon={faTrashCan} /></button>
              </div>


              {/* affichage de la publication */}
              <p className='publication_title'>{publication.title}</p>
              <p className='publication_text'>{publication.textContent}</p>
              <div className='publication_img'>
                <img src={publication.image} alt="" />
              </div>

              <div className='publication_bottom'>

                <p className='publication_bottom_from'>Par:&thinsp;{publication.utilisateur.pseudo}&emsp;le: &thinsp;{publication.utilisateur.createdAt}</p>

                {/* dislike Button */}
                <div className='publication_bottom_thumbsAll'>
                  <button className="publication_bottom_logo" onClick={likeFunction} value="-1" data-postid={publication.id}> <FontAwesomeIcon icon={faThumbsDown} /></button>
                  <p default="0" className='publication_bottom_number'>{publication.dislikes}</p>
                </div>

                {/* like Button */}
                <div className='publication_bottom_thumbsAll'>
                  <button className="publication_bottom_logo" onClick={likeFunction} value="1" data-postid={publication.id}> <FontAwesomeIcon icon={faThumbsUp} /></button>
                  <p className='publication_bottom_number'>{publication.likes}</p>
                </div>

                {/* comment button */}
                <div className='publication_bottom_commentAll'>
                  <button className="publication_bottom_logo" data-postid={publication.id} onClick={commentPopup} > <FontAwesomeIcon icon={faComment} /></button>
                  <p className='publication_bottom_number'>{publication.commentaires.length}</p>
                </div>

                {/*comment popup */}
                <div className='commentPopupOff'>

                  <label onClick={closePopup} className="form_close" htmlFor="form_close">
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </label>
                  <input hidden className="form_close" id="form_close" />

                  <form className="form" onSubmit={createComment} action="/upload" method="post" >

                    <label className={isCommentUploaded ? "form_commentFileLabel" : "form_commentFileLabel--load"} htmlFor="form_files">
                      <FontAwesomeIcon icon={faPhotoFilm} />
                    </label>
                    <input hidden className="form_files" id='form_files' type="file" name='image' placeholder="Choisir un fichier" onChange={commentColorChange} />

                    <input className="form_content" type="text" placeholder="Votre réaction?" id="content" name="content" size="30" onChange={(e) => setCommentContent(e.target.value)} value={commentContent} required />

                    <label className='form_postSubmitLabel' htmlFor="form_submit">
                      <FontAwesomeIcon icon={faShare} />
                    </label>
                    <input hidden className="form_submit" id='form_submit' type="submit" value="Publier" />

                  </form>
                  <div className='allComment'>
                    {publication.commentaires.map(commentaire => (
                      <div key={commentaire.id} className='commentaire'>
                        <span>{commentaire.utilisateur.pseudo}</span>
                        <p>{commentaire.commentContent}</p>
                        <img src={commentaire.image} alt="" />
                        <div className='commentaire_like'>

                          <div className='commentaire_like_thumbsAll'>
                            <button className="commentaire_like_logo" onClick={postLikeFunction} value="1" data-commentaireid={commentaire.id}> <FontAwesomeIcon icon={faThumbsUp} /></button>
                            <p className='commentaire_like_number'>{commentaire.likes}</p>
                          </div>

                          <div className='commentaire_like_thumbsAll'>
                            <button className="commentaire_like_logo" onClick={postLikeFunction} value="-1" data-commentaireid={commentaire.id}> <FontAwesomeIcon icon={faThumbsDown} /></button>
                            <p className='commentaire_like_number'>{commentaire.dislikes}</p>
                          </div>

                          <button className={commentaire.utilisateurId === storageId ? "commentaire_suppComment" : "commentaire_suppCommentOff"} data-commentid={commentaire.id} onClick={deleteComment} > <FontAwesomeIcon icon={faTrashCan} /></button>

                        </div>
                      </div>))}
                  </div>

                </div>

              </div>
            </div>))}

        </div>
        <ToastContainer
          theme='dark'
          position="bottom-left"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>

    </div >
  );
};

export default Homepage;