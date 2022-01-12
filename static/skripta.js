function init() {
  const cookies = document.cookie.split("=");
  const token = cookies[cookies.length - 1];

  if (token == "") {
    window.location.href = "login.html";
  } else {
    fetch("http://127.0.0.1:8000/admin/movies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const lst = document.getElementById("movieList");

        data.forEach((el) => {
          lst.innerHTML += `<li><a class="list-group-item list-group-item-action" href="redirect.html?id=${el.id}?name=${el.name}">
          <div id="movie-id"> ID: ${el.id} </div>
          <div id="movie-name"> Movie Name: ${el.name} </div> 
          <div id="movie-name"> Genre: ${el.genre} </div> 
          <div id="movie-name"> Actors:${el.actors} </div> 
          <div id="movie-name"> Movie Name: ${el.name} </div> 
          <div id="movie-name"> Producer: ${el.producer} </div> 
          <div id="movie-name"> Duration: ${el.timeDuration} </div> 
          <div id="movie-name"> Year: ${el.releaseYear} </div> 
          </a>
          <div class="mod-btns">
          <button type="submit" class="btn btn-primary" onclick="deleteFun(this)" id="delete-movie-btn">X</button>
          <button type="submit" class="btn btn-primary" onclick="edit(this)" id="edit-movie-btn">Edit</button> 
          </div>
          </li>
          `;
        });
      });

    document.getElementById("movieBtn").addEventListener("click", (e) => {
      e.preventDefault();

      const data = {
        name: document.getElementById("movie-input").value,
        genre: document.getElementById("genre-input").value,
        actors: document.getElementById("actors-input").value,
        producer: document.getElementById("producer-input").value,
        timeDuration: document.getElementById("dur-time-input").value,
        releaseYear: document.getElementById("rel-year-input").value,
      };

      document.getElementById("movie-input").value = "";
      document.getElementById("genre-input").value = "";
      document.getElementById("actors-input").value = "";
      document.getElementById("producer-input").value = "";
      document.getElementById("dur-time-input").value = "";
      document.getElementById("rel-year-input").value = "";

      fetch("http://127.0.0.1:8000/admin/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((el) => {
          if (el.msg) {
            alert(el.msg);
            return;
          }
          document.getElementById(
            "movieList"
          ).innerHTML += `<li><a class="list-group-item list-group-item-action" href="redirect.html?id=${el.id}?name=${el.name}">
                              <div id="movie-id"> ID: ${el.id} </div>
                              <div id="movie-name"> Movie Name: ${el.name} </div> 
                              <div id="movie-name"> Genre: ${el.genre} </div> 
                              <div id="movie-name"> Actors:${el.actors} </div> 
                              <div id="movie-name"> Movie Name: ${el.name} </div> 
                              <div id="movie-name"> Producer: ${el.producer} </div> 
                              <div id="movie-name"> Duration: ${el.timeDuration} </div> 
                              <div id="movie-name"> Year: ${el.releaseYear} </div> 
                              </a>
                              <div class="mod-btns">
                              <button type="submit" class="btn btn-primary" onclick="deleteFun(this)" id="delete-movie-btn">X</button>
                              <button type="submit" class="btn btn-primary" onclick="edit(this)" id="edit-movie-btn">Edit</button> 
                              </div> </li>`;
        });
    });

    document.getElementById("logout").addEventListener("click", (e) => {
      document.cookie = `token=;SameSite=Lax`;
      window.location.href = "login.html";
    });

    document.getElementById("user-config").addEventListener("click", (e) => {
      window.location.href = "users.html";
    });
  }
}

function updateMovie(e) {
  const cookies = document.cookie.split("=");
  const globalToken = cookies[cookies.length - 1];
  const par = e.parentNode.childNodes[1];

  const name = par.childNodes[1].value;
  const genre = par.childNodes[3].value;
  const actors = par.childNodes[5].value;
  const producer = par.childNodes[7].value;
  const timeDuration = par.childNodes[9].value;
  const releaseYear = par.childNodes[11].value;

  const data = {
    name: name,
    genre: genre,
    actors: actors,
    producer: producer,
    timeDuration: timeDuration,
    releaseYear: releaseYear,
  };

  const movieId = this.findId(e);

  fetch(`http://127.0.0.1:8000/admin/movies/${movieId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${globalToken}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((el) => {
      if (el.msg) {
        alert(el.msg);
        return;
      }
      e.parentNode.parentNode.innerHTML = `<a class="list-group-item list-group-item-action" href="redirect.html?id=${el.id}?name=${el.name}">
      <div id="movie-id"> ID: ${el.id} </div>
      <div id="movie-name"> Movie Name: ${el.name} </div> 
      <div id="movie-name"> Genre: ${el.genre} </div> 
      <div id="movie-name"> Actors:${el.actors} </div> 
      <div id="movie-name"> Movie Name: ${el.name} </div> 
      <div id="movie-name"> Producer: ${el.producer} </div> 
      <div id="movie-name"> Duration: ${el.timeDuration} </div> 
      <div id="movie-name"> Year: ${el.releaseYear} </div> 
      </a>
      <div class="mod-btns">
      <button type="submit" class="btn btn-primary" onclick="deleteFun(this)" id="delete-movie-btn">X</button>
      <button type="submit" class="btn btn-primary" onclick="edit(this)" id="edit-movie-btn">Edit</button> 
      </div>`;
    })
    .catch((err) => res.status(500).json(err));
}

function edit(e) {
  const cookies = document.cookie.split("=");
  const globalToken = cookies[cookies.length - 1];
  let li = e.parentNode.parentNode;

  if (li.childNodes.length >= 5) {
    li.childNodes[4].innerHTML = null;
    li.removeChild(li.childNodes[4]);
    return;
  }

  li.innerHTML += `<form method="post">
  <div class="mb-3">
    <input
      type="text"
      class="form-control"
      id="movie-input"
      placeholder="Movie"
    />
    <input
      type="text"
      class="form-control"
      id="genre-input"
      placeholder="Genre"
    />
    <input
      type="text"
      class="form-control"
      id="actors-input"
      placeholder="Main Actors"
    />
    <input
      type="text"
      class="form-control"
      id="producer-input"
      placeholder="Movie Producer"
    />
    <input
      type="number"
      class="form-control"
      id="dur-time-input"
      placeholder="Movie Duration Time"
    />
    <input
      type="text"
      class="form-control"
      id="rel-year-input"
      placeholder="Movie Release Year"
    />
  </div>
  <button type="button" onclick="updateMovie(this)" class="btn btn-primary" id="movieBtn">
    Submit
  </button>
  <button type="button" onclick="edit(this)" class="btn btn-primary" id="cancel-btn">
    Cancel
  </button>
</form>`;
}

function deleteFun(e) {
  const cookies = document.cookie.split("=");
  const globalToken = cookies[cookies.length - 1];
  // e.parentNode.parentNode.removeChild(e.parentNode);
  const parent = e.parentNode;
  const data =
    e.parentNode.parentNode.childNodes[0].childNodes[1].childNodes[0]
      .textContent;

  id = parseInt(this.getId(data));
  fetch(`http://127.0.0.1:8000/admin/movies/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${globalToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data == 1) {
        e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode);
        e.parentNode.parentNode.innerHTML = null;
      } else {
        alert(data.msg);
      }
    })
    .catch((err) => res.status(500).json(err));
}

function getId(data) {
  let tok = data.split(" ");
  let id = tok[2];
  return id;
}

function findId(e) {
  const txt =
    e.parentNode.parentNode.childNodes[0].childNodes[1].childNodes[0]
      .textContent;
  const id = this.getId(txt);
  return parseInt(id);
}
