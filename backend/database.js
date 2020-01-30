const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json');
const db = low(adapter);
db.defaults({ cities: [], history: {}, count: 0 }).write();
 
function readAll(tableName){
  return db.get(tableName);
}
function addEntry(tableName,data){
  return db.get(tableName)
  .push(data)
  .write();
}

module.exports={readAll, addEntry}