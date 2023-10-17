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
    } catch (error) {
        console.error(error);
    }
}

//get the information (movies) and display them on the page
async function displayMovies() {
    let data = await getMovies(); //<--wait on the fetch to get the information from the previous function

    const movieListDiv = document.getElementById('movie-list');
    //^^^const is much like 'let', only it creates a constant variable that never changes, whereas 'let' allows you to change the element
    const moviePosterTemplate = document.getElementById('movie-card-template');

    let movies = data.results; //<--allows you do grab the 'results' property information from your data response in the json() file

    for (let i = 0; i < movies.length; i++) {

        let movie = movies[i]; //<--pulling the movie out of the array
        //^^^ you can look further into an object with more specifics, e.g.--- movie.genre-ads[0, 1, ...]

        let movieCard = moviePosterTemplate.content.cloneNode(true); //<-- copies the content in the template

        let movieImgElement = movieCard.querySelector('.card-img-top'); //<--targets the image in the card within the copy of the template
        movieImgElement.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`; //<-- changes the src attribute to the path of the poster for this movie

        let movieTitleElement = movieCard.querySelector('.card-body > h5'); //<--targets the h5 element within the card-body
        movieTitleElement.textContent = movie.title;

        let movieParagraphElement = movieCard.querySelector('.card-text'); //<--targets the summary of the movie to put it in the 'card-text' element
        movieParagraphElement.textContent = movie.overview;

        movieListDiv.appendChild(movieCard); //<--targets the child elements within the movieListDiv to put them on the page. be sure to updat the function within the button in the HTML

        /*
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