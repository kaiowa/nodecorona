$(document).ready(()=>{
  console.log('readdddd');
  var embeddedMap;

  function loadMap(){
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2Fpb3dhIiwiYSI6ImNrNjZjcTkyaTA3NzgzZXFxdW1zZXBnbXAifQ.gavZkTNZ2hz_8LUtRar2cQ';
    var coordinates = document.getElementById('coordinates');
    embeddedMap = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [0, 0],
    zoom: 1
    });

  }
  //loadMap();

  
  $.get('/api/data').then((datos)=>{
      parseData(datos);
  });

  function extractCountries(cities){
    let countries=[];
    var states=_.groupBy(cities,'country');
    _.filter(states,function(item,key){
      var total=0;   
      var totaldeaths=0;
      var totalrecovery=0;
      console.log(item);

      _.map(item,(item2)=>{
        total=total+item2.confirmed;
        totaldeaths=totaldeaths+item2.deaths;
        totalrecovery=totalrecovery+item2.recovered
      });
      item.total=total;
      let country={
        'name':key,
        'confirmed':total,
        'deaths':totaldeaths,
        'recovered':totalrecovery,
        'countryCode':item[0].countryCode
      }
      countries.push(country);
    });
    countries=_.filter(countries,function(item){
      return item.name!='undefined'
    });
    _.forEach(countries,(item,index)=>{
      if(index<10){
        let itemC={
          'province':'',
          'country':item.name,
          'countryCode':item.countryCode,
          'confirmed':item.confirmed,
          'deaths':item.deaths,
          'recovered':item.recovered
        }
        let row=_.template(templateRow(itemC));
        $('#results_countries').append(row);  
      }
    });
    console.log('countries',countries);
  }

  function parseData(datos){
    console.log('parseee ',datos)
    $('.last-update').html(datos.updated);
    $('#total_confirmed').html(datos.totals.confirmed);
    $('#total_deaths').html(datos.totals.death);
    $('#total_recovered').html(datos.totals.recovered);

    let cities=datos.cities;
    extractCountries(cities);
    _.forEach(cities,(item)=>{
     
      var latitude=item.longitude;
      var longitude=item.latitude;
      if(!item.countryCode){
        item.countryCode='AU';
      }
      item.country=item.country ? item.country :'';
      var coords = [];

      // var marker = new mapboxgl.Marker({
      //   draggable: false
      //   })
      //   .setLngLat([parseFloat(latitude),parseFloat(longitude)])
      //   .addTo(embeddedMap);

      try {
        let row=_.template(templateRow(item));
        $('.results').append(row);  
      } catch (error) {
        console.error(error)
      }
      
    });

  };

});