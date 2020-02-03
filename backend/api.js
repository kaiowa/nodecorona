var router = require('express').Router();
const db=require('./database');
const historic=require('../db/scrap_history.json');
var _ = require('underscore');
router.get('/data',function(req,res,next){
  
  let cities=db.readAll('cities');
  let update=db.readAll('updated');
  
  
  let results={
    cities:cities,
    updated:update,
    totals:db.readAll('totals'),
    previous:db.readAll('previous')
  }
  return res.json(results);
});
router.get('/data/:province',function(req,res,next){

  let entries=historic.textos;
  let provincia=req.params.province;

  entries=_.filter(entries,function(item){
    return item.province==provincia
  });
  entries=_.sortBy(entries,'-date');
  return res.json(entries);

});

router.get('/data/top',function(req,res,next){

  let cities=db.readAll('cities');
  console.log(cities);

  return res.json(cities);


  // let entries=historic.textos;
  // let provincia=req.params.province;

  // entries=_.filter(entries,function(item){
  //   return item.province==provincia
  // });
  // entries=_.sortBy(entries,'-date');
  // return res.json(entries);

});
module.exports=router;