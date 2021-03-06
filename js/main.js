function addMovie() {
    let item = {};
    item.title = document.getElementById('title').value.trim();
    item.budget = Number(document.getElementById('budget').value);
    item.year = Number(document.getElementById('year').value);
    let movies = localStorage.getItem('movies');
    movies = movies ? JSON.parse(movies) : [];

    let sameMovies = movies.filter(movie => movie.title == item.title);
    if (sameMovies.length == 0) {
        movies.push(item);
        localStorage.setItem('movies', JSON.stringify(movies));

        document.getElementById('update-btn').classList.add('btn-success');
        setTimeout(function () {
            document.getElementById('update-btn').classList.remove('btn-success');
        }, 2000);
    } else {
        console.log('movie already exists in database');
    }
}

function updateMoviesList() {
    if (validateForm()) {
        if (!document.getElementById('error-text').classList.contains('d-none')) {
            document.getElementById('error-text').classList.add('d-none');
        }
        addMovie();
    } else {
        if (document.getElementById('error-text').classList.contains('d-none')) {
            document.getElementById('error-text').classList.remove('d-none');
        }
    }
}

function showMovies() {
    let movies = JSON.parse(localStorage.getItem('movies'));
    for (let i = 0; i < movies.length; i++) {
        let card = document.createElement('div');
        card.className = 'col-sm-6 col-md-4 col-lg-3';
        card.innerHTML = `<div class='movie-card'>
                                    <div class='movie-info'>
                                        <div class='movie-title'>${movies[i].title}</div>
                                        <div class='movie-budget'>${movies[i].budget}</div>
                                        <div class='movie-year'>${movies[i].year}</div>
                                    </div>
                                </div>`;
        document.getElementById('movies-container').append(card);
    }
}

function validateForm() {
    let year = document.getElementById('year').value;
    let budget = document.getElementById('budget').value;

    let yearRgex = /^\d{4}$/g;
    let budgetRgex = /(?!^0*$)(?!^0*\.0*$)^\d{1,18}(\.\d{1,5})+$/g;

    let yearResult = yearRgex.test(year);
    let budgetResult = budgetRgex.test(budget);
    return yearResult && budgetResult;
}

window.onload = function (e) {
    if (document.getElementById('movies-container') !== null) {
        showMovies();
    } else {
        document.getElementById('update-btn').addEventListener('click', updateMoviesList);
    }
}

