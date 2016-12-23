/**
 * Created by oliver on 16/12/19.
 */

/*
var searchByDouban = async function (q) {
    var options = {
        url: 'https://api.douban.com/v2/movie/search?q='
    };
    options.url += encodeURIComponent(q);
    var response = await koa_request(options);
    var data = JSON.parse(response.body);
    //console.log(data);
    var subjects = [];
    var movies = [];

    if (data || data.length) {
        subjects = data.subjects;
    }
    if (subjects.length > 0) {
        var qureyArray = [];
        subjects.forEach(function (item) {
            qureyArray.push(function *() {
                var movie = yield Movie.findOne({doubanID: item.id});
                if (movie) {
                    movies.push(movie)
                }
                else {
                    //console.log(item.directors)
                    var directors = item.directors || [];
                    var director = directors[0] || [];
                    movie = new Movie({
                        director: director.name || '',
                        title: item.title,
                        doubanId: item.id,
                        url: item.alt,
                        poster: item.images.large,
                        year: item.year,
                        genres: item.genres || []

                    });
                    movie = yield movie.save();
                    movies.push(movie);
                }
            })
        });
        //console.log(qureyArray);
        yield qureyArray;
        movies.forEach(function (movie) {
            updateMovies(movie);

        });
    }
    return movies;
}

module.exports=searchByDouban;
*/