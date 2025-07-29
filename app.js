import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import { 
  getFirestore, collection, addDoc, query, where, getDocs 
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import { app } from "./firebase-config.js";

const auth = getAuth(app);
const db = getFirestore(app);

// UI Elements
const authContainer = document.getElementById("auth-container");
const mainApp = document.getElementById("main-app");
const userEmailSpan = document.getElementById("userEmail");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const createTeamBtn = document.getElementById("createTeamBtn");
const teamNameInput = document.getElementById("teamName");

const searchUsersBtn = document.getElementById("searchUsersBtn");
const searchUserInput = document.getElementById("searchUser");
const searchResultsDiv = document.getElementById("searchResults");

const submitProjectBtn = document.getElementById("submitProjectBtn");
const projectTitleInput = document.getElementById("projectTitle");
const projectLinkInput = document.getElementById("projectLink");
const projectDescriptionInput = document.getElementById("projectDescription");
const projectListDiv = document.getElementById("projectList");

// Auth State Listener
onAuthStateChanged(auth, user => {
  if (user) {
    authContainer.style.display = "none";
    mainApp.style.display = "block";
    userEmailSpan.textContent = user.email;
    loadProjects();
  } else {
    authContainer.style.display = "block";
    mainApp.style.display = "none";
    userEmailSpan.textContent = "";
  }
});

// Register
registerBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Registered and logged in!");
  } catch (e) {
    alert("Error: " + e.message);
  }
});

// Login
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert("Error: " + e.message);
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// Create Team
createTeamBtn.addEventListener("click", async () => {
  const teamName = teamNameInput.value.trim();
  if (!teamName) {
    alert("Team name cannot be empty");
    return;
  }
  try {
    await addDoc(collection(db, "teams"), {
      name: teamName,
      createdBy: auth.currentUser.uid,
      members: [auth.currentUser.uid],
      createdAt: new Date()
    });
    alert(`Team "${teamName}" created!`);
    teamNameInput.value = "";
  } catch (e) {
    alert("Error creating team: " + e.message);
  }
});

// Search Users by Email
searchUsersBtn.addEventListener("click", async () => {
  const searchEmail = searchUserInput.value.trim();
  if (!searchEmail) {
    alert("Please enter an email to search.");
    return;
  }
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", searchEmail));
    const querySnapshot = await getDocs(q);
    searchResultsDiv.innerHTML = "";
    if (querySnapshot.empty) {
      searchResultsDiv.textContent = "No users found.";
    } else {
      querySnapshot.forEach(doc => {
        const user = doc.data();
        const div = document.createElement("div");
        div.textContent = user.email;
        searchResultsDiv.appendChild(div);
      });
    }
  } catch (e) {
    alert("Error searching users: " + e.message);
  }
});

// Submit Project
submitProjectBtn.addEventListener("click", async () => {
  const title = projectTitleInput.value.trim();
  const link = projectLinkInput.value.trim();
  const description = projectDescriptionInput.value.trim();
  if (!title || !link) {
    alert("Project title and link are required.");
    return;
  }
  try {
    await addDoc(collection(db, "projects"), {
      title,
      link,
      description,
      owner: auth.currentUser.uid,
      createdAt: new Date()
    });
    alert("Project submitted!");
    projectTitleInput.value = "";
    projectLinkInput.value = "";
    projectDescriptionInput.value = "";
    loadProjects();
  } catch (e) {
    alert("Error submitting project: " + e.message);
  }
});

// Load Projects for current user
async function loadProjects() {
  projectListDiv.innerHTML = "";
  try {
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("owner", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      projectListDiv.textContent = "No projects submitted yet.";
    } else {
      querySnapshot.forEach(doc => {
        const proj = doc.data();
        const div = document.createElement("div");
        div.innerHTML = `<h3>${proj.title}</h3>
          <a href="${proj.link}" target="_blank">${proj.link}</a>
          <p>${proj.description || ""}</p>`;
        projectListDiv.appendChild(div);
      });
    }
  } catch (e) {
    projectListDiv.textContent = "Error loading projects.";
  }
}
