function init() {
  document.getElementById("btn").addEventListener("click", (e) => {
    e.preventDefault();

    const pw = document.getElementById("password").value;
    if (pw.length < 4) {
      alert("password requires minimum 4 characters");
      return;
    }

    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      role: "customer",
    };

    fetch("http://127.0.0.1:9000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((el) => {
        document.cookie = `token=${el.token};SameSite=Lax`;
        window.location.href = "index.html";
      });
  });
}
