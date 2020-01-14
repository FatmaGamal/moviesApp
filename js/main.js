var categories = [];

function getMovies() {
    return new Promise((resolve, reject) => {
        let url = 'https://frontend-recruitment-challenge.herokuapp.com/movies';
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            }
        };
    });
}

function postMovie(item) {
    let url = 'https://frontend-recruitment-challenge.herokuapp.com/movies';
    let params = JSON.stringify(item);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(params);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            document.getElementById('update-btn').classList.add('btn-success');
            setTimeout(function () {
                document.getElementById('update-btn').classList.remove('btn-success');
            }, 3000);
            console.log('movie added');
        }
    };
}

function deleteMovie(movieId) {
    let url = `https://frontend-recruitment-challenge.herokuapp.com/movies/${movieId}`;
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            console.log('movie deleted');
            location.reload();
        }
    }
}

function putMovie(movieId, item) {
    let url = `https://frontend-recruitment-challenge.herokuapp.com/movies/${movieId}`;
    let params = JSON.stringify(item);
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(params);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            document.getElementById('update-btn').classList.add('btn-success');
            setTimeout(function () {
                document.getElementById('update-btn').classList.remove('btn-success');
            }, 3000);
            console.log('movie updated');
        }
    };
}

function addMovie() {
    let item = {};
    item.title = document.getElementById('title').value.trim();
    item.budget = Number(document.getElementById('budget').value);
    item.year = Number(document.getElementById('year').value);
    item.category_ids = [];
    let genres = document.querySelectorAll('input[name=genre]:checked');
    for (let i = 0; i < genres.length; i++) {
        item.category_ids.push(Number(genres[i].id));
    }

    getMovies().then(
        (movies) => {
            let sameMovies = movies.filter(movie => movie.title.toLowerCase() == item.title.toLowerCase());
            if (sameMovies.length == 0) {
                postMovie(item);
            } else {
                console.log('movie already exists in database');
            }
        }
    );
}

function editMovieById(movieId) {
    let url = `https://frontend-recruitment-challenge.herokuapp.com/movies/${movieId}`;
    let movie = {};
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            movie = JSON.parse(xhr.responseText);
            document.getElementById('title').value = movie.title;
            document.getElementById('budget').value = movie.budget;
            document.getElementById('year').value = movie.year;
            let genres = movie.category_ids;
            for (let i = 0; i < genres.length; i++) {
                document.getElementById(`${genres[i]}`).checked = true;
            }
        }
    };
}

function updateMovie(movieId) {
    let item = {};
    item.title = document.getElementById('title').value;
    item.budget = Number(document.getElementById('budget').value);
    item.year = Number(document.getElementById('year').value);
    item.category_ids = [];
    let genres = document.querySelectorAll('input[name=genre]:checked');
    for (let i = 0; i < genres.length; i++) {
        item.category_ids.push(Number(genres[i].id));
    }
    putMovie(movieId, item);
}

function updateMoviesList() {
    if (urlParams.has('type')) {
        let type = urlParams.get('type');
        if (type == 'edit') {
            updateMovie(urlParams.get('id'));
        } else if (type == 'add') {
            addMovie();
        }
    }
}

function getCategories() {
    return new Promise((resolve, reject) => {
        let url = `https://frontend-recruitment-challenge.herokuapp.com/categories`;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                let genres = JSON.parse(xhr.responseText);
                for (let i = 0; i < genres.length; i++) {
                    categories[genres[i].id] = genres[i].title
                }
                resolve(JSON.parse(xhr.responseText));
            }
        };
    });
}

function showCategories() {
    getCategories().then(
        (genres) => {
            for (let i = 0; i < genres.length; i++) {
                let genre = document.createElement('div');
                genre.className = 'form-check form-check-inline';
                genre.innerHTML = `<input class='form-check-input' type='checkbox' id='${genres[i].id}' value='genre-${genres[i].title}' name='genre'>
                    <label class='form-check-label' for='${genres[i].id}'>${genres[i].title}</label>`;
                document.getElementById('movies-genres').append(genre);
            }
        }
    );
}

function showMovies() {
    // Heroku
    getMovies().then(
        (movies) => {
            for (let i = 0; i < movies.length; i++) {
                let card = document.createElement('div');
                let genres = mapCategories(movies[i].category_ids);
                card.className = 'col-sm-6 col-md-4 col-lg-3';
                card.innerHTML = `<div class='movie-card' id='${movies[i].id}'>
                                    <div class='movie-info'>
                                        <div class='movie-title'>${movies[i].title}</div>
                                        <div class='movie-budget'>${movies[i].budget}</div>
                                        <div class='movie-year'>${movies[i].year}</div>
                                        <div class='movie-genre'>${genres}</div>
                                    </div>
                                    <div class='row'>
                                    <div class='col movie-actions'>
                                        <a href='add.html?type=edit&id=${movies[i].id}' class='btn btn-sec btn-circle'><i class='btn-icon btn-icon-edit'></i></a>
                                        <button type='button' class='btn btn-hidden btn-circle' onclick='deleteMovie(${movies[i].id})'><i class='btn-icon btn-icon-delete'></i></button>
                                    </div>
                                    </div>
                                </div>`;
                document.getElementById('movies-container').append(card);
            }
        }
    );
}

function mapCategories(genres) {
    let genresTitles = '';
    for (let i = 0; i < genres.length; i++) {
        genresTitles += `${categories[genres[i]]} `.toString();
    }
    return genresTitles;
}

window.onload = function (e) {
    urlParams = new URLSearchParams(location.search);
    getCategories();
    if (document.getElementById('movies-container') !== null) {
        showMovies();
    } else {
        showCategories();
        document.getElementById('update-btn').addEventListener('click', updateMoviesList);
    }
    if (urlParams.has('type')) {
        let type = urlParams.get('type');
        if (type == 'edit') {
            editMovieById(urlParams.get('id'));
        }
    }
}