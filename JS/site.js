const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMzRlZDk2NDZhNWM3ZmMyNDJiNjNhZmJlODExYmM0NyIsInN1YiI6IjY1MmVlMTkwY2FlZjJkMDEzOWRmODhkMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WGNhGof0ZFWq4-TnDhum-SsNCEuOIUeUBgOWIO12f94"

//get the information from the API of the site
async function getMovies() { //<-- 'async' gives the function time to wait for the information to be sent back from the 'fetch'
    try { // try/catch is similar to if/else, but for code we don't write ourselves and errors we can't predict
        let response = await fetch('https://api.themoviedb.org/3/movie/popular', {  //<-- the url from the API reference section of 'Popular'
            headers: {
                'Authorization': `Bearer ${API_KEY}` //<--gives the API key to the fetch so that it has permissions to call on the information from the site
            }
        });

        let data = await response.json(); //<-- get the data back from the site, hopefully coming in a json format; the .json() makes the information an object, not just a string

        return data;
    } catch (error) {    //<--secondary function as an alternative to the 'try' in case something goes wrong or is bugged from the code sent by fetching the data from the site
        console.error(error);
    }
}

//get the information (movies) and display them on the page
async function displayMovies() {
    let data = await getMovies(); //<--wait on the fetch to get the information from the previous function

    const movieListDiv = document.getElementById('movie-list');
    //^^^const is much like 'let', only it creates a constant variable that never changes, whereas 'let' allows you to change the element
    const moviePosterTemplate = document.getElementById('movie-card-template');

    let movies = data.results; //<--renames the data for future use in the function and allows you do grab the 'results' property information from your data response in the json() file

    for (let i = 0; i < movies.length; i++) {

        let movie = movies[i]; //<--pulling the movie out of the array
        //^^^ you can look further into an object with more specifics, e.g.--- movie.genre-ads[0, 1, ...], as shown in the code below

        let movieCard = moviePosterTemplate.content.cloneNode(true); //<-- copies the content in the template

        let movieImgElement = movieCard.querySelector('.card-img-top'); //<--targets the image in the card within the copy of the template
        movieImgElement.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`; //<-- changes the src attribute to the path of the poster for this movie

        let movieTitleElement = movieCard.querySelector('.card-body > h5'); //<--targets the h5 element within the card-body
        movieTitleElement.textContent = movie.title;  //<--changes the text content of the card-body element to the text within the 'title' element within the movie attribute

        let movieParagraphElement = movieCard.querySelector('.card-text'); //<--targets the summary of the movie to put it in the 'card-text' element
        movieParagraphElement.textContent = movie.overview;  //<--changes the text content of the card-body element to the text within the 'overview' element within the movie attribute

        let movieButton = movieCard.querySelector('.btn-primary');  //<--targets the button within the movieCard, so we can change the modal content when clicked
        movieButton.setAttribute('data-movieId', movie.id);  //<--sets an attribute that targets the ID of the movie from the data fetched from the site, and creates that ID for the modal button

        movieListDiv.appendChild(movieCard); //<--targets the child elements within the movieListDiv to put them on the page. be sure to update the function within the button in the HTML
        //^^^appendChild requires an actual element, not a string


        /*  ---template tag from html below for reference in the displayMovies function---
        <div class="col">
            <div class="card h-100">
                <img src=" /IMG/the-equalizer.jpg" class="card-img-top" alt="Movie Poster">
                <div class="card-body">
                    <h5>The Equalizer 3</h5>
                    <p class="card-text">
                        Robert McCall finds himself at home in Southern Italy but he discovers his friends are under
                        the control of local crime bosses. As events turn deadly, McCall knows what he has to do:
                        become his friends' protector by taking on the mafia.
                    </p>
                </div>
                <div class="card-footer text-end">
                    <button class="btn btn-primary">
                        More Info
                    </button>
                </div>
            </div>
        </div>
        */

    }
}

//copied the getMovies() function, but specified more so that it only targets a specific movie, and not the full cache of movies from the fetch
async function getMovie(movieId) { //<-- 'async' gives the function time to wait for the information to be sent back from the 'fetch'
    try { // try/catch is similar to if/else, but for code we don't write ourselves and errors we can't predict
        let response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {  //<-- the url from the API reference section of the specific movie
            headers: {
                'Authorization': `Bearer ${API_KEY}` //<--gives the API key to the fetch so that it has permissions to call on the information from the site
            }
        });

        let data = await response.json(); //<-- get the data back from the site, hopefully coming in a json format; the .json() makes the information an object, not just a string

        return data;
    } catch (error) {    //<--secondary function as an alternative to the 'try' in case something goes wrong or is bugged from the code sent by fetching the data from the site
        console.error(error);
    }
}

//get the ID of the movie that was clicked, get the details of that movie using the ID from TMDB API, and then put those details into the modal
async function showMovieDetails(clickedBtn) {
    let movieId = clickedBtn.getAttribute('data-movieId');

    let movie = await getMovie(movieId); //<--calling in the ID from the getMovie() function

    let movieImg = document.querySelector('.movie-image');  //bring the image of the poster to the modal
    movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    let movieTitle = document.querySelector('.movie-title'); //<--will grab the title from the data response and put it in the modal
    movieTitle.textContent = movie.title;

    let movieOverview = document.querySelector('.overview'); //<-- will grab the overview summary from the response to put it in the modal
    movieOverview.textContent = movie.overview;

    let modalBtn = document.querySelector('.btn-primary'); //<--will hopefully send the user to the homepage when clicked from the modal
    modalBtn.href = movie.homepage;

    movie.genres.forEach(genre => {  //<-- alt path given by Jacob. same as a for() loop, but condensed. pulling the genre list from the array of objects in the genre tab of the response and putting them as strings of text on the modal section
        document.querySelector('#movieModal .genres').textContent += genre.name
    })

    let movieCast = document.querySelector('.actor-list'); //<--will pull the casting list from the response--- not working, may need new function
    movieCast.textContent = movie.cast;


}

//TODO: get more information to put into my modal. Another function for each?
//--use the genre loop given by Jacob


/* ---modal for reference---
<div class="modal fade" id="movieModal" tabindex="-1" aria-labelledby="movieModalLabel" aria-hidden="true">
<div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content">
        <div class="col-12 text-end">
            <button type="button" class="btn-close m-3 bg-primary" data-dismiss="modal"
                aria-label="close"></button>
        </div>
        <div class="container row row-cols-1 row-cols-md-2">
            <div class="col-12 col-lg-5">
                <img src=" " class="movie-image" alt="Movie Poster" />
            </div>
            <div class="col-12 col-lg-7">
                <h1 class="movie-title"><!--title here--></h1>
                <p class="overview"><!--Summary overview here--></p>
            </div>
            <div class="">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Exit</button>
                <a href="" type="button" class="btn btn-primary">Go To Site</a>
            </div>
        </div>
    </div>
</div>
</div>---*/

//both are same, for use in selecting specific genre in the genres array