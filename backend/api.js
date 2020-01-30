var router = require('express').Router();
const db=require('./database');

router.get('/data',function(req,res,next){
  
  let cities=db.readAll('cities');
  let update=db.readAll('updated');
  let results={
    cities:cities,
    updated:update
  }
  return res.json(results);
});

module.exports=router;