import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

import {
  collection, addDoc, query, where, getDocs,
  updateDoc, arrayUnion, doc
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const authContainer = document.getElementById('auth-container');
const mainApp = document.getElementById('main-app');
const userEmail = document.getElementById('userEmail');

onAuthStateChanged(auth, user => {
  if (user) {
    authContainer.style.display = 'none';
    mainApp.style.display = 'block';
    userEmail.textContent = user.email;
    loadProjects();
  } else {
    authContainer.style.display = 'block';
    mainApp.style.display = 'none';
  }
});

window.register = async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  await createUserWithEmailAndPassword(auth, email, password);
};

window.login = async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  await signInWithEmailAndPassword(auth, email, password);
};

window.logout = async () => {
  await signOut(auth);
};

window.createTeam = async () => {
  const teamName = document.getElementById('teamName').value;
  await addDoc(collection(db, "teams"), {
    owner: auth.currentUser.email,
    name: teamName,
    members: [auth.currentUser.email]
  });
  alert("Team created!");
};

window.submitProject = async () => {
  const title = document.getElementById('projectTitle').value;
  const link = document.getElementById('projectLink').value;
  const description = document.getElementById('projectDescription').value;
  await addDoc(collection(db, "projects"), {
    owner: auth.currentUser.email,
    title,
    link,
    description
  });
  alert("Project submitted!");
  loadProjects();
};

window.searchUsers = async () => {
  const search = document.getElementById('searchUser').value;
  const q = query(collection(db, "teams"), where("members", "array-contains", search));
  const results = await getDocs(q);
  const div = document.getElementById('searchResults');
  div.innerHTML = "";
  results.forEach(doc => {
    const d = document.createElement("div");
    d.textContent = `Team: ${doc.data().name} (Owner: ${doc.data().owner})`;
    div.appendChild(d);
  });
};

window.searchAndJoinTeams = async () => {
  const search = document.getElementById('teamSearch').value;
  const q = query(collection(db, "teams"), where("name", ">=", search));
  const results = await getDocs(q);
  const div = document.getElementById('joinTeamResults');
  div.innerHTML = "";
  results.forEach(snapshot => {
    const data = snapshot.data();
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<b>${data.name}</b> (Owner: ${data.owner})<br/>`;
    const joinBtn = document.createElement("button");
    joinBtn.textContent = "Join Team";
    joinBtn.onclick = async () => {
      await updateDoc(doc(db, "teams", snapshot.id), {
        members: arrayUnion(auth.currentUser.email)
      });
      alert("Joined team!");
    };
    wrapper.appendChild(joinBtn);
    div.appendChild(wrapper);
  });
};

async function loadProjects() {
  const q = query(collection(db, "projects"));
  const results = await getDocs(q);
  const div = document.getElementById('projectList');
  div.innerHTML = "";
  results.forEach(doc => {
    const d = document.createElement("div");
    d.className = "project";
    d.innerHTML = `<h3>${doc.data().title}</h3><p>${doc.data().description}</p><a href="${doc.data().link}" target="_blank">View</a>`;
    div.appendChild(d);
  });
}
