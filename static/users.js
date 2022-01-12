const cookies = document.cookie.split("=");
const globalToken = cookies[cookies.length - 1];

function init() {
  const cookies = document.cookie.split("=");
  const token = cookies[cookies.length - 1];

  fetch("http://127.0.0.1:8000/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const lst = document.getElementById("usrLst");

      data.forEach((el) => {
        lst.innerHTML += `<div class="usr">
                        <div class="usr-about">
                        <li>ID: ${el.id}, Name: ${el.name}, E-mail: ${el.email}, UserType: ${el.role}</li>
                        <button type="submit" class="btn btn-primary" onclick="modify(this)" id="modify-usr-btn" >Change</button>
                        <button type="submit" class="btn btn-primary" onclick="kick(this)" id="kick-usr-btn" >Remove User</button>
                        </div>
                        </div>`;
      });
    });
}

function modify(e) {
  const parent = e.parentNode.parentNode;
  for (
    var el = parent.parentNode.childNodes[0];
    el !== null;
    el = el.nextSibling
  ) {
    if (el.childNodes[3]) {
      el.removeChild(el.childNodes[3]);
    }
  }

  parent.innerHTML += `
        <div class="update-form">
          <div class="mb-3">
          <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
          <option value="customer">User</option>
          <option value="mod">Moderator</option>
        </select>
          <button type="submit" onclick="changeRole(this)" class="btn btn-primary" id="change-role-btn">Change Modification</button>
        </div>`;
}

function changeRole(e) {
  const role = e.parentNode.childNodes[1].value;
  const data = {
    role: role,
  };
  const inner = e.parentNode.parentNode.parentNode.childNodes[1].childNodes[1];
  const scId = parseInt(this.getUserId(inner.textContent));
  fetch(`http://127.0.0.1:8000/admin/users/${scId}`, {
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
        inner.innerHTML = `ID: ${data.id}, Name: ${data.name}, E-mail: ${data.email}, UserType: ${data.role}`;
      } else {
        alert(data.msg);
      }
    })
    .catch((err) => res.status(500).json(err));
}

function getUserId(data) {
  const tok = data.split(",");
  let part = tok[0];
  let sc_id = part.split(" ");
  const id = sc_id[1];
  return id;
}

function kick(e) {
  const curr = e.parentNode.parentNode;
  const par = curr.parentNode;
  const inner = curr.childNodes[1].childNodes[1];
  const usId = parseInt(this.getUserId(inner.textContent));
  fetch(`http://127.0.0.1:8000/admin/users/${usId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${globalToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data == 1) {
        par.removeChild(curr);
      } else {
        alert(data.msg);
      }
    })
    .catch((err) => res.status(500).json(err));
}
