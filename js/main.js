

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
    'basic@gaminghub.com': { password: 'pass', role: 'UsuarioBasico', warnings: 0, profilePic: 'img/UsuarioBasico.png', username: 'UsuarioBasico', bannedUntil: 0, banCount: 0 },
    'influencer@gaminghub.com': { password: 'pass', role: 'Influencer', warnings: 0, profilePic: 'img/Influ.png', username: 'Influencer', bannedUntil: 0, banCount: 0 },
    'moderator@gaminghub.com': { password: 'pass', role: 'Moderador', warnings: 0, profilePic: 'img/Moderador.png', username: 'Moderador', bannedUntil: 0, banCount: 0 },
    'tomasgarrido512@gmail.com': { password: '12345', role: 'Propietario', warnings: 0, profilePic: 'img/Propietario.png', username: 'Propietario', bannedUntil: 0, banCount: 0 }
};


users['tomasgarrido512@gmail.com'] = { password: '12345', role: 'Propietario', warnings: 0, profilePic: 'img/Propietario.png', username: 'Propietario', bannedUntil: 0, banCount: 0 };

let favorites = JSON.parse(localStorage.getItem('gaminghub_favorites')) || [];

let cart = JSON.parse(localStorage.getItem('gaminghub_cart')) || [];

let pendingRequests = JSON.parse(localStorage.getItem('gaminghub_pending')) || [];



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

function saveCart() {
    localStorage.setItem('gaminghub_cart', JSON.stringify(cart));
}

function addToCart(game) {
    cart.push(game);
    saveCart();
    showSuccessTicket('Juego agregado al carrito');
    setTimeout(() => hideSuccessTicket(), 3000);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    displayCart();
}

function displayCart() {
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <h3>${item.title}</h3>
            <p>Precio: $${item.price.toFixed(2)}</p>
            <button onclick="removeFromCart(${index})">Remover</button>
        `;
        cartList.appendChild(itemDiv);
        total += item.price;
    });
    cartTotal.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
}

// Checkout button functionality
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('El carrito está vacío. Agrega juegos antes de proceder al pago.');
        return;
    }
    let message = 'Gracias por tu compra! Has comprado:\n\n';
    cart.forEach(item => {
        message += `- ${item.title} - $${item.price.toFixed(2)}\n`;
    });
    message += `\nTotal: $${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}`;
    alert(message);
    cart.length = 0; 
    saveCart();
    displayCart();
});

function getRoleProfilePic(userEmail) {
    if (!userEmail || !users[userEmail]) {
        return 'img/UsuarioBasico.png';
    }
    const role = users[userEmail].role;
    switch (role) {
        case 'Influencer':
            return 'img/Influ.png';
        case 'Moderador':
            return 'img/Moderador.png';
        case 'Propietario':
            return 'img/Propietario.png';
        case 'UsuarioBasico':
        default:
            return 'img/UsuarioBasico.png';
    }
}

// Ensure profile pic updates on login and page load for Influencer role
window.addEventListener('load', () => {
    if (currentUser && users[currentUser]) {
        const profilePicElement = document.getElementById('profile-pic');
        if (profilePicElement) {
            profilePicElement.src = getRoleProfilePic(currentUser);
        }
    }
});

loginBtn.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email.includes('@')) {
        loginError.textContent = 'El correo electrónico debe contener @';
        loginError.style.display = 'block';
        return;
    }

    if (users[email] && users[email].password === password) {
        // Guardar información del usuario
        currentUser = email;
        currentRole = users[email].role;
        const nombreUsuario = users[email].username;

        // Guardar sesión en localStorage
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('currentRole', currentRole);
        localStorage.setItem('token', 'local-session-token');

        // Actualizar UI
        userRoleSpan.textContent = currentRole;
        loginContainer.style.display = 'none';
        mainContent.style.display = 'block';

        // Mostrar mensaje de éxito
        // Swal.fire({
        //     title: '¡Bienvenido a GamingHub! 🎮',
        //     html: `Inicio de sesión exitoso para usuario: <strong style="color:#2196F3;">${nombreUsuario}</strong>`,
        //     icon: 'success',
        //     confirmButtonText: '¡Vamos allá!',
        //     confirmButtonColor: '#2196F3',
        //     background: '#1e1e2f',
        //     color: '#ffffff',
        //     backdrop: `
        //         rgba(0,0,123,0.4)
        //         url("https://media.tenor.com/4yEuW6bbRo0AAAAC/gato.gif")
        //         left top
        //         no-repeat
        //     `
        // });

        // Actualizar interfaz
        updateUI();
        const profilePicElement = document.getElementById('profile-pic');
        if (profilePicElement) {
            profilePicElement.src = getRoleProfilePic(currentUser);
        }
    } else {
        loginError.textContent = 'Credenciales incorrectas o usuario no encontrado';
        loginError.style.display = 'block';
    }
});

window.addEventListener('load', async () => {
    let updated = false;
    for (const email in users) {
        if (users[email].role === 'Influencer' && users[email].profilePic !== 'img/Influ.png') {
            users[email].profilePic = 'img/Influ.png';
            updated = true;
        }
        if (users[email].bannedUntil === undefined) {
            users[email].bannedUntil = 0;
            updated = true;
        }
        if (users[email].banCount === undefined) {
            users[email].banCount = 0;
            updated = true;
        }
        if (typeof users[email].warnings === 'number') {
            users[email].warnings = Array(users[email].warnings).fill({comment: '', timestamp: Date.now(), read: true});
            updated = true;
        } else if (!Array.isArray(users[email].warnings)) {
            users[email].warnings = [];
            updated = true;
        }
    }
    if (updated) {
        saveUsers();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const email = urlParams.get('email');
    const username = urlParams.get('username');

    if (action && email && username) {
        if (action === 'approve' && (currentRole === 'Moderador' || currentRole === 'Propietario')) {
            const index = pendingRequests.findIndex(req => req.email === email && req.username === username);
            if (index !== -1) {
            users[email] = {
                password: 'moderator123',
                username: username,
                role: 'Moderador',
                warnings: 0,
                profilePic: 'img/Moderador.png',
                bannedUntil: 0,
                banCount: 0
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
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedRole && savedToken) {
        if (users[savedUser]) {
            if (users[savedUser].bannedUntil && users[savedUser].bannedUntil > Date.now()) {
                loginContainer.style.display = 'none';
                mainContent.style.display = 'none';
                const banScreen = document.getElementById('ban-screen');
                banScreen.style.display = 'flex';
                const remaining = Math.ceil((users[savedUser].bannedUntil - Date.now()) / (60 * 1000));
                banScreen.querySelector('p').textContent = `¡Estás baneado! Regresa en ${remaining} minutos.`;
                const checkUnban = setInterval(() => {
                    if (Date.now() > users[savedUser].bannedUntil) {
                        clearInterval(checkUnban);
                        banScreen.style.display = 'none';
                        currentUser = savedUser;
                        currentRole = savedRole;
                        userRoleSpan.textContent = currentRole;
                        loginContainer.style.display = 'none';
                        mainContent.style.display = 'block';
                        updateUI();
                        document.getElementById('profile-pic').src = users[currentUser].profilePic || getRoleProfilePic(currentUser);
                    } else {
                        const newRemaining = Math.ceil((users[savedUser].bannedUntil - Date.now()) / (60 * 1000));
                        banScreen.querySelector('p').textContent = `¡Estás baneado! Regresa en ${newRemaining} minutos.`;
                    }
                }, 10000);
                return;
            }

            currentUser = savedUser;
            currentRole = savedRole;
            userRoleSpan.textContent = currentRole;
            loginContainer.style.display = 'none';
            mainContent.style.display = 'block';
            updateUI();
            document.getElementById('profile-pic').src = users[currentUser].profilePic || getRoleProfilePic(currentUser);
        } else {
            // Usuario no existe en localStorage, limpiar
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentRole');
            localStorage.removeItem('token');
        }

        // Hide inactive tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            if (!content.classList.contains('active')) {
                content.style.display = 'none';
                content.style.opacity = '0';
            }
        });

        const savedTab = localStorage.getItem('activeTab') || 'profile';
        document.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === savedTab) {
                content.classList.add('active');
                content.style.display = 'block';
                content.style.opacity = '1';
                if (savedTab === 'reports') {
                    content.style.transform = 'translateX(0)';
                    content.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
                }
            } else {
                content.classList.remove('active');
                content.style.display = 'none';
                content.style.opacity = '0';
                if (content.id === 'reports') {
                    content.style.transform = 'translateX(100%)';
                }
            }
        });
        document.querySelectorAll('.tab-button').forEach(btn => {
            if (btn.getAttribute('data-tab') === savedTab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (savedTab === 'profile' && currentUser) {
            document.getElementById('profile-username').value = users[currentUser].username || '';
            document.getElementById('profile-email').value = currentUser;
            document.getElementById('profile-password').value = '';
            document.getElementById('profile-pic').src = users[currentUser].profilePic || getRoleProfilePic(currentUser);
        }

        const savedScroll = localStorage.getItem('scrollPosition');
        if (savedScroll) {
            window.scrollTo(0, parseInt(savedScroll));
        }
    }

    const activeForm = localStorage.getItem('activeForm') || 'login';
    if (activeForm === 'register') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        moderatorRequestDiv.style.display = 'none';
    } else {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    }
});

const news = JSON.parse(localStorage.getItem('gaminghub_news')) || [
    { title: 'Nueva temporada de Clash Royale', content: 'Supercell lanza la temporada de invierno con nuevas cartas y desafíos.', comments: [], image: 'img/ClashRoyale.png', author: 'influencer@gaminghub.com' },
    { title: 'Actualización épica de Fortnite', content: 'Capítulo 5 trae mapas nuevos y colaboraciones con Roblox.', comments: [], image: 'img/Fornite.png', author: 'influencer@gaminghub.com' },
    { title: 'Eventos especiales en Roblox', content: 'Fiestas temáticas y premios exclusivos para los jugadores.', comments: [], image: 'img/Roblox.png', author: 'influencer@gaminghub.com' },
    { title: 'Nuevo juego de Batman anunciado', content: 'DC Comics revela el próximo título de Batman con gráficos revolucionarios.', comments: [], image: 'img/Batman.png', author: 'influencer@gaminghub.com' },
    { title: 'Outlast Trials: Nuevo horror cooperativo', content: 'Red Barrels lanza Outlast Trials, un juego de horror en primera persona con modo cooperativo.', comments: [], image: 'img/Outlast.png', author: 'influencer@gaminghub.com' },
    { title: 'Nuevo evento en Brawl Stars', content: 'Supercell lanza un evento especial en Brawl Stars con nuevos personajes y desafíos.', comments: [], image: 'img/BrawlStars.png', author: 'influencer@gaminghub.com' },
    { title: 'Nueva actualización de Minecraft', content: 'Mojang Studios lanza una nueva actualización con biomas, mobs y características innovadoras.', comments: [], image: 'img/Minecraft.png', author: 'influencer@gaminghub.com' }
];

const debates = JSON.parse(localStorage.getItem('gaminghub_debates')) || [
    { title: '¿Clash Royale o Fortnite?', content: '¿Cuál es mejor para batallas rápidas?', comments: [], image: 'img/Emote.png', author: 'influencer@gaminghub.com' },
    { title: 'Roblox: ¿Juego o plataforma?', content: 'Debate sobre el futuro de los juegos creados por usuarios.', comments: [], image: 'img/Roblox2.png', author: 'influencer@gaminghub.com' },
    { title: '¿Batman: Arkham o Injustice?', content: 'Debate sobre cuál saga de Batman es superior.', comments: [], image: 'img/Batman2.png', author: 'influencer@gaminghub.com' },
    { title: '¿Outlast Trials: Terror cooperativo?', content: '¿Es Outlast Trials el mejor juego de horror cooperativo del momento?', comments: [], image: 'img/Outlast2.png', author: 'influencer@gaminghub.com' },
    { title: '¿Brawl Stars o Clash Royale?', content: '¿Cuál es mejor para batallas estratégicas?', comments: [], image: 'img/BrawlStars2.png', author: 'influencer@gaminghub.com' },
    { title: '¿Minecraft: Creatividad o supervivencia?', content: 'Debate sobre si Minecraft es más sobre creatividad o supervivencia.', comments: [], image: 'img/Minecraft2.png', author: 'influencer@gaminghub.com' }
];

const games = JSON.parse(localStorage.getItem('gaminghub_games')) || [
    { title: 'Clash Royale', category: 'strategy', description: 'Juego de estrategia en tiempo real.', image: 'img/ClashRoyale3.png', author: 'influencer@gaminghub.com', price: 0 },
    { title: 'Fortnite', category: 'action', description: 'Battle royale con construcción.', image: 'img/Fornite3.png', author: 'influencer@gaminghub.com', price: 0 },
    { title: 'Roblox', category: 'adventure', description: 'Plataforma de juegos creados por usuarios.', image: 'img/Roblox3.png', author: 'influencer@gaminghub.com', price: 0 },
    { title: 'Batman', category: 'action', description: 'Juego de acción y aventura con el Caballero Oscuro.', image: 'img/Batman3.png', author: 'influencer@gaminghub.com', price: 29.99 },
    { title: 'Outlast Trials', category: 'horror', description: 'Juego de horror cooperativo en primera persona.', image: 'img/Outlast3.png', author: 'influencer@gaminghub.com', price: 19.99 },
    { title: 'Brawl Stars', category: 'strategy', description: 'Juego de batalla multijugador en tiempo real con personajes únicos.', image: 'img/BrawlStars3.png', author: 'influencer@gaminghub.com', price: 0 },
    { title: 'Minecraft', category: 'adventure', description: 'Juego de construcción y exploración en un mundo abierto.', image: 'img/Minecraft3.png', author: 'influencer@gaminghub.com', price: 26.95 }
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
        showSuccessTicket('Comentario guardado en favoritos');
        setTimeout(() => {
            hideSuccessTicket();
        }, 3000);
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
                const commentText = prompt('Comentario para la advertencia (opcional):');
                const warning = {
                    comment: commentText || '',
                    timestamp: Date.now(),
                    read: false
                };
                users[comment.author].warnings.push(warning);
                const warningCount = users[comment.author].warnings.length;
        if (warningCount >= 3) {
            users[comment.author].banCount = (users[comment.author].banCount || 0) + 1;
            users[comment.author].warnings = []; 
            if (users[comment.author].banCount === 1) {
                users[comment.author].bannedUntil = Date.now() + 10 * 60 * 1000; // 10 minutes
            } else if (users[comment.author].banCount === 2) {
                users[comment.author].bannedUntil = Date.now() + 60 * 60 * 1000; // 1 hour
            } else {
                users[comment.author].bannedUntil = Date.now() + 24 * 60 * 60 * 1000; // 1 day
            }

            const reportsSection = document.getElementById('reports');
            if (reportsSection) {
                reportsSection.style.display = 'block';
                reportsSection.style.opacity = '0';
                setTimeout(() => {
                    reportsSection.style.opacity = '1';
                }, 10);
            }

            alert(`Usuario ${comment.author} ha alcanzado 3 advertencias. Baneado por ${users[comment.author].banCount === 1 ? '10 minutos' : users[comment.author].banCount === 2 ? '1 hora' : '1 día'}. Las advertencias han sido reiniciadas.`);
        } else {
            alert(`Advertencia enviada a ${comment.author}. Total de advertencias: ${warningCount}`);
        }
        saveUsers();
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

async function displayNews() {
    try {
        const newsData = await NewsAPI.getAllNews();
        newsList.innerHTML = '';
        newsData.forEach((item, index) => {
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

            itemDiv.appendChild(commentsDiv);
            if (currentRole === 'Moderador' || currentRole === 'Propietario') {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Eliminar Publicación';
                deleteBtn.onclick = () => {
                    const reason = prompt('Razón para eliminar la publicación:');
                    if (reason !== null) {
                        if (item.author && users[item.author]) {
                            const warning = {
                                comment: `Tu publicación "${item.title}" fue eliminada por: ${reason}`,
                                timestamp: Date.now(),
                                read: false
                            };
                            users[item.author].warnings.push(warning);
                            saveUsers();
                        }
                        news.splice(index, 1);
                        saveNews();
                        updateUI();
                    }
                };
                itemDiv.appendChild(deleteBtn);
            }
            if (currentRole !== 'Propietario') {
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
                itemDiv.appendChild(commentForm);
            }
            newsList.appendChild(itemDiv);
        });
    } catch (error) {
        // Fallback to localStorage
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

            itemDiv.appendChild(commentsDiv);
            if (currentRole === 'Moderador' || currentRole === 'Propietario') {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Eliminar Publicación';
                deleteBtn.onclick = () => {
                    const reason = prompt('Razón para eliminar la publicación:');
                    if (reason !== null) {
                        if (item.author && users[item.author]) {
                            const warning = {
                                comment: `Tu publicación "${item.title}" fue eliminada por: ${reason}`,
                                timestamp: Date.now(),
                                read: false
                            };
                            users[item.author].warnings.push(warning);
                            saveUsers();
                        }
                        news.splice(index, 1);
                        saveNews();
                        updateUI();
                    }
                };
                itemDiv.appendChild(deleteBtn);
            }
            if (currentRole !== 'Propietario') {
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
                itemDiv.appendChild(commentForm);
            }
            newsList.appendChild(itemDiv);
        });
    }
}

async function displayDebates() {
    try {
        const debatesData = await DebateAPI.getAllDebates();
        debateList.innerHTML = '';
        debatesData.forEach((item, index) => {
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

            itemDiv.appendChild(commentsDiv);
            if (currentRole === 'Moderador' || currentRole === 'Propietario') {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Eliminar Publicación';
                deleteBtn.onclick = () => {
                    const reason = prompt('Razón para eliminar la publicación:');
                    if (reason !== null) {
                        if (item.author && users[item.author]) {
                            const warning = {
                                comment: `Tu publicación "${item.title}" fue eliminada por: ${reason}`,
                                timestamp: Date.now(),
                                read: false
                            };
                            users[item.author].warnings.push(warning);
                            saveUsers();
                        }
                        debates.splice(index, 1);
                        saveDebates();
                        updateUI();
                    }
                };
                itemDiv.appendChild(deleteBtn);
            }
            if (currentRole !== 'Propietario') {
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
                itemDiv.appendChild(commentForm);
            }
            debateList.appendChild(itemDiv);
        });
    } catch (error) {
        // Fallback to localStorage
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

            itemDiv.appendChild(commentsDiv);
            if (currentRole === 'Moderador' || currentRole === 'Propietario') {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Eliminar Publicación';
                deleteBtn.onclick = () => {
                    const reason = prompt('Razón para eliminar la publicación:');
                    if (reason !== null) {
                        if (item.author && users[item.author]) {
                            const warning = {
                                comment: `Tu publicación "${item.title}" fue eliminada por: ${reason}`,
                                timestamp: Date.now(),
                                read: false
                            };
                            users[item.author].warnings.push(warning);
                            saveUsers();
                        }
                        debates.splice(index, 1);
                        saveDebates();
                        updateUI();
                    }
                };
                itemDiv.appendChild(deleteBtn);
            }
            if (currentRole !== 'Propietario') {
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
                itemDiv.appendChild(commentForm);
            }
            debateList.appendChild(itemDiv);
        });
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

        const priceP = document.createElement('p');
        priceP.textContent = item.price > 0 ? `Precio: $${item.price.toFixed(2)}` : 'Gratis';
        itemDiv.appendChild(priceP);

        const addBtn = document.createElement('button');
        addBtn.textContent = 'Agregar al Carrito';
        addBtn.onclick = () => addToCart(item);
        itemDiv.appendChild(addBtn);

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

    // Add message div at the bottom
    let messageDiv = document.getElementById('favorites-message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'favorites-message';
        messageDiv.style.marginTop = '20px';
        messageDiv.style.padding = '10px';
        messageDiv.style.backgroundColor = '#4caf50';
        messageDiv.style.color = 'white';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.fontWeight = 'bold';
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'opacity 0.5s ease-in-out';
        messageDiv.style.display = 'none';
        favoritesList.appendChild(messageDiv);
    }
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
            if (currentRole !== 'Propietario') {
                alert('Solo el propietario puede aprobar solicitudes de moderador.');
                return;
            }
            if (users[request.email]) {
                // Update existing user to Moderator
                users[request.email].role = 'Moderador';
                users[request.email].warnings = [];
                users[request.email].profilePic = 'img/Moderador.png';
                users[request.email].bannedUntil = 0;
                users[request.email].banCount = 0;
                saveUsers();
                alert('Solicitud aprobada. Usuario actualizado a Moderador.');
            } else {
                // Create new user account
                users[request.email] = {
                    password: 'moderator123', // Default password
                    username: request.username,
                    role: 'Moderador',
                    warnings: [],
                    profilePic: 'img/Moderador.png',
                    bannedUntil: 0,
                    banCount: 0
                };
                saveUsers();
                alert('Solicitud aprobada. Usuario creado con contraseña "moderator123".');
            }
            // Remove from pending
            pendingRequests.splice(index, 1);
            savePending();
            displayPendingRequests();
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

function showWarningToast(message) {
    let toast = document.getElementById('warning-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'warning-toast';
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.left = '20px';
        toast.style.background = 'linear-gradient(135deg, #ff0844, #ff4b2b)';
        toast.style.color = 'white';
        toast.style.padding = '25px';
        toast.style.borderRadius = '20px';
        toast.style.boxShadow = '0 6px 15px rgba(0,0,0,0.25)';
        toast.style.fontWeight = 'bold';
        toast.style.zIndex = '1000';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-100%)';
        toast.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
        toast.style.maxWidth = '300px';
        toast.style.textAlign = 'center';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500);
    }, 5000); // Show for 5 seconds
}

function displayWarningNotifications() {
    if (currentUser && users[currentUser] && users[currentUser].warnings) {
        const unreadWarnings = users[currentUser].warnings.filter(w => !w.read);
        if (unreadWarnings.length > 0) {
            let message = `Tienes ${unreadWarnings.length} advertencia(s) nueva(s):\n\n`;
            unreadWarnings.forEach((warning, index) => {
                message += `${index + 1}. ${warning.comment || 'Sin comentario'}\nFecha: ${new Date(warning.timestamp).toLocaleString()}\n\n`;
            });
            showWarningToast(message);
            // Mark as read
            unreadWarnings.forEach(w => w.read = true);
            saveUsers();
        }
    }
}

async function updateUI() {
    await displayNews();
    await displayDebates();
    displayGames();
    displayCart();
    displayFavorites();
    displayWarningNotifications();

if (currentRole === 'Propietario') {
    document.getElementById('moderation-tab').style.display = 'inline-block';
    displayPendingRequests();
} else {
    document.getElementById('moderation-tab').style.display = 'none';
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
    localStorage.setItem('activeForm', 'register');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    localStorage.setItem('activeForm', 'login');
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

    // Verificar credenciales localmente
    if (users[email] && users[email].password === password) {
        // Check if banned
        if (users[email].bannedUntil && users[email].bannedUntil > Date.now()) {
            loginContainer.style.display = 'none';
            mainContent.style.display = 'none';
            const banScreen = document.getElementById('ban-screen');
            banScreen.style.display = 'flex';
            const remaining = Math.ceil((users[email].bannedUntil - Date.now()) / (60 * 1000));
            banScreen.querySelector('p').textContent = `¡Estás baneado! Regresa en ${remaining} minutos.`;
            // Check every 10 seconds if ban time passed
            const checkUnban = setInterval(() => {
                if (Date.now() > users[email].bannedUntil) {
                    clearInterval(checkUnban);
                    banScreen.style.display = 'none';
                    // Do not log in automatically, user needs to try again
                } else {
                    const newRemaining = Math.ceil((users[email].bannedUntil - Date.now()) / (60 * 1000));
                    banScreen.querySelector('p').textContent = `¡Estás baneado! Regresa en ${newRemaining} minutos.`;
                }
            }, 10000);
            return;
        }

        // Guardar información del usuario
        currentUser = email;
        currentRole = users[email].role;
        const nombreUsuario = users[email].username;

        // Guardar sesión en localStorage
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('currentRole', currentRole);
        localStorage.setItem('token', 'local-session-token');

        // Actualizar UI
        userRoleSpan.textContent = currentRole;
        loginContainer.style.display = 'none';
        mainContent.style.display = 'block';

        // Mostrar mensaje de éxito
        Swal.fire({
            title: '¡Bienvenido a GamingHub! 🎮',
            html: `<strong style="color:#2196F3;">${nombreUsuario}</strong>, tu inicio de sesión fue exitoso.`,
            icon: 'success',
            confirmButtonText: '¡Vamos allá!',
            confirmButtonColor: '#2196F3',
            background: '#1e1e2f',
            color: '#ffffff',
            backdrop: `
                rgba(0,0,123,0.4)
                url("")
                left top
                no-repeat
            `
        });

        // Actualizar interfaz
        updateUI();
        document.getElementById('profile-pic').src = getRoleProfilePic(currentUser);
    } else {
        loginError.textContent = 'Credenciales incorrectas o usuario no encontrado';
        loginError.style.display = 'block';
    }
});

// Register
registerBtn.addEventListener('click', async () => {
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

    // For other roles, create account locally
    if (users[email]) {
        registerError.textContent = 'El correo electrónico ya está registrado';
        registerError.style.display = 'block';
        return;
    }

    // Create user account locally
    users[email] = {
        password: password,
        username: username,
        role: role,
        warnings: 0,
        profilePic: getRoleProfilePic(email),
        bannedUntil: 0,
        banCount: 0
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

/* Success ticket functions with animation */
function showSuccessTicket(message) {
    let ticket = document.getElementById('success-ticket');
    if (!ticket) {
        ticket = document.createElement('div');
        ticket.id = 'success-ticket';
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
        ticket.style.opacity = '0';
        ticket.style.transition = 'opacity 0.5s ease-in-out';
        document.body.appendChild(ticket);
    }
    ticket.textContent = message;
    ticket.style.opacity = '1';
}

function hideSuccessTicket() {
    const ticket = document.getElementById('success-ticket');
    if (ticket) {
        ticket.style.opacity = '0';
        setTimeout(() => {
            if (ticket.parentNode) {
                ticket.parentNode.removeChild(ticket);
            }
        }, 500);
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
        let tabName = button.getAttribute('data-tab');
        const currentActive = document.querySelector('.tab-button.active')?.getAttribute('data-tab') || 'profile';

        // Toggle for reports: if reports is active and clicked again, switch to previous tab
        if (tabName === 'reports' && currentActive === 'reports') {
            tabName = localStorage.getItem('previousTab') || 'profile';
        } else if (tabName === 'reports') {
            localStorage.setItem('previousTab', currentActive);
        }

        // Hide all tab contents immediately
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.opacity = '0';
            content.classList.remove('active');
            content.style.display = 'none';
            if (content.id === 'reports') {
                content.style.transform = 'translateX(100%)';
            }
        });

        // Show new active
        const newActive = document.getElementById(tabName);
        newActive.style.display = 'block';
        if (tabName === 'reports') {
            newActive.style.transform = 'translateX(100%)';
            newActive.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
        }
        setTimeout(() => {
            newActive.classList.add('active');
            newActive.style.opacity = '1';
            if (tabName === 'reports') {
                newActive.style.transform = 'translateX(0)';
            }
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

    games.push({ title, category, description, image, author: currentUser, price: 0 });
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
