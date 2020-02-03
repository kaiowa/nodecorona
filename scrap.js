const puppeteer = require('puppeteer');
const fs=require('fs');
require('dotenv').config();
var datetime = require('node-datetime');
var db=require('./backend/database');

var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  httpAdapter: 'https', 
  apiKey: process.env.APIKEY, 
  formatter: null 
};
var geocoder = NodeGeocoder(options);


(async () => {

  async function crawURL(url){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    await page.waitFor(5000);
    //await page.screenshot({path:'uno.png'});
    const result = await page.evaluate(() => {
      let textos=[];
      let trs=document.querySelectorAll('#sheets-viewport > div:nth-child(1) > div > table > tbody > tr');
      let conta=0;
      trs.forEach(element =>{
        if(conta>0){
          let tds=element.querySelectorAll('td');
          if(tds.length>0){
            let entradaTexto={
              'province':tds[0] ? tds[0].innerText.trim() : '',
              'country':tds[1] ? tds[1].innerText.trim() :'',
              'confirmed':tds[3] ? tds[3].innerText.trim(): '0',
              'deaths':tds[4] ? tds[4].innerText.trim(): '0',
              'recovered':tds[5]? tds[5].innerText.trim(): '0',
            }
            textos.push(entradaTexto);
          }
        }
        conta++;

      });
      return{textos}
    });
    await browser.close();
    console.log('### Crawl complete ###');
    
    fs.writeFileSync('./db/scrap.json', JSON.stringify(result));
    return result;
}
 
  async function parseResults(){
    fs.readFile('./db/scrap.json', (err, data) => {
      let datos=JSON.parse(data);
      let totalConfirmed=0;
      let totalDeaths=0;
      let totalRecovered=0;

      db.updateEntry('cities',[]);
      console.log('total:'+datos.textos.length);
      console.log('---------------');
      
      datos.textos.forEach(function(item){
      
       let city=(item.province!='') ? item.province : item.country;
       if(item.country){
         city =city+'('+item.country+')';
       }
       console.log('city',city);
       console.log('-----------------');
       let confirmed=item.confirmed ? item.confirmed : 0;
       let deaths=item.deaths ? item.deaths :0;
       let recovered=item.recovered ? item.recovered : 0;

        totalConfirmed = totalConfirmed+parseFloat(confirmed);
        totalDeaths =totalDeaths+parseFloat(deaths);
        totalRecovered=totalRecovered + parseFloat(recovered);
        
        geocoder.geocode(city, function(err, res) {
          if(res){
            let city={
              'province':item.province,
              'country':item.country,
              'confirmed':parseFloat(confirmed),
              'deaths':parseFloat(deaths),
              'recovered':parseFloat(recovered),
              "formattedAddress":res[0].formattedAddress,
              "latitude": res[0].latitude,
              "longitude": res[0].longitude,
              "country": res[0].country,
              "countryCode": res[0].countryCode,
            }
            db.addEntry('cities',city);
          }
         });
  
      });
      console.log('TotalConfirmed:'+totalConfirmed);
      console.log('TotalDeaths:'+totalDeaths);
      console.log('TotalRecovered:'+totalRecovered);

      let dt = datetime.create();
      let dateUpdate= dt.format('Y/m/d H:M:S');
      db.updateEntry('updated',dateUpdate);

      db.updateEntry('previous',db.readAll('totals'));
      let cTotals={
        'confirmed':totalConfirmed,
        'death':totalDeaths,
        'recovered':totalRecovered
      }
      db.updateEntry('totals',cTotals);

    });
  }


  //await crawURL(process.env.URLSHEET);
  //await parseResults();

  async function crawHistory(url){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    await page.waitFor(5000);
    //await page.screenshot({path:'uno.png'});
    const result = await page.evaluate(() => {
      let textos=[];
      let trs=document.querySelectorAll('#sheets-viewport > div > div > table > tbody > tr');
      let conta=0;
      trs.forEach(element =>{
        if(conta>0){
          let tds=element.querySelectorAll('td');
          if(tds.length>0){
            let entradaTexto={
              'province':tds[0] ? tds[0].innerText.trim() : '',
              'country':tds[1] ? tds[1].innerText.trim() :'',
              'date':tds[2] ? tds[2].innerText.trim() : '',
              'confirmed':tds[3] ? tds[3].innerText.trim(): '0',
              'deaths':tds[4] ? tds[4].innerText.trim(): '0',
              'recovered':tds[5]? tds[5].innerText.trim(): '0',
            }
            textos.push(entradaTexto);
          }
        }
        conta++;

      });
      return{textos}
    });
    await browser.close();
    console.log('### Crawl complete ###');
    
    fs.writeFileSync('./db/scrap_history.json', JSON.stringify(result));
    return result;
}
  await crawHistory(process.env.URLSHEET)

})()