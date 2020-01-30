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
      zoom: 4
    })
  });

  $.get('/api/data').then((datos)=>{
    
    parseData(datos);
  });
  function parseData(datos){
    console.log('parseee ',datos)
    $('.last-update').html(datos.updated);
    let totalConfirmed=0;
    let totalDeaths=0;
    _.forEach(datos.cities,(item)=>{
      totalConfirmed += item.confirmed
      totalDeaths += item.deaths

      var latitude=item.longitude;
      var longitude=item.latitude;


      var coords = [];
      // var polygonBounds = new google.maps.LatLngBounds();
      //  polygonBounds.extend(new google.maps.LatLng(longitude, latitude))

      // var marker=new google.maps.Marker({
      //   position: new google.maps.LatLng(longitude, latitude),
      //   map: embeddedMap,
      //   id:alert._id,
      //   name:item.formattedAddress,
      //   title:item.formattedAddress,
      //   animation: google.maps.Animation.DROP
      // });

    });
    $('#total_confirmed').html(Math.ceil(totalConfirmed));
    $('#total_deaths').html(Math.ceil(totalDeaths));
    embeddedMap.fitbounds();
  };
});