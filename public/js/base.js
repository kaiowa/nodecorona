$(document).ready(()=>{
  console.log('readdddd');
  var embeddedMap;

  // var map = new ol.Map({
  //   target: 'map',
  //   layers: [
  //     new ol.layer.Tile({
  //       source: new ol.source.OSM()
  //     })
  //   ],
  //   view: new ol.View({
  //     center: ol.proj.fromLonLat([37.41, 8.82]),
  //     zoom: 1
  //   })
  // });
  
  $.get('/api/data').then((datos)=>{
    
    parseData(datos);
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

    _.forEach(cities,(item)=>{
     
      var latitude=item.longitude;
      var longitude=item.latitude;
      
      // var iconFeature1 = new ol.Feature({
      //   geometry: new ol.geom.Point(ol.proj.transform([latitude, longitude], 'EPSG:4326',     
      //   'EPSG:3857')),
      //   name: 'Null Island Two',
      //   population: 4001,
      //   rainfall: 501
      // });
      // features.push(iconFeature1);
      var coords = [];
  
      let row=_.template(templateRow(item));
      $('.results').append(row);
      
    });

    // var vectorSource = new ol.source.Vector({
    //   features: features      //add an array of features
    // });
    // var vectorLayer = new ol.layer.Vector({
    //       source: vectorSource
    // });
    // map.addLayer(vectorLayer)
  };

  
});