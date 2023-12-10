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
    
    let userCookie = getCookie('user');
    deleteCookie('user');

    if (dataCookie) {
      const data = parseObjectFromCookie(dataCookie);
      // work with data. `data` is equal to `visitCard` from the server
      // alert(JSON.stringify(data));
      const bio = document.getElementById("bioText");
      bio.innerHTML = data.bio
      
    } else {
      // handle data not found
    }

    if (userCookie) {

    } else {
      console.log("userCookie broken")
    }

      console.log(userCookie);
      const name = document.getElementById("name");
      const usernameBio = document.getElementById("usernameBio")
      usernameBio.value = userCookie;
      // const friends = getElementById("");
      name.innerHTML = userCookie;
      // alert(usernameBio.value)
  }