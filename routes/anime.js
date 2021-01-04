const http = require('https');
const malScraper = require('mal-scraper');
const search = malScraper.search;
const pool = require('../db');
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const jikan = require('jikan-nodejs');
const request = require('request');

const privatekey = 'hitlerwithoutmostache9988';
const checkAuth = require('../middleware/check-auth');
const { EDESTADDRREQ } = require('constants');
const { watch } = require('fs');


//this function will return a specific user 's animelist from Myanimelist.net.
router.get('/getuser/:id', async (req, res, next) => {
    const userID = req.params;
    console.log(req.params);
    const username = req.params.id
    const after = 25
    const type = 'anime' // can be either `anime` or `manga`
    let watchlist = [];

    try {
        // Get you an object containing all the entries with status, score... from this user's watch list
        console.log('here')
        await malScraper.getWatchListFromUser(username, after, type)
            .then((data) => {
                console.log("data sent"); watchlist = data;
            })
            .catch((err) => {
                console.log("error occrured");
                res.status(404).json({
                    message: "notfound"
                })

            })
        let lengthy = watchlist.length;
        if (lengthy === 300) {
            await malScraper.getWatchListFromUser(username, lengthy, type)
                .then((data2) => {
                    console.log("data returned ");  Array.prototype.push.apply(watchlist,data2);
                })
                .catch((err) => {
                    console.log("error occrured");
                    res.status(404).json({
                        message: "notfound"
                    })
                })
            console.log('length: ', watchlist.length);
        }
        res.status(200).json({
            data: watchlist
        })
       
    } catch (error) {
    console.log("error catched")
    res.status(400).json({
        error: "Bad request, user doesnt exist"
    })
}


})


//this function will pass the param as a query, it will return the complete search results by the name of the anime
router.get('/search/:name', async (req, res, next) => {
    const query = req.params.name;
    let result = [];
    let pictures = [];

    try {
        if (query) {
            await malScraper.getResultsFromSearch(query)
                .then((data) => {
                    result = data;
                })
                .catch((err) => console.log(err))

            for (let i = 0; i < result.length; i++) {
                await malScraper.getPictures({
                    name: result[i].name,
                    id: result[i].id
                })
                    .then((data) => pictures.push(data))
                    .catch((err) => console.log(err))
            }


            if (result === []) {
                res.status(201).json({
                    message: "no such anime, Please try again"
                })
            } else {
                res.status(200).json({
                    list: result,
                    images: pictures
                })
            }
        } else {
            res.status(400).json({
                message: "something went wrong"
            })
        }




    } catch (error) {
        res.status(400).json({
            error: "Bad request, user doesnt exist"
        })

    }



});

//This function pass year ,season(winter,fall...), and OPTIONAL: type('TV', 'TVNEW', 'TVCON', 'ONAS', 'OVAS', 'SPECIALS', 'MOVIES')  
//to the api and it will return list of animes that is released according to the season and year.
router.post('/seasonlist', async (req, res, next) => {
    const year = req.body.year;
    const season = req.body.season;
    const type = req.body.type;
    console.log(season);
    console.log(year);
    const season_types = ['spring', 'summer', 'fall', 'winter'];
    const anime_types = ['TV', 'TVNEW', 'TVCON', 'ONAS', 'OVAS', 'SPECIALS', 'MOVIES'];
    if (!season || !year) {
        res.status(500).json({
            message: "undefined"
        })
    } else if (season_types.includes(season.toLowerCase()) && year) {
        if (type !== null) {

            if (anime_types.includes(type.toUpperCase())) {
                await malScraper.getSeason(year, season, type)
                    // `data` is an object containing the following keys: 'TV', 'TVNew', 'TVCon', 'OVAs', 'ONAs', 'Movies' and 'Specials'
                    .then((data) => {
                        console.log("data sent")
                        res.status(200).json(data)
                    })
                    .catch((err) => {
                        res.status(500).json({
                            message: "error while retriving the season list, please check your syntax"
                        })
                    })

            }
        }
        else {
            await malScraper.getSeason(year, season)
                // `data` is an object containing the following keys: 'TV', 'TVNew', 'TVCon', 'OVAs', 'ONAs', 'Movies' and 'Specials'
                .then((data) => {
                    res.status(200).json({
                        AnimeList: data
                    })
                })
                .catch((err) => {
                    res.status(500).json({
                        message: "error while retriving the season list, please check your syntax"
                    })
                })

        }


    }

})


//get information by url(from myanimelist.net)

router.post('/getByurl', async (req, res, next) => {
    try {
        if (req.body) {
            const url = req.body.link;
            // const url = 'https://myanimelist.net/anime/20047/Sakura_Trick'

            await malScraper.getInfoFromURL(url)
                .then(
                    (data) => {
                        res.status(201).json({
                            data
                        })
                        console.log('link retrieved')

                    })
                .catch((err) => {
                    res.status.json(501).json({
                        error: err
                    })
                })



        } else {
            res.status(404).json({
                error: "empty body"
            })
        }

    } catch (err) {
        res.status.json({
            error: err.message
        })

    }


})



module.exports = router;

