const puppeteer = require('puppeteer');
const fs=require('fs');
require('dotenv').config();

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
    await page.waitForSelector('#ember61');
    await page.waitFor(5000);
    await page.screenshot({path:'uno.png'});
  
    const result = await page.evaluate(() => {
      
      let textos=[];
      let divs=document.querySelectorAll('#ember61 .external-html');
      divs.forEach(element => {
        let entradaTexto=element.innerText.trim();
        textos.push(entradaTexto);
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
      datos.textos.forEach(function(item){
      
        var itemCut=item.split('\n\n');
        
        let city=itemCut[0];
        let datos=itemCut[1];
        let tempD=datos.split('; ');
        
        let confirmed=tempD[0].replace('Confirmed: ','').replace(',','.');
        let deaths=(tempD[1].replace('Deaths:','')==='') ? '0' : tempD[1].replace('Deaths:','');
        
        geocoder.geocode(city.split(' (')[0], function(err, res) {
          let city={
            'name':itemCut[0],
            'confirmed':confirmed,
            'deaths':deaths,
            "formattedAddress":res[0].formattedAddress,
            "latitude": res[0].latitude,
            "longitude": res[0].longitude,
            "country": res[0].country,
            "countryCode": res[0].countryCode,
          }
          db.addEntry('cities',city);
         });
  
      });

    });
   
  }
 
 

  await crawURL(process.env.URLSCRAP);
   await parseResults();

})()