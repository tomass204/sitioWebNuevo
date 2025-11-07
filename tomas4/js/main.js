<<<<<<< HEAD
const loginContainer = document.getElementById('login-container');
const mainContent = document.getElementById('main-content');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');
const userRoleSpan = document.getElementById('user-role');

// EmailJS removed, using mailto instead

const registerBtn = document.getElementById('register-btn');
const registerError = document.getElementById('register-error');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const registerRoleSelect = document.getElementById('register-role');
const moderatorRequestDiv = document.getElementById('moderator-request');

const newsList = document.getElementById('news-list');
const newsFormContainer = document.getElementById('news-form-container');
const debateList = document.getElementById('debate-list');
const debateFormContainer = document.getElementById('debate-form-container');
const gameGallery = document.getElementById('game-gallery');
const gameFormContainer = document.getElementById('game-form-container');
const favoritesList = document.getElementById('favorites-list');
const favoritesTab = document.getElementById('favorites-tab');

let currentRole = null;
let currentUser = null;

let users = JSON.parse(localStorage.getItem('gaminghub_users')) || {
    'basic@gaminghub.com': { password: 'pass', role: 'UsuarioBasico', warnings: 0, profilePic: 'img/UsuarioBasico.png', username: 'UsuarioBasico' },
    'influencer@gaminghub.com': { password: 'pass', role: 'Influencer', warnings: 0, profilePic: 'img/Influencer.png', username: 'Influencer' },
    'moderator@gaminghub.com': { password: 'pass', role: 'Moderador', warnings: 0, profilePic: 'img/Moderador.png', username: 'Moderador' },
    'tomasgarrido512@gmail.com': { password: 'pass', role: 'Propietario', warnings: 0, profilePic: 'img/Propietario.png', username: 'Propietario' }
};

let favorites = JSON.parse(localStorage.getItem('gaminghub_favorites')) || [];

let pendingRequests = JSON.parse(localStorage.getItem('gaminghub_pending')) || [];

// Using Formspree for notifications to moderator

window.addEventListener('beforeunload', () => {
    localStorage.setItem('scrollPosition', window.scrollY);
});

function saveUsers() {
    localStorage.setItem('gaminghub_users', JSON.stringify(users));
}

function saveFavorites() {
    localStorage.setItem('gaminghub_favorites', JSON.stringify(favorites));
}

function savePending() {
    localStorage.setItem('gaminghub_pending', JSON.stringify(pendingRequests));
}

function getRoleProfilePic(userEmail) {
    if (!userEmail || !users[userEmail]) {
        return 'img/UsuarioBasico.png';
    }
    const role = users[userEmail].role;
    switch (role) {
        case 'Influencer':
            return 'img/Influencer.png';
        case 'Moderador':
            return 'img/Moderador.png';
        case 'Propietario':
            return 'img/Propietario.png';
        case 'UsuarioBasico':
        default:
            return 'img/UsuarioBasico.png';
    }
}

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const email = urlParams.get('email');
    const username = urlParams.get('username');

    if (action && email && username) {
        if (action === 'approve' && (currentRole === 'Moderador' || currentRole === 'Propietario')) {
            // Find and approve the request
            const index = pendingRequests.findIndex(req => req.email === email && req.username === username);
            if (index !== -1) {
                users[email] = {
                    password: 'moderator123',
                    username: username,
                    role: 'Moderador',
                    warnings: 0,
                    profilePic: 'img/Moderador.png'
                };
                saveUsers();
                pendingRequests.splice(index, 1);
                savePending();
                alert('Solicitud aprobada desde el email.');
            }
        } else if (action === 'reject' && (currentRole === 'Moderador' || currentRole === 'Propietario')) {
            const index = pendingRequests.findIndex(req => req.email === email && req.username === username);
            if (index !== -1) {
                pendingRequests.splice(index, 1);
                savePending();
                alert('Solicitud rechazada desde el email.');
            }
        }
        // Clean URL
        window.history.replaceState(null, null, window.location.pathname);
    }

    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('currentRole');
    if (savedUser && savedRole && users[savedUser]) {
        currentUser = savedUser;
        currentRole = savedRole;
        userRoleSpan.textContent = currentRole;
        loginContainer.style.display = 'none';
        mainContent.style.display = 'block';
        updateUI();
        document.getElementById('profile-pic').src = users[currentUser].profilePic || getRoleProfilePic(currentUser);
        // Hide inactive tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            if (!content.classList.contains('active')) {
                content.style.display = 'none';
                content.style.opacity = '0';
            }
        });

        // Restore active tab
        const savedTab = localStorage.getItem('activeTab') || 'profile';
        document.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === savedTab) {
                content.classList.add('active');
                content.style.display = 'block';
                content.style.opacity = '1';
            } else {
                content.classList.remove('active');
                content.style.display = 'none';
                content.style.opacity = '0';
            }
        });
        document.querySelectorAll('.tab-button').forEach(btn => {
            if (btn.getAttribute('data-tab') === savedTab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Populate profile if needed
        if (savedTab === 'profile' && currentUser) {
            document.getElementById('profile-username').value = users[currentUser].username || '';
            document.getElementById('profile-email').value = currentUser;
            document.getElementById('profile-password').value = '';
            document.getElementById('profile-pic').src = users[currentUser].profilePic || getRoleProfilePic(currentUser);
        }

        // Restore scroll position
        const savedScroll = localStorage.getItem('scrollPosition');
        if (savedScroll) {
            window.scrollTo(0, parseInt(savedScroll));
        }
    }
});

const news = JSON.parse(localStorage.getItem('gaminghub_news')) || [
    { id: 1, title: 'Nueva temporada de Clash Royale', content: 'Supercell lanza la temporada de invierno con nuevas cartas y desafíos.', comments: [], image: 'img/clash_royale.jpg', author: 'influencer@gaminghub.com' },
    { id: 2, title: 'Actualización épica de Fortnite', content: 'Capítulo 5 trae mapas nuevos y colaboraciones con Roblox.', comments: [], image: 'img/fortnite.jpg', author: 'influencer@gaminghub.com' },
    { id: 3, title: 'Eventos especiales en Roblox', content: 'Fiestas temáticas y premios exclusivos para los jugadores.', comments: [], image: 'img/roblox.jpg', author: 'influencer@gaminghub.com' },
    { id: 4, title: 'Nuevo juego de Batman anunciado', content: 'DC Comics revela el próximo título de Batman con gráficos revolucionarios.', comments: [], image: 'img/Batman.png', author: 'influencer@gaminghub.com' },
    { id: 5, title: 'Outlast Trials: Nuevo horror cooperativo', content: 'Red Barrels lanza Outlast Trials, un juego de horror en primera persona con modo cooperativo.', comments: [], image: 'img/Outlast.png', author: 'influencer@gaminghub.com' },
    { id: 6, title: 'Nuevo evento en Brawl Stars', content: 'Supercell lanza un evento especial en Brawl Stars con nuevos personajes y desafíos.', comments: [], image: 'img/BrawlStars.png', author: 'influencer@gaminghub.com' },
    { id: 7, title: 'Actualización de Brawl Stars', content: 'Nueva temporada en Brawl Stars con brawlers exclusivos y modos de juego emocionantes.', comments: [], image: 'img/BrawlStars.png', author: 'influencer@gaminghub.com' },
    { id: 8, title: 'Nueva actualización de Minecraft', content: 'Mojang Studios lanza una nueva actualización con biomas, mobs y características innovadoras.', comments: [], image: 'img/Minecraft.png', author: 'influencer@gaminghub.com' }
];

const debates = JSON.parse(localStorage.getItem('gaminghub_debates')) || [
    { id: 1, title: '¿Clash Royale o Fortnite?', content: '¿Cuál es mejor para batallas rápidas?', comments: [], image: 'img/clash_royale.jpg', author: 'influencer@gaminghub.com' },
    { id: 2, title: 'Roblox: ¿Juego o plataforma?', content: 'Debate sobre el futuro de los juegos creados por usuarios.', comments: [], image: 'img/roblox.jpg', author: 'influencer@gaminghub.com' },
    { id: 3, title: '¿Batman: Arkham o Injustice?', content: 'Debate sobre cuál saga de Batman es superior.', comments: [], image: 'img/Batman.png', author: 'influencer@gaminghub.com' },
    { id: 4, title: '¿Outlast Trials: Terror cooperativo?', content: '¿Es Outlast Trials el mejor juego de horror cooperativo del momento?', comments: [], image: 'img/Outlast.png', author: 'influencer@gaminghub.com' },
    { id: 5, title: '¿Brawl Stars o Clash Royale?', content: '¿Cuál es mejor para batallas estratégicas?', comments: [], image: 'img/BrawlStars.png', author: 'influencer@gaminghub.com' },
    { id: 6, title: '¿Brawl Stars: Estrategia o acción?', content: 'Debate sobre si Brawl Stars es más estratégico o de acción pura.', comments: [], image: 'img/BrawlStars.png', author: 'influencer@gaminghub.com' },
    { id: 7, title: '¿Minecraft: Creatividad o supervivencia?', content: 'Debate sobre si Minecraft es más sobre creatividad o supervivencia.', comments: [], image: 'img/Minecraft.png', author: 'influencer@gaminghub.com' }
];

const games = JSON.parse(localStorage.getItem('gaminghub_games')) || [
    { title: 'Clash Royale', category: 'strategy', description: 'Juego de estrategia en tiempo real.', image: 'img/ClashRoyale.png', author: 'influencer@gaminghub.com' },
    { title: 'Fortnite', category: 'action', description: 'Battle royale con construcción.', image: 'img/Fornite.png', author: 'influencer@gaminghub.com' },
    { title: 'Roblox', category: 'adventure', description: 'Plataforma de juegos creados por usuarios.', image: 'img/Roblox.png', author: 'influencer@gaminghub.com' },
    { title: 'Batman', category: 'action', description: 'Juego de acción y aventura con el Caballero Oscuro.', image: 'img/Batman.png', author: 'influencer@gaminghub.com' },
    { title: 'Outlast Trials', category: 'horror', description: 'Juego de horror cooperativo en primera persona.', image: 'img/Outlast.png', author: 'influencer@gaminghub.com' },
    { title: 'Brawl Stars', category: 'strategy', description: 'Juego de batalla multijugador en tiempo real con personajes únicos.', image: 'img/BrawlStars.png', author: 'influencer@gaminghub.com' },
    { title: 'Minecraft', category: 'adventure', description: 'Juego de construcción y exploración en un mundo abierto.', image: 'img/Minecraft.png', author: 'influencer@gaminghub.com' }
];

function saveNews() {
    localStorage.setItem('gaminghub_news', JSON.stringify(news));
}

function saveDebates() {
    localStorage.setItem('gaminghub_debates', JSON.stringify(debates));
}

function saveGames() {
    localStorage.setItem('gaminghub_games', JSON.stringify(games));
}

function createCommentElement(comment, debateIndex = null, newsIndex = null) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';

    const authorDiv = document.createElement('div');
    authorDiv.className = 'comment-author';
    const profilePic = document.createElement('img');
    profilePic.src = getRoleProfilePic(comment.author);
    profilePic.alt = 'Profile';
    profilePic.className = 'comment-profile-pic';
    authorDiv.appendChild(profilePic);
    const authorName = document.createElement('span');
    authorName.textContent = users[comment.author]?.username || comment.author;
    authorDiv.appendChild(authorName);
    commentDiv.appendChild(authorDiv);

    const textP = document.createElement('p');
    textP.textContent = comment.text;
    commentDiv.appendChild(textP);

    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';
    likeBtn.textContent = `Me gusta (${comment.likes})`;
    if (comment.liked) {
        likeBtn.classList.add('liked');
    }
    likeBtn.onclick = () => {
        if (!comment.liked) {
            comment.likes++;
            comment.liked = true;
            likeBtn.textContent = `Me gusta (${comment.likes})`;
            likeBtn.classList.add('liked');
        }
    };
    commentDiv.appendChild(likeBtn);

    if (currentRole === 'UsuarioBasico') {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.textContent = 'Guardar en Favoritos';
        favoriteBtn.onclick = () => {
            if (!favorites.some(fav => fav.type === 'comment' && fav.id === comment.id)) {
                favorites.push({ type: 'comment', id: comment.id, content: comment.text, author: comment.author });
                saveFavorites();
                alert('Comentario guardado en favoritos');
            } else {
                alert('Ya está en favoritos');
            }
        };
        commentDiv.appendChild(favoriteBtn);
    }

    if (currentRole === 'Moderador' || currentRole === 'Propietario') {
        const warnBtn = document.createElement('button');
        warnBtn.className = 'warn-btn';
        warnBtn.textContent = 'Advertir';
        warnBtn.onclick = () => {
            if (comment.author && users[comment.author]) {
                users[comment.author].warnings = (users[comment.author].warnings || 0) + 1;
                saveUsers();
                if (users[comment.author].warnings >= 3) {
                    alert(`Usuario ${comment.author} ha alcanzado 3 advertencias. Considera acciones adicionales.`);
                } else {
                    alert(`Advertencia enviada a ${comment.author}. Advertencias restantes: ${3 - users[comment.author].warnings}`);
                }
            }
        };
        commentDiv.appendChild(warnBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.onclick = async () => {
            try {
                await CommentsAPI.deleteComment(comment.id);
                commentDiv.remove();
            } catch (e) {
                console.error('Failed to delete comment', e);
            }
        };
        commentDiv.appendChild(deleteBtn);
    }

    return commentDiv;
}

async function displayNews() {
    newsList.innerHTML = '';
    for (const item of news) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'news-item';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        itemDiv.appendChild(img);

        const h3 = document.createElement('h3');
        h3.textContent = item.title;
        itemDiv.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = item.content;
        itemDiv.appendChild(p);

        const authorDiv = document.createElement('div');
        authorDiv.className = 'item-author';
        const profilePic = document.createElement('img');
        profilePic.src = getRoleProfilePic(item.author);
        profilePic.alt = 'Author Profile';
        profilePic.className = 'author-profile-pic';
        authorDiv.appendChild(profilePic);
        const authorName = document.createElement('span');
        authorName.textContent = users[item.author]?.username || item.author;
        authorDiv.appendChild(authorName);
        itemDiv.appendChild(authorDiv);

        const commentsDiv = document.createElement('div');
        commentsDiv.className = 'comments';

        // Fetch comments from API
        try {
            const apiComments = await CommentsAPI.getCommentsByPublication(item.id);
            // Map API comments to local format
            const mappedComments = apiComments._embedded.comentarios.map(c => ({
                id: c.comentarioID,
                text: c.contenido,
                author: c.autorID,
                likes: 0,
                liked: false
            }));
            mappedComments.forEach(comment => {
                commentsDiv.appendChild(createCommentElement(comment, null, news.indexOf(item)));
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
        }

        const commentForm = document.createElement('form');
        commentForm.innerHTML = `
            <input type="text" placeholder="Escribe un comentario..." required>
            <button type="submit">Comentar</button>
        `;
        commentForm.onsubmit = async (e) => {
            e.preventDefault();
            const input = commentForm.querySelector('input');
            const commentData = {
                texto: input.value,
                autor: currentUser,
                publicacionId: item.id
            };
            try {
                const newComment = await CommentsAPI.createComment(commentData);
                const comment = {
                    id: newComment._embedded.comentario.comentarioID,
                    text: newComment._embedded.comentario.contenido,
                    author: newComment._embedded.comentario.autorID,
                    likes: 0,
                    liked: false
                };
                commentsDiv.appendChild(createCommentElement(comment, null, news.indexOf(item)));
                input.value = '';
            } catch (error) {
                alert('Error al crear el comentario');
                console.error('Error creating comment:', error);
            }
        };

        itemDiv.appendChild(commentsDiv);
        itemDiv.appendChild(commentForm);
        newsList.appendChild(itemDiv);
    }
}

async function displayDebates() {
    debateList.innerHTML = '';
    for (const item of debates) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'debate-item';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        itemDiv.appendChild(img);

        const h3 = document.createElement('h3');
        h3.textContent = item.title;
        itemDiv.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = item.content;
        itemDiv.appendChild(p);

        const authorDiv = document.createElement('div');
        authorDiv.className = 'item-author';
        const profilePic = document.createElement('img');
        profilePic.src = getRoleProfilePic(item.author);
        profilePic.alt = 'Author Profile';
        profilePic.className = 'author-profile-pic';
        authorDiv.appendChild(profilePic);
        const authorName = document.createElement('span');
        authorName.textContent = users[item.author]?.username || item.author;
        authorDiv.appendChild(authorName);
        itemDiv.appendChild(authorDiv);

        const commentsDiv = document.createElement('div');
        commentsDiv.className = 'comments';

        // Fetch comments from API
        try {
            const apiComments = await CommentsAPI.getCommentsByPublication(item.id);
            const mappedComments = apiComments._embedded.comentarios.map(c => ({
                id: c.comentarioID,
                text: c.contenido,
                author: c.autorID,
                likes: 0,
                liked: false
            }));
            mappedComments.forEach(comment => {
                commentsDiv.appendChild(createCommentElement(comment, debates.indexOf(item), null));
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
        }

        const commentForm = document.createElement('form');
        commentForm.innerHTML = `
            <input type="text" placeholder="Escribe un comentario..." required>
            <button type="submit">Comentar</button>
        `;
        commentForm.onsubmit = async (e) => {
            e.preventDefault();
            const input = commentForm.querySelector('input');
            const commentData = {
                texto: input.value,
                autor: currentUser,
                publicacionId: item.id
            };
            try {
                const newComment = await CommentsAPI.createComment(commentData);
                const comment = {
                    id: newComment._embedded.comentario.comentarioID,
                    text: newComment._embedded.comentario.contenido,
                    author: newComment._embedded.comentario.autorID,
                    likes: 0,
                    liked: false
                };
                commentsDiv.appendChild(createCommentElement(comment, debates.indexOf(item), null));
                input.value = '';
            } catch (error) {
                alert('Error al crear el comentario');
                console.error('Error creating comment:', error);
            }
        };

        itemDiv.appendChild(commentsDiv);
        itemDiv.appendChild(commentForm);
        debateList.appendChild(itemDiv);
    }
}

function displayGames() {
    gameGallery.innerHTML = '';
    games.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'game-item';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        itemDiv.appendChild(img);

        const h3 = document.createElement('h3');
        h3.textContent = item.title;
        itemDiv.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = item.description;
        itemDiv.appendChild(p);

        const authorDiv = document.createElement('div');
        authorDiv.className = 'item-author';
        const profilePic = document.createElement('img');
        profilePic.src = getRoleProfilePic(item.author);
        profilePic.alt = 'Author Profile';
        profilePic.className = 'author-profile-pic';
        authorDiv.appendChild(profilePic);
        const authorName = document.createElement('span');
        authorName.textContent = users[item.author]?.username || item.author;
        authorDiv.appendChild(authorName);
        itemDiv.appendChild(authorDiv);

        gameGallery.appendChild(itemDiv);
    });
}

function displayFavorites() {
    favoritesList.innerHTML = '';
    favorites.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'favorite-item';

        const h3 = document.createElement('h3');
        h3.textContent = item.content;
        itemDiv.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = `Por: ${users[item.author]?.username || item.author}`;
        itemDiv.appendChild(p);

        favoritesList.appendChild(itemDiv);
    });
}

function displayPendingRequests() {
    const pendingList = document.getElementById('pending-list');
    if (!pendingList) return;
    pendingList.innerHTML = '';
    pendingRequests.forEach((request, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'pending-item';

        const h3 = document.createElement('h3');
        h3.textContent = `Solicitud de ${request.username} (${request.email})`;
        itemDiv.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = `Motivo: ${request.reason}`;
        itemDiv.appendChild(p);

        const dateP = document.createElement('p');
        dateP.textContent = `Fecha: ${new Date(request.date).toLocaleString()}`;
        itemDiv.appendChild(dateP);

        const approveBtn = document.createElement('button');
        approveBtn.textContent = 'Aprobar';
        approveBtn.onclick = () => {
            // Create user account
            users[request.email] = {
                password: 'moderator123', // Default password
                username: request.username,
                role: 'Moderador',
                warnings: 0,
                profilePic: 'img/Moderador.png'
            };
            saveUsers();
            // Remove from pending
            pendingRequests.splice(index, 1);
            savePending();
            displayPendingRequests();
            alert('Solicitud aprobada. Usuario creado con contraseña "moderator123".');

            // Send email to user
            emailjs.send('your_service_id', 'your_template_id', {
                to_email: request.email,
                subject: 'Solicitud de Moderador Aprobada',
                message: 'Tu solicitud ha sido aprobada. Inicia sesión aquí: https://gaminghub.com con tu email y contraseña moderator123.'
            }).then(() => {
                alert('Email enviado al usuario.');
            }, (error) => {
                console.error('Error sending email:', error);
            });
        };
        itemDiv.appendChild(approveBtn);

        const rejectBtn = document.createElement('button');
        rejectBtn.textContent = 'Rechazar';
        rejectBtn.onclick = () => {
            const comment = prompt('Razón para rechazar la solicitud (opcional):');
            if (comment !== null) {
                // Optionally, store the comment or send email
                pendingRequests.splice(index, 1);
                savePending();
                displayPendingRequests();
                alert('Solicitud rechazada.');

                // Send email to user
                emailjs.send('your_service_id', 'your_template_id', {
                    to_email: request.email,
                    subject: 'Solicitud de Moderador Rechazada',
                    message: `Lo lamento, tu solicitud ha sido rechazada. Razón: ${comment || 'No especificada'}. No podrás ser moderador.`
                }).then(() => {
                    alert('Email enviado al usuario.');
                }, (error) => {
                    console.error('Error sending email:', error);
                });
            }
        };
        itemDiv.appendChild(rejectBtn);

        pendingList.appendChild(itemDiv);
    });
}

async function updateUI() {
    await displayNews();
    await displayDebates();
    displayGames();
    displayFavorites();

    if (currentRole === 'Moderador' || currentRole === 'Propietario') {
        document.getElementById('moderator-section').style.display = 'block';
        displayPendingRequests();
    } else {
        document.getElementById('moderator-section').style.display = 'none';
    }

    if (currentRole === 'Influencer') {
        newsFormContainer.style.display = 'block';
        debateFormContainer.style.display = 'block';
        gameFormContainer.style.display = 'block';
    } else {
        newsFormContainer.style.display = 'none';
        debateFormContainer.style.display = 'none';
        gameFormContainer.style.display = 'none';
    }

    if (currentRole === 'UsuarioBasico') {
        favoritesTab.style.display = 'inline-block';
    } else {
        favoritesTab.style.display = 'none';
    }
}

// Form switching
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    moderatorRequestDiv.style.display = 'none'; // Reset moderator request display
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Role select event listener
registerRoleSelect.addEventListener('change', () => {
    if (registerRoleSelect.value === 'Moderador') {
        moderatorRequestDiv.style.display = 'block';
        registerBtn.textContent = 'Enviar Solicitud';
    } else {
        moderatorRequestDiv.style.display = 'none';
        registerBtn.textContent = 'Crear Cuenta';
    }
});

// Login
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email.includes('@')) {
        loginError.textContent = 'El correo electrónico debe contener @';
        loginError.style.display = 'block';
        return;
    }

    if (users[email] && users[email].password === password) {
        currentUser = email;
        currentRole = users[email].role;
        userRoleSpan.textContent = currentRole;
        loginContainer.style.display = 'none';
        mainContent.style.display = 'block';
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('currentRole', currentRole);
        localStorage.setItem('token', 'dummy-token');
        updateUI();
        document.getElementById('profile-pic').src = users[currentUser].profilePic || getRoleProfilePic(currentUser);
    } else {
        loginError.textContent = 'Credenciales incorrectas';
        loginError.style.display = 'block';
    }
});

// Register
registerBtn.addEventListener('click', () => {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const username = document.getElementById('register-username').value;
    const role = document.getElementById('register-role').value;
    const reason = document.getElementById('moderator-reason').value;

    if (!email || !password || !username) {
        registerError.textContent = 'Por favor completa todos los campos';
        registerError.style.display = 'block';
        return;
    }

    if (!email.includes('@')) {
        registerError.textContent = 'El correo electrónico debe contener @';
        registerError.style.display = 'block';
        return;
    }

    if (role === 'Moderador') {
        if (!reason.trim()) {
            registerError.textContent = 'Por favor describe por qué quieres ser moderador';
            registerError.style.display = 'block';
            return;
        }

        // Store pending request
        pendingRequests.push({ email, username, reason, date: new Date().toISOString() });
        savePending();

        // Show success ticket
        showSuccessTicket('Solicitud en proceso');

        // Send request using Formspree
        const form = document.createElement('form');
        form.action = 'https://formspree.io/f/mvgbnlyj';
        form.method = 'POST';
        form.style.display = 'none';

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.name = 'email';
        emailInput.value = email;
        form.appendChild(emailInput);

        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.name = 'username';
        usernameInput.value = username;
        form.appendChild(usernameInput);

        const reasonInput = document.createElement('textarea');
        reasonInput.name = 'reason';
        reasonInput.value = reason;
        form.appendChild(reasonInput);

        document.body.appendChild(form);
        form.submit();

        // Clear the form fields
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
        document.getElementById('register-username').value = '';
        document.getElementById('moderator-reason').value = '';
        registerRoleSelect.value = 'UsuarioBasico';
        moderatorRequestDiv.style.display = 'none';

        // Do not switch back to login form automatically
        // User stays on the registration form with success message visible

        return;
    }

    // For other roles, create account
    if (users[email]) {
        registerError.textContent = 'El usuario ya existe';
        registerError.style.display = 'block';
        return;
    }

    users[email] = {
        password: password,
        username: username,
        role: role,
        warnings: 0,
        profilePic: `img/${role}.png`
    };

    saveUsers();

    // Show a success ticket
    showSuccessTicket('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');

    // Switch back to login form after 2 seconds
    setTimeout(() => {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        hideSuccessTicket();
    }, 2000);
});

// Success ticket functions
function showSuccessTicket(message) {
    let ticket = document.createElement('div');
    ticket.id = 'success-ticket';
    ticket.textContent = message;
    ticket.style.position = 'fixed';
    ticket.style.top = '20px';
    ticket.style.right = '20px';
    ticket.style.backgroundColor = '#4caf50';
    ticket.style.color = 'white';
    ticket.style.padding = '15px 25px';
    ticket.style.borderRadius = '10px';
    ticket.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
    ticket.style.fontWeight = 'bold';
    ticket.style.zIndex = '1000';
    document.body.appendChild(ticket);
}

function hideSuccessTicket() {
    const ticket = document.getElementById('success-ticket');
    if (ticket) {
        ticket.remove();
    }
}

// Logout
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    currentRole = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRole');
    localStorage.removeItem('token');
    loginContainer.style.display = 'block';
    mainContent.style.display = 'none';
});

// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');

        // Hide all tab contents immediately
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.opacity = '0';
            content.classList.remove('active');
            content.style.display = 'none';
        });

        // Show new active
        const newActive = document.getElementById(tabName);
        newActive.style.display = 'block';
        setTimeout(() => {
            newActive.classList.add('active');
            newActive.style.opacity = '1';
        }, 10); // Small delay to allow display block

        // Update active button
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        localStorage.setItem('activeTab', tabName);

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Populate profile form if profile tab is opened
        if (tabName === 'profile' && currentUser) {
            document.getElementById('profile-username').value = users[currentUser].username || '';
            document.getElementById('profile-email').value = currentUser;
            document.getElementById('profile-password').value = '';
            document.getElementById('profile-pic').src = users[currentUser].profilePic || getRoleProfilePic(currentUser);
        }
    });
});

// Form submissions
document.getElementById('news-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('news-title').value;
    const content = document.getElementById('news-content').value;
    const imageInput = document.getElementById('news-image');
    const image = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : 'img/default_news.jpg';

    news.push({ id: Date.now(), title, content, comments: [], image, author: currentUser });
    saveNews();
    await updateUI();
    e.target.reset();
});

document.getElementById('debate-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('debate-title').value;
    const content = document.getElementById('debate-content').value;
    const imageInput = document.getElementById('debate-image');
    const image = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : 'img/default_debate.jpg';

    debates.push({ id: Date.now(), title, content, comments: [], image, author: currentUser });
    saveDebates();
    await updateUI();
    e.target.reset();
});

document.getElementById('game-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('game-title').value;
    const category = document.getElementById('game-category').value;
    const description = document.getElementById('game-description').value;
    const imageInput = document.getElementById('game-image');
    const image = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : 'img/default_game.jpg';

    games.push({ title, category, description, image, author: currentUser });
    saveGames();
    updateUI();
    e.target.reset();
});

// Profile picture upload functionality removed

// Profile update form
document.getElementById('profile-update-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('profile-username').value;
    const email = document.getElementById('profile-email').value;
    const password = document.getElementById('profile-password').value;

    if (username) {
        users[currentUser].username = username;
    }
    if (password) {
        users[currentUser].password = password;
    }
    if (email && email !== currentUser) {
        if (users[email]) {
            alert('El correo electrónico ya está en uso');
            return;
        }
        if (!email.includes('@')) {
            alert('El correo electrónico debe contener @');
            return;
        }
        users[email] = users[currentUser];
        delete users[currentUser];
        currentUser = email;
        localStorage.setItem('currentUser', currentUser);
    }
    saveUsers();
    alert('Perfil actualizado exitosamente');
    updateUI();
});

updateUI();
=======
const loginContainer = document.getElementById('login-container');
const mainContent = document.getElementById('main-content');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');
const userRoleSpan = document.getElementById('user-role');

// EmailJS removed, using mailto instead

const registerBtn = document.getElementById('register-btn');
const registerError = document.getElementById('register-error');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const registerRoleSelect = document.getElementById('register-role');
const moderatorRequestDiv = document.getElementById('moderator-request');

const newsList = document.getElementById('news-list');
const newsFormContainer = document.getElementById('news-form-container');
const debateList = document.getElementById('debate-list');
const debateFormContainer = document.getElementById('debate-form-container');
const gameGallery = document.getElementById('game-gallery');
const gameFormContainer = document.getElementById('game-form-container');
const favoritesList = document.getElementById('favorites-list');
const favoritesTab = document.getElementById('favorites-tab');

let currentRole = null;
let currentUser = null;

let users = JSON.parse(localStorage.getItem('gaminghub_users')) || {
    'basic@gaminghub.com': { password: 'pass', role: 'UsuarioBasico', warnings: 0, profilePic: 'img/UsuarioBasico.png', username: 'UsuarioBasico' },
    'influencer@gaminghub.com': { password: 'pass', role: 'Influencer', warnings: 0, profilePic: 'img/Influencer.png', username: 'Influencer' },
    'moderator@gaminghub.com': { password: 'pass', role: 'Moderador', warnings: 0, profilePic: 'img/Moderador.png', username: 'Moderador' },
    'tomasgarrido512@gmail.com': { password: 'pass', role: 'Propietario', warnings: 0, profilePic: 'img/Propietario.png', username: 'Propietario' }
};

let favorites = JSON.parse(localStorage.getItem('gaminghub_favorites')) || [];

let pendingRequests = JSON.parse(localStorage.getItem('gaminghub_pending')) || [];

// Using Formspree for notifications to moderator

window.addEventListener('beforeunload', () => {
    localStorage.setItem('scrollPosition', window.scrollY);
});

function saveUsers() {
    localStorage.setItem('gaminghub_users', JSON.stringify(users));
}

function saveFavorites() {
    localStorage.setItem('gaminghub_favorites', JSON.stringify(favorites));
}

function savePending() {
    localStorage.setItem('gaminghub_pending', JSON.stringify(pendingRequests));
}

function getRoleProfilePic(userEmail) {
    if (!userEmail || !users[userEmail]) {
        return 'img/UsuarioBasico.png';
    }
    const role = users[userEmail].role;
    switch (role) {
        case 'Influencer':
            return 'img/Influencer.png';
        case 'Moderador':
            return 'img/Moderador.png';
        case 'Propietario':
            return 'img/Propietario.png';
        case 'UsuarioBasico':
        default:
            return 'img/UsuarioBasico.png';
    }
}

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const email = urlParams.get('email');
    const username = urlParams.get('username');

    if (action && email && username) {
        if (action === 'approve' && (currentRole === 'Moderador' || currentRole === 'Propietario')) {
            // Find and approve the request
            const index = pendingRequests.findIndex(req => req.email === email && req.username === username);
            if (index !== -1) {
                users[email] = {
                    password: 'moderator123',
                    username: username,
                    role: 'Moderador',
                    warnings: 0,
                    profilePic: 'img/Moderador.png'
                };
                saveUsers();
                pendingRequests.splice(index, 1);
                savePending();
                alert('Solicitud aprobada desde el email.');
            }
        } else if (action === 'reject' && (currentRole === 'Moderador' || currentRole === 'Propietario')) {
            const index = pendingRequests.findIndex(req => req.email === email && req.username === username);
            if (index !== -1) {
                pendingRequests.splice(index, 1);
                savePending();
                alert('Solicitud rechazada desde el email.');
            }
        }
        // Clean URL
        window.history.replaceState(null, null, window.location.pathname);
    }

    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('currentRole');
    if (savedUser && savedRole && users[savedUser]) {
        currentUser = savedUser;
        currentRole = savedRole;
        userRoleSpan.textContent = currentRole;
        loginContainer.style.display = 'none';
        mainContent.style.display = 'block';
        updateUI();
        document.getElementById('profile-pic').src = users[currentUser].profilePic || getRoleProfilePic(currentUser);
        // Hide inactive tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            if (!content.classList.contains('active')) {
                content.style.display = 'none';
                content.style.opacity = '0';
            }
        });

        // Restore active tab
        const savedTab = localStorage.getItem('activeTab') || 'profile';
        document.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === savedTab) {
                content.classList.add('active');
                content.style.display = 'block';
                content.style.opacity = '1';
            } else {
                content.classList.remove('active');
                content.style.display = 'none';
                content.style.opacity = '0';
            }
        });
        document.querySelectorAll('.tab-button').forEach(btn => {
            if (btn.getAttribute('data-tab') === savedTab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Populate profile if needed
        if (savedTab === 'profile' && currentUser) {
            document.getElementById('profile-username').value = users[currentUser].username || '';
            document.getElementById('profile-email').value = currentUser;
            document.getElementById('profile-password').value = '';
            document.getElementById('profile-pic').src = users[currentUser].profilePic || getRoleProfilePic(currentUser);
        }

        // Restore scroll position
        const savedScroll = localStorage.getItem('scrollPosition');
        if (savedScroll) {
            window.scrollTo(0, parseInt(savedScroll));
        }
    }
});

const news = JSON.parse(localStorage.getItem('gaminghub_news')) || [
    { title: 'Nueva temporada de Clash Royale', content: 'Supercell lanza la temporada de invierno con nuevas cartas y desafíos.', comments: [], image: 'img/clash_royale.jpg', author: 'influencer@gaminghub.com' },
    { title: 'Actualización épica de Fortnite', content: 'Capítulo 5 trae mapas nuevos y colaboraciones con Roblox.', comments: [], image: 'img/fortnite.jpg', author: 'influencer@gaminghub.com' },
    { title: 'Eventos especiales en Roblox', content: 'Fiestas temáticas y premios exclusivos para los jugadores.', comments: [], image: 'img/roblox.jpg', author: 'influencer@gaminghub.com' },
    { title: 'Nuevo juego de Batman anunciado', content: 'DC Comics revela el próximo título de Batman con gráficos revolucionarios.', comments: [], image: 'img/Batman.png', author: 'influencer@gaminghub.com' },
    { title: 'Outlast Trials: Nuevo horror cooperativo', content: 'Red Barrels lanza Outlast Trials, un juego de horror en primera persona con modo cooperativo.', comments: [], image: 'img/Outlast.png', author: 'influencer@gaminghub.com' },
    { title: 'Nuevo evento en Brawl Stars', content: 'Supercell lanza un evento especial en Brawl Stars con nuevos personajes y desafíos.', comments: [], image: 'img/BrawlStars.png', author: 'influencer@gaminghub.com' },
    { title: 'Actualización de Brawl Stars', content: 'Nueva temporada en Brawl Stars con brawlers exclusivos y modos de juego emocionantes.', comments: [], image: 'img/BrawlStars.png', author: 'influencer@gaminghub.com' },
    { title: 'Nueva actualización de Minecraft', content: 'Mojang Studios lanza una nueva actualización con biomas, mobs y características innovadoras.', comments: [], image: 'img/Minecraft.png', author: 'influencer@gaminghub.com' }
];

const debates = JSON.parse(localStorage.getItem('gaminghub_debates')) || [
    { title: '¿Clash Royale o Fortnite?', content: '¿Cuál es mejor para batallas rápidas?', comments: [], image: 'img/clash_royale.jpg', author: 'influencer@gaminghub.com' },
    { title: 'Roblox: ¿Juego o plataforma?', content: 'Debate sobre el futuro de los juegos creados por usuarios.', comments: [], image: 'img/roblox.jpg', author: 'influencer@gaminghub.com' },
    { title: '¿Batman: Arkham o Injustice?', content: 'Debate sobre cuál saga de Batman es superior.', comments: [], image: 'img/Batman.png', author: 'influencer@gaminghub.com' },
    { title: '¿Outlast Trials: Terror cooperativo?', content: '¿Es Outlast Trials el mejor juego de horror cooperativo del momento?', comments: [], image: 'img/Outlast.png', author: 'influencer@gaminghub.com' },
    { title: '¿Brawl Stars o Clash Royale?', content: '¿Cuál es mejor para batallas estratégicas?', comments: [], image: 'img/BrawlStars.png', author: 'influencer@gaminghub.com' },
    { title: '¿Brawl Stars: Estrategia o acción?', content: 'Debate sobre si Brawl Stars es más estratégico o de acción pura.', comments: [], image: 'img/BrawlStars.png', author: 'influencer@gaminghub.com' },
    { title: '¿Minecraft: Creatividad o supervivencia?', content: 'Debate sobre si Minecraft es más sobre creatividad o supervivencia.', comments: [], image: 'img/Minecraft.png', author: 'influencer@gaminghub.com' }
];

const games = JSON.parse(localStorage.getItem('gaminghub_games')) || [
    { title: 'Clash Royale', category: 'strategy', description: 'Juego de estrategia en tiempo real.', image: 'img/ClashRoyale.png', author: 'influencer@gaminghub.com' },
    { title: 'Fortnite', category: 'action', description: 'Battle royale con construcción.', image: 'img/Fornite.png', author: 'influencer@gaminghub.com' },
    { title: 'Roblox', category: 'adventure', description: 'Plataforma de juegos creados por usuarios.', image: 'img/Roblox.png', author: 'influencer@gaminghub.com' },
    { title: 'Batman', category: 'action', description: 'Juego de acción y aventura con el Caballero Oscuro.', image: 'img/Batman.png', author: 'influencer@gaminghub.com' },
    { title: 'Outlast Trials', category: 'horror', description: 'Juego de horror cooperativo en primera persona.', image: 'img/Outlast.png', author: 'influencer@gaminghub.com' },
    { title: 'Brawl Stars', category: 'strategy', description: 'Juego de batalla multijugador en tiempo real con personajes únicos.', image: 'img/BrawlStars.png', author: 'influencer@gaminghub.com' },
    { title: 'Minecraft', category: 'adventure', description: 'Juego de construcción y exploración en un mundo abierto.', image: 'img/Minecraft.png', author: 'influencer@gaminghub.com' }
];

function saveNews() {
    localStorage.setItem('gaminghub_news', JSON.stringify(news));
}

function saveDebates() {
    localStorage.setItem('gaminghub_debates', JSON.stringify(debates));
}

function saveGames() {
    localStorage.setItem('gaminghub_games', JSON.stringify(games));
}

function createCommentElement(comment, debateIndex = null, newsIndex = null) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';

    const authorDiv = document.createElement('div');
    authorDiv.className = 'comment-author';
    const profilePic = document.createElement('img');
    profilePic.src = getRoleProfilePic(comment.author);
    profilePic.alt = 'Profile';
    profilePic.className = 'comment-profile-pic';
    authorDiv.appendChild(profilePic);
    const authorName = document.createElement('span');
    authorName.textContent = users[comment.author]?.username || comment.author;
    authorDiv.appendChild(authorName);
    commentDiv.appendChild(authorDiv);

    const textP = document.createElement('p');
    textP.textContent = comment.text;
    commentDiv.appendChild(textP);

    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';
    likeBtn.textContent = `Me gusta (${comment.likes})`;
    if (comment.liked) {
        likeBtn.classList.add('liked');
    }
    likeBtn.onclick = () => {
        if (!comment.liked) {
            comment.likes++;
            comment.liked = true;
            likeBtn.textContent = `Me gusta (${comment.likes})`;
            likeBtn.classList.add('liked');
        }
    };
    commentDiv.appendChild(likeBtn);

    if (currentRole === 'UsuarioBasico') {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.textContent = 'Guardar en Favoritos';
        favoriteBtn.onclick = () => {
            if (!favorites.some(fav => fav.type === 'comment' && fav.id === comment.id)) {
                favorites.push({ type: 'comment', id: comment.id, content: comment.text, author: comment.author });
                saveFavorites();
                alert('Comentario guardado en favoritos');
            } else {
                alert('Ya está en favoritos');
            }
        };
        commentDiv.appendChild(favoriteBtn);
    }

    if (currentRole === 'Moderador' || currentRole === 'Propietario') {
        const warnBtn = document.createElement('button');
        warnBtn.className = 'warn-btn';
        warnBtn.textContent = 'Advertir';
        warnBtn.onclick = () => {
            if (comment.author && users[comment.author]) {
                users[comment.author].warnings = (users[comment.author].warnings || 0) + 1;
                saveUsers();
                if (users[comment.author].warnings >= 3) {
                    alert(`Usuario ${comment.author} ha alcanzado 3 advertencias. Considera acciones adicionales.`);
                } else {
                    alert(`Advertencia enviada a ${comment.author}. Advertencias restantes: ${3 - users[comment.author].warnings}`);
                }
            }
        };
        commentDiv.appendChild(warnBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.onclick = () => {
            if (debateIndex !== null) {
                debates[debateIndex].comments = debates[debateIndex].comments.filter(c => c.id !== comment.id);
                saveDebates();
            } else if (newsIndex !== null) {
                news[newsIndex].comments = news[newsIndex].comments.filter(c => c.id !== comment.id);
                saveNews();
            }
            commentDiv.remove();
        };
        commentDiv.appendChild(deleteBtn);
    }

    return commentDiv;
}

function displayNews() {
    newsList.innerHTML = '';
    news.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'news-item';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        itemDiv.appendChild(img);

        const h3 = document.createElement('h3');
        h3.textContent = item.title;
        itemDiv.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = item.content;
        itemDiv.appendChild(p);

        const authorDiv = document.createElement('div');
        authorDiv.className = 'item-author';
        const profilePic = document.createElement('img');
        profilePic.src = getRoleProfilePic(item.author);
        profilePic.alt = 'Author Profile';
        profilePic.className = 'author-profile-pic';
        authorDiv.appendChild(profilePic);
        const authorName = document.createElement('span');
        authorName.textContent = users[item.author]?.username || item.author;
        authorDiv.appendChild(authorName);
        itemDiv.appendChild(authorDiv);

        const commentsDiv = document.createElement('div');
        commentsDiv.className = 'comments';
        item.comments.forEach(comment => {
            commentsDiv.appendChild(createCommentElement(comment, null, index));
        });

        const commentForm = document.createElement('form');
        commentForm.innerHTML = `
            <input type="text" placeholder="Escribe un comentario..." required>
            <button type="submit">Comentar</button>
        `;
        commentForm.onsubmit = (e) => {
            e.preventDefault();
            const input = commentForm.querySelector('input');
            const comment = {
                id: Date.now(),
                text: input.value,
                author: currentUser,
                likes: 0,
                liked: false
            };
            item.comments.push(comment);
            saveNews();
            commentsDiv.appendChild(createCommentElement(comment, null, index));
            input.value = '';
        };

        itemDiv.appendChild(commentsDiv);
        itemDiv.appendChild(commentForm);
        newsList.appendChild(itemDiv);
    });
}

function displayDebates() {
    debateList.innerHTML = '';
    debates.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'debate-item';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        itemDiv.appendChild(img);

        const h3 = document.createElement('h3');
        h3.textContent = item.title;
        itemDiv.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = item.content;
        itemDiv.appendChild(p);

        const authorDiv = document.createElement('div');
        authorDiv.className = 'item-author';
        const profilePic = document.createElement('img');
        profilePic.src = getRoleProfilePic(item.author);
        profilePic.alt = 'Author Profile';
        profilePic.className = 'author-profile-pic';
        authorDiv.appendChild(profilePic);
        const authorName = document.createElement('span');
        authorName.textContent = users[item.author]?.username || item.author;
        authorDiv.appendChild(authorName);
        itemDiv.appendChild(authorDiv);

        const commentsDiv = document.createElement('div');
        commentsDiv.className = 'comments';
        item.comments.forEach(comment => {
            commentsDiv.appendChild(createCommentElement(comment, index, null));
        });

        const commentForm = document.createElement('form');
        commentForm.innerHTML = `
            <input type="text" placeholder="Escribe un comentario..." required>
            <button type="submit">Comentar</button>
        `;
        commentForm.onsubmit = (e) => {
            e.preventDefault();
            const input = commentForm.querySelector('input');
            const comment = {
                id: Date.now(),
                text: input.value,
                author: currentUser,
                likes: 0,
                liked: false
            };
            item.comments.push(comment);
            saveDebates();
            commentsDiv.appendChild(createCommentElement(comment, index, null));
            input.value = '';
        };

        itemDiv.appendChild(commentsDiv);
        itemDiv.appendChild(commentForm);
        debateList.appendChild(itemDiv);
    });
}

function displayGames() {
    gameGallery.innerHTML = '';
    games.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'game-item';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        itemDiv.appendChild(img);

        const h3 = document.createElement('h3');
        h3.textContent = item.title;
        itemDiv.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = item.description;
        itemDiv.appendChild(p);

        const authorDiv = document.createElement('div');
        authorDiv.className = 'item-author';
        const profilePic = document.createElement('img');
        profilePic.src = getRoleProfilePic(item.author);
        profilePic.alt = 'Author Profile';
        profilePic.className = 'author-profile-pic';
        authorDiv.appendChild(profilePic);
        const authorName = document.createElement('span');
        authorName.textContent = users[item.author]?.username || item.author;
        authorDiv.appendChild(authorName);
        itemDiv.appendChild(authorDiv);

        gameGallery.appendChild(itemDiv);
    });
}

function displayFavorites() {
    favoritesList.innerHTML = '';
    favorites.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'favorite-item';

        const h3 = document.createElement('h3');
        h3.textContent = item.content;
        itemDiv.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = `Por: ${users[item.author]?.username || item.author}`;
        itemDiv.appendChild(p);

        favoritesList.appendChild(itemDiv);
    });
}

function displayPendingRequests() {
    const pendingList = document.getElementById('pending-list');
    if (!pendingList) return;
    pendingList.innerHTML = '';
    pendingRequests.forEach((request, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'pending-item';

        const h3 = document.createElement('h3');
        h3.textContent = `Solicitud de ${request.username} (${request.email})`;
        itemDiv.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = `Motivo: ${request.reason}`;
        itemDiv.appendChild(p);

        const dateP = document.createElement('p');
        dateP.textContent = `Fecha: ${new Date(request.date).toLocaleString()}`;
        itemDiv.appendChild(dateP);

        const approveBtn = document.createElement('button');
        approveBtn.textContent = 'Aprobar';
        approveBtn.onclick = () => {
            // Create user account
            users[request.email] = {
                password: 'moderator123', // Default password
                username: request.username,
                role: 'Moderador',
                warnings: 0,
                profilePic: 'img/Moderador.png'
            };
            saveUsers();
            // Remove from pending
            pendingRequests.splice(index, 1);
            savePending();
            displayPendingRequests();
            alert('Solicitud aprobada. Usuario creado con contraseña "moderator123".');

            // Send email to user
            emailjs.send('your_service_id', 'your_template_id', {
                to_email: request.email,
                subject: 'Solicitud de Moderador Aprobada',
                message: 'Tu solicitud ha sido aprobada. Inicia sesión aquí: https://gaminghub.com con tu email y contraseña moderator123.'
            }).then(() => {
                alert('Email enviado al usuario.');
            }, (error) => {
                console.error('Error sending email:', error);
            });
        };
        itemDiv.appendChild(approveBtn);

        const rejectBtn = document.createElement('button');
        rejectBtn.textContent = 'Rechazar';
        rejectBtn.onclick = () => {
            const comment = prompt('Razón para rechazar la solicitud (opcional):');
            if (comment !== null) {
                // Optionally, store the comment or send email
                pendingRequests.splice(index, 1);
                savePending();
                displayPendingRequests();
                alert('Solicitud rechazada.');

                // Send email to user
                emailjs.send('your_service_id', 'your_template_id', {
                    to_email: request.email,
                    subject: 'Solicitud de Moderador Rechazada',
                    message: `Lo lamento, tu solicitud ha sido rechazada. Razón: ${comment || 'No especificada'}. No podrás ser moderador.`
                }).then(() => {
                    alert('Email enviado al usuario.');
                }, (error) => {
                    console.error('Error sending email:', error);
                });
            }
        };
        itemDiv.appendChild(rejectBtn);

        pendingList.appendChild(itemDiv);
    });
}

function updateUI() {
    displayNews();
    displayDebates();
    displayGames();
    displayFavorites();

    if (currentRole === 'Moderador' || currentRole === 'Propietario') {
        document.getElementById('moderator-section').style.display = 'block';
        displayPendingRequests();
    } else {
        document.getElementById('moderator-section').style.display = 'none';
    }

    if (currentRole === 'Influencer') {
        newsFormContainer.style.display = 'block';
        debateFormContainer.style.display = 'block';
        gameFormContainer.style.display = 'block';
    } else {
        newsFormContainer.style.display = 'none';
        debateFormContainer.style.display = 'none';
        gameFormContainer.style.display = 'none';
    }

    if (currentRole === 'UsuarioBasico') {
        favoritesTab.style.display = 'inline-block';
    } else {
        favoritesTab.style.display = 'none';
    }
}

// Form switching
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    moderatorRequestDiv.style.display = 'none'; // Reset moderator request display
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Role select event listener
registerRoleSelect.addEventListener('change', () => {
    if (registerRoleSelect.value === 'Moderador') {
        moderatorRequestDiv.style.display = 'block';
        registerBtn.textContent = 'Enviar Solicitud';
    } else {
        moderatorRequestDiv.style.display = 'none';
        registerBtn.textContent = 'Crear Cuenta';
    }
});

// Login
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email.includes('@')) {
        loginError.textContent = 'El correo electrónico debe contener @';
        loginError.style.display = 'block';
        return;
    }

    if (users[email] && users[email].password === password) {
        currentUser = email;
        currentRole = users[email].role;
        userRoleSpan.textContent = currentRole;
        loginContainer.style.display = 'none';
        mainContent.style.display = 'block';
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('currentRole', currentRole);
        updateUI();
        document.getElementById('profile-pic').src = users[currentUser].profilePic || getRoleProfilePic(currentUser);
    } else {
        loginError.textContent = 'Credenciales incorrectas';
        loginError.style.display = 'block';
    }
});

// Register
registerBtn.addEventListener('click', () => {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const username = document.getElementById('register-username').value;
    const role = document.getElementById('register-role').value;
    const reason = document.getElementById('moderator-reason').value;

    if (!email || !password || !username) {
        registerError.textContent = 'Por favor completa todos los campos';
        registerError.style.display = 'block';
        return;
    }

    if (!email.includes('@')) {
        registerError.textContent = 'El correo electrónico debe contener @';
        registerError.style.display = 'block';
        return;
    }

    if (role === 'Moderador') {
        if (!reason.trim()) {
            registerError.textContent = 'Por favor describe por qué quieres ser moderador';
            registerError.style.display = 'block';
            return;
        }

        // Store pending request
        pendingRequests.push({ email, username, reason, date: new Date().toISOString() });
        savePending();

        // Show success ticket
        showSuccessTicket('Solicitud en proceso');

        // Send request using Formspree
        const form = document.createElement('form');
        form.action = 'https://formspree.io/f/mvgbnlyj';
        form.method = 'POST';
        form.style.display = 'none';

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.name = 'email';
        emailInput.value = email;
        form.appendChild(emailInput);

        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.name = 'username';
        usernameInput.value = username;
        form.appendChild(usernameInput);

        const reasonInput = document.createElement('textarea');
        reasonInput.name = 'reason';
        reasonInput.value = reason;
        form.appendChild(reasonInput);

        document.body.appendChild(form);
        form.submit();

        // Clear the form fields
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
        document.getElementById('register-username').value = '';
        document.getElementById('moderator-reason').value = '';
        registerRoleSelect.value = 'UsuarioBasico';
        moderatorRequestDiv.style.display = 'none';

        // Do not switch back to login form automatically
        // User stays on the registration form with success message visible

        return;
    }

    // For other roles, create account
    if (users[email]) {
        registerError.textContent = 'El usuario ya existe';
        registerError.style.display = 'block';
        return;
    }

    users[email] = {
        password: password,
        username: username,
        role: role,
        warnings: 0,
        profilePic: `img/${role}.png`
    };

    saveUsers();

    // Show a success ticket
    showSuccessTicket('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');

    // Switch back to login form after 2 seconds
    setTimeout(() => {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        hideSuccessTicket();
    }, 2000);
});

// Success ticket functions
function showSuccessTicket(message) {
    let ticket = document.createElement('div');
    ticket.id = 'success-ticket';
    ticket.textContent = message;
    ticket.style.position = 'fixed';
    ticket.style.top = '20px';
    ticket.style.right = '20px';
    ticket.style.backgroundColor = '#4caf50';
    ticket.style.color = 'white';
    ticket.style.padding = '15px 25px';
    ticket.style.borderRadius = '10px';
    ticket.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
    ticket.style.fontWeight = 'bold';
    ticket.style.zIndex = '1000';
    document.body.appendChild(ticket);
}

function hideSuccessTicket() {
    const ticket = document.getElementById('success-ticket');
    if (ticket) {
        ticket.remove();
    }
}

// Logout
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    currentRole = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRole');
    loginContainer.style.display = 'block';
    mainContent.style.display = 'none';
});

// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');

        // Hide all tab contents immediately
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.opacity = '0';
            content.classList.remove('active');
            content.style.display = 'none';
        });

        // Show new active
        const newActive = document.getElementById(tabName);
        newActive.style.display = 'block';
        setTimeout(() => {
            newActive.classList.add('active');
            newActive.style.opacity = '1';
        }, 10); // Small delay to allow display block

        // Update active button
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        localStorage.setItem('activeTab', tabName);

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Populate profile form if profile tab is opened
        if (tabName === 'profile' && currentUser) {
            document.getElementById('profile-username').value = users[currentUser].username || '';
            document.getElementById('profile-email').value = currentUser;
            document.getElementById('profile-password').value = '';
            document.getElementById('profile-pic').src = users[currentUser].profilePic || getRoleProfilePic(currentUser);
        }
    });
});

// Form submissions
document.getElementById('news-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('news-title').value;
    const content = document.getElementById('news-content').value;
    const imageInput = document.getElementById('news-image');
    const image = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : 'img/default_news.jpg';

    news.push({ title, content, comments: [], image, author: currentUser });
    saveNews();
    updateUI();
    e.target.reset();
});

document.getElementById('debate-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('debate-title').value;
    const content = document.getElementById('debate-content').value;
    const imageInput = document.getElementById('debate-image');
    const image = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : 'img/default_debate.jpg';

    debates.push({ title, content, comments: [], image, author: currentUser });
    saveDebates();
    updateUI();
    e.target.reset();
});

document.getElementById('game-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('game-title').value;
    const category = document.getElementById('game-category').value;
    const description = document.getElementById('game-description').value;
    const imageInput = document.getElementById('game-image');
    const image = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : 'img/default_game.jpg';

    games.push({ title, category, description, image, author: currentUser });
    saveGames();
    updateUI();
    e.target.reset();
});

// Profile picture upload functionality removed

// Profile update form
document.getElementById('profile-update-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('profile-username').value;
    const email = document.getElementById('profile-email').value;
    const password = document.getElementById('profile-password').value;

    if (username) {
        users[currentUser].username = username;
    }
    if (password) {
        users[currentUser].password = password;
    }
    if (email && email !== currentUser) {
        if (users[email]) {
            alert('El correo electrónico ya está en uso');
            return;
        }
        if (!email.includes('@')) {
            alert('El correo electrónico debe contener @');
            return;
        }
        users[email] = users[currentUser];
        delete users[currentUser];
        currentUser = email;
        localStorage.setItem('currentUser', currentUser);
    }
    saveUsers();
    alert('Perfil actualizado exitosamente');
    updateUI();
});

updateUI();
>>>>>>> b94ad4b8aa2cc50b204ae862adcf34baaca5893c
