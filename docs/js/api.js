//Package for requesting information
const {getModels} = require('node-car-api');
const {getBrands} = require('node-car-api');

//Package allowing the back side
var express = require('express');
var app = express();


// variables used by elastricsearch
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});


/**
 * headerElasticSearch - Create the header of each json element.
 * For allowing the insert in using a bulk
 *
 * @param  {type} id the cars id
 * @return {type}    array of json
 */
function headerElasticSearch(id){
  return   { index:  { _index: 'cars', _type: 'car', _id: id } }
}


function parseVolume(json){
    json.volume = parseInt(json.volume)
    return(json)
}


/**
 * updateElasticSearch - Send a insert request at elasticsearch server
 *
 * @param  {type} tab array of cars
 * @return {type}     the state insertion
 */
function updateElasticSearch(tab) {
  return new Promise(function(resolve, reject) {
    var tabToSend = []
    for (var i in tab) {
      tabToSend.push(headerElasticSearch(i))
      tabToSend.push(parseVolume(tab[i]))
      //console.log(parseVolume(tab[i]))
    }
    //console.log(tabToSend)
  client.bulk({
      body: tabToSend
    }, function(err, resp) {
      resolve(resp)
    })
  });
}



/**
 * getFullCars - Allow to laod all cars data
 *
 * @return {type}  array of cars
 */
function getFullCars(){
  return new Promise(function(resolveResult,reject){
  getBrands().then(function(resolve){
    var tabPromises = []
    for(var i =0 ;i< resolve.length ;i++){ //resolve.length
      tabPromises.push(getModels(resolve[i]))
      console.log("Add model:"+resolve[i])
    }
    Promise.all(tabPromises).then(function(result){
      var cars = []
      for(var i in result){
        cars = cars.concat(result[i])
        console.log("Add cars")
      }
        resolveResult(cars)
      })
    })
  })
}



/**
 * getCarByCar - load car by car
 *
 * @return {type}  a car
 */
function getCarByCar(){
  getBrands().then(function(resolve){
    var tabPromises = []
    for(var i in resolve){
      getModels(resolve[i]).then(function(result){
        console.log(result)
      })
    }
  })
}


/**
 * app - This route allows to start the scrapping and insert all data in a
 * elastricsearch database
 *
 * @param  {type} "/populate"  the route name
 */
app.get("/populate",function(req, res) {
  // We need to use promise because the request getModels is asynchrone
  getFullCars().then(function(resolve){
    updateElasticSearch(resolve).then(function(resolveSend){
      res.send(resolveSend)
    })
  })
})


/**
 * app - description
 *
 * @param  {type} "/suv"       description
 * @param  {type} function(req description
 * @param  {type} res          description
 * @return {type}              description
 */
app.get("/suv",function(req, res) {
  client.search({
       index: "cars",
       type: "car",
       body: {

     "sort" : [
         { "volume" : {"order" : "desc"}}
     ]

       }
   },function(err, resp) {
     res.json(resp)
   })
})

app.listen(9292)
