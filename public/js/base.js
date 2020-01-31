$(document).ready(()=>{
  console.log('readdddd');
  var embeddedMap;

  var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([37.41, 8.82]),
      zoom: 1
    })
  });
  debugger;



  $.get('/api/data').then((datos)=>{
    
    parseData(datos);
  });
  function parseData(datos){
    console.log('parseee ',datos)
    $('.last-update').html(datos.updated);
    let totalConfirmed=0;
    let totalDeaths=0;

    var features = [];

    _.forEach(datos.cities,(item)=>{
      totalConfirmed += item.confirmed
      totalDeaths += item.deaths

      var latitude=item.longitude;
      var longitude=item.latitude;
     
      
      var iconFeature1 = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([latitude, longitude], 'EPSG:4326',     
        'EPSG:3857')),
        name: 'Null Island Two',
        population: 4001,
        rainfall: 501
      });
      features.push(iconFeature1);
      var coords = [];
  
    });
    $('#total_confirmed').html(Math.ceil(totalConfirmed));
    $('#total_deaths').html(Math.ceil(totalDeaths));

    var vectorSource = new ol.source.Vector({
      features: features      //add an array of features
      //,style: iconStyle     //to set the style for all your features...
      });
      
      var vectorLayer = new ol.layer.Vector({
          source: vectorSource
      });
      map.addLayer(vectorLayer)

  };
});