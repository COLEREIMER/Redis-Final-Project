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

const displayFriendsList = (friendsList) => {
  const listContainer = document.createElement('div');
  listContainer.id = 'friendsList';

  const list = document.createElement('ul');
  friendsList.forEach(friend => {
    const listItem = document.createElement('li');
    listItem.textContent = friend;
    list.appendChild(listItem);
  });

  listContainer.appendChild(list);
  const getFriendsButton = document.getElementById('getFriendsButton');
  getFriendsButton.insertAdjacentElement('afterend', listContainer);
};

window.onload = () => {
  let dataCookie = getCookie('data');
  deleteCookie('data');

  let userCookie = getCookie('user');
  deleteCookie('user');

  try{
    let loginCookie = getCookie('logins')
    deleteCookie('logins')
    logins = document.getElementById("numLogins")
    if (loginCookie) {
      logins.innerHTML = loginCookie
    } else {

    }
  } catch {
    console.log("no login cookies sent")
  }
  if (dataCookie) {
    const data = parseObjectFromCookie(dataCookie);
    const bio = document.getElementById("bioText");
    bio.innerHTML = data.bio;
  }

  if (userCookie) {
    const name = document.getElementById("name");
    const username = document.getElementById("username");
    const username1 = document.getElementById("username1");
    const username2 = document.getElementById("username2");
    username.value = userCookie;
    username1.value = userCookie;
    username2.value = userCookie;
    name.innerHTML = userCookie;

    // Event listener for Get Friends button
    const getFriendsButton = document.getElementById('getFriendsButton');
    getFriendsButton.addEventListener('click', function(event) {
      event.preventDefault();

      fetch('/getFriends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username1: username1.value })
      })
      .then(response => response.json())
      .then(data => {
        displayFriendsList(data.friends);
      })
      .catch(error => console.error('Error:', error));
    });
  } else {
    console.log("userCookie broken");
  }
};
