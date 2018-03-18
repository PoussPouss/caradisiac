//Package for requesting information
const {getModels} = require('node-car-api');
const {getBrands} = require('node-car-api');

//Package allowing the back side
var express = require('express');
var app = express();



/**
 * app - description
 *
 * @param  {type} "/populate"  description
 * @param  {type} function(req description
 * @param  {type} res          description
 * @return {type}              description
 */
app.get("/populate",function(req, res) {
  // We need to use promise because the request getModels is asynchrone
  getModels('PEUGEOT').then(function(resolve){
    // when the result is found, the result is send at the client
    res.json(resolve)
  }).catch(function (reject){
    res.status(500).send({ error: 'Something failed!' })
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
  // We need to use promise because the request getModels is asynchrone
  getBrands().then(function(resolve){
    // when the result is found, the result is send at the client
    res.json(resolve)
  }).catch(function (reject){
    res.status(500).send({ error: 'Something failed!' })
  })
})

app.listen(9292)
