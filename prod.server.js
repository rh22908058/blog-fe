
var express = require('express')
var port = 8090
var app = express()
app.use(express.static('./dist'))
module.exports = app.listen(port,function(err){
    if(err){
        return
    }
    console.log('Listening at 39.105.136.160:' + port + '\n')
})
