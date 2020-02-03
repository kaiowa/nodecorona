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
  loadMap();

  
  $.get('/api/data').then((datos)=>{
    setTimeout(function(){
      parseData(datos);
    },2000);
    
  });
  function parseData(datos){
    console.log('parseee ',datos)
    $('.last-update').html(datos.updated);
    $('#total_confirmed').html(datos.totals.confirmed);
    $('#total_deaths').html(datos.totals.death);
    $('#total_recovered').html(datos.totals.recovered);

    var features = [];
    let cities=datos.cities;
   // cities=_.sortBy(cities,'confirmed').reverse();
    let sortedCities = _.sortBy(cities, 'confirmed');
    sortedCities.reverse();
    console.log('shorted',sortedCities);

    _.forEach(sortedCities,(item)=>{
     
      var latitude=item.longitude;
      var longitude=item.latitude;
      if(!item.countryCode){
        item.countryCode='AU';
      }
      item.country=item.country ? item.country :'';
      var coords = [];

      var marker = new mapboxgl.Marker({
        draggable: false
        })
        .setLngLat([parseFloat(latitude),parseFloat(longitude)])
        .addTo(embeddedMap);
      try {
        let row=_.template(templateRow(item));
        $('.results').append(row);  
      } catch (error) {
        console.error(error)
      }
      
    });

  };

});