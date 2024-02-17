async function CheckPassword() {
    const response = await fetch('passwords.txt');
    const pwords = await response.text();

    // Split the options by newline and populate the dropdown
    const users = pwords.split('\n');
    const enteredUsername = document.getElementById('username').value;
    const enteredPassword = document.getElementById('password').value;

    for (const user of users) {
        const [UserName, Password] = user.split(" ");

        if (UserName.trim() === enteredUsername.trim() && Password.trim() === enteredPassword.trim()) {
            window.location.href = 'home';
            setCookie("LoginID", UserName.trim(), 365)
            return;
        }
    }

    // If the loop finishes and no match is found, handle the unsuccessful login here
    window.location.href = 'WrongPassword';
}

async function fetchData() {
    try {
      const response = await fetch('passwords.txt');
      const data = await response.text();
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return data;
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
};

function redirect(pwords) {
    for (i in pwords) {
        const [UserName, Password] = pwords[i].split(" ");

        if (getCookie("LoginID") == UserName) {
            window.location.href = 'home';
            return;
        };        
    };
};

async function processData() {
    const data = await fetchData();

    if (data) {
      const pwords = data.split("\n");
      redirect(pwords);
      return;
    } else {
        console.log("wtf")
    }
};

processData()