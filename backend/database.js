const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json');
const db = low(adapter);
db.defaults({ cities: [], history: {}, previous:{ "confirmed":0,"deaths":0 } ,updated:""}).write();
 
function readAll(tableName){
  return db.get(tableName);
}
function addEntry(tableName,data){
  return db.get(tableName)
  .push(data)
  .write();
}

function updateEntry(tableName,value){
  return db.set(tableName, value)
  .write()
}
module.exports={readAll, addEntry,updateEntry}