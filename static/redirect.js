const cookies = document.cookie.split("=");
const globalToken = cookies[cookies.length - 1];
let modifybtn = false;

function init() {
  url = window.location.href;
  tokens = url.split("?");
  id_token = tokens[1];
  id = id_token.split("=");
  id = id[1];
  movieName = tokens[2];
  movieName = movieName.split("=");
  movieName = movieName[1];
  const cookies = document.cookie.split("=");
  const token = cookies[cookies.length - 1];

  movie_id = { id: id };

  fetch(`http://127.0.0.1:8000/admin/screenings/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("movie-name").innerHTML = data.name;
    });

  fetch("http://127.0.0.1:8000/admin/screenings", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      // val: id,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const lst = document.getElementById("screening-list");
      let i = 1;
      data.forEach((el) => {
        if (parseInt(id) == el.movieId) {
          document.getElementById(
            "screening-list"
          ).innerHTML += `<li id="screening"><a class="list-group-item list-group-item-action">ID:${el.id} Date: ${el.date},Day: ${el.day}, Time: ${el.time}
          <button type="submit" class="btn btn-primary" onclick="showUpdate(this)" id="update-btn">Modify</button>
          <button type="submit" class="btn btn-primary" onclick="deleteFun(this)" id="delete-btn">X</button></a></li>`;
        }
      });
    });

  document.getElementById("submit-btn").addEventListener("click", (e) => {
    data = {
      id: parseInt(id),
      date: document.getElementById("date-input").value,
      day: document.getElementById("day-input").value,
      time: document.getElementById("time-input").value,
    };

    if (data.date == "" || data.day == "" || data.time == "") {
      alert("please fill all fields");
      return;
    }

    fetch("http://127.0.0.1:8000/admin/screenings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg) {
          alert(data.msg);
        } else {
          document.getElementById(
            "screening-list"
          ).innerHTML += `<li id="screening"><a class="list-group-item list-group-item-action">ID:${data.id} Date: ${data.date},Day: ${data.day}, Time: ${data.time}
          <button type="submit" class="btn btn-primary" onclick="showUpdate(this)" id="update-btn">Modify</button>
          <button type="submit" class="btn btn-primary" onclick="deleteFun(this)" id="delete-btn">X</button></a></li>`;
        }
      });
  });
}

function deleteFun(e) {
  const sc = e.parentNode.childNodes[0].textContent;
  const tok = sc.split(" ");
  let part = tok[0];
  let sc_id = part.split(":");
  sc_id = sc_id[1];
  fetch(`http://127.0.0.1:8000/admin/screenings/${sc_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${globalToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data == 1) {
        e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode);
      } else {
        alert(data.msg);
      }
    })
    .catch((err) => res.status(500).json(err));
}

function showUpdate(e) {
  const rec = e.parentNode.parentNode.childNodes[0];
  if (e.parentNode.parentNode.childNodes.length == 1) {
    e.parentNode.parentNode.innerHTML += `
  <div class="update-form">
    <div class="mb-3">
      <input
        type="date"
        class="form-control"
        id="date-input-update"
        placeholder="Date"
      />
      <input
        type="text"
        class="form-control"
        id="day-input-update"
        placeholder="Day"
      />
      <input
        type="time"
        class="form-control"
        id="time-input-update"
        placeholder="Time"
      />
    </div>
    <button type="submit" onclick="hideUpForm(this)" class="btn btn-primary" id="submit-btn-update">Update</button>
  </div>
  `;
  }
}

function hideUpForm(e) {
  modifybtn = true;
  const scData = e.parentNode.parentNode.childNodes[0].textContent;
  const t =
    e.parentNode.parentNode.childNodes[2].childNodes[1].childNodes[5].value;
  const inner = e.parentNode.parentNode;
  const scId = this.getId(scData);
  const date =
    e.parentNode.parentNode.childNodes[2].childNodes[1].childNodes[1].value;
  const day =
    e.parentNode.parentNode.childNodes[2].childNodes[1].childNodes[3].value;
  const time =
    e.parentNode.parentNode.childNodes[2].childNodes[1].childNodes[5].value;

  e.parentNode.parentNode.removeChild(e.parentNode);
  const data = {
    date: date,
    day: day,
    time: time,
  };
  fetch(`http://127.0.0.1:8000/admin/screenings/${scId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${globalToken}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.msg) {
        inner.innerHTML = `<a class="list-group-item list-group-item-action">ID:${data.id} Date: ${data.date},Day: ${data.day}, Time: ${data.time}
        <button type="submit" class="btn btn-primary" onclick="showUpdate(this)" id="update-btn">Modify</button>
        <button type="submit" class="btn btn-primary" onclick="deleteFun(this)" id="delete-btn">X</button></a>`;
      } else {
        alert(data.msg);
      }
    });
}

function getId(data) {
  const tok = data.split(" ");
  let part = tok[0];
  let sc_id = part.split(":");
  const id = sc_id[1];
  return id;
}
