const getCookie = (name) => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
  
  const deleteCookie = (name) => {
    document.cookie = name + '=; max-age=0;';
  };
  
  const parseObjectFromCookie = (cookie) => {
    const decodedCookie = decodeURIComponent(cookie);
    return JSON.parse(decodedCookie);
  };

  window.onload = () => {
    let dataCookie = getCookie('data');
    deleteCookie('data');
  
    let userCookie = getCookie('username');
    deleteCookie('user');
  
    if (dataCookie) {
      const data = decodeURIComponent(dataCookie)//parseObjectFromCookie(dataCookie);
      const results = document.getElementById("results");
      results.innerHTML = data;
    }
  
    if (userCookie) {
      const name = document.getElementById("name");
      const username = document.getElementById("username");
      const username2 = document.getElementById("username2");
      username.value = userCookie;
      username2.value = userCookie;
    } else {
        alert("userCookie not sent")
    }
} 