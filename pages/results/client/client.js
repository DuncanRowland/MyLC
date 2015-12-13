Template.googlemap.onRendered(function() {
  GoogleMaps.load();
});

Template.googlemap.onCreated(function() {
  GoogleMaps.ready('exampleMap', function(map) {

    var infowindow = new google.maps.InfoWindow();

    var vote = Votes.findOne({"_id":
                LatestVote.findOne({"_id":Meteor.userId()})["latest"]});

    var rank = 0;
    var featuredLocations = {};
    while(vote[rank]!=undefined) {
      var item = Items.findOne({_id: vote[rank]})
      if(item!=undefined) {
        var lid = item.locationid;
        if(!(lid in featuredLocations)) { featuredLocations[lid]=[] }
        featuredLocations[lid].push(item);
      }
      rank++;
    }

    for (var lid in featuredLocations) {
      var location = Locations.findOne({_id:lid});
      var img = Images.findOne({_id: location['imageid']});
      var url = img.url({store:'images'});

      var h=""+ //Horrible
"<head>"+
"  <style>"+
"    .miw-title {"+
//"      background-color: green;"+
"      text-align: center;"+
"      font-size: 20px;"+
"      padding-top: 10px;"+
"      padding-bottom: 5px;"+
"    }"+
"    .miw-description {"+
//"      background-color: yellow;"+
"      text-align: center;"+
"      font-size: 16px;"+
"    }"+
"    .miw-wrapper {"+
//"      background-color: linen;"+
"      width: 300px;"+
"      height: 350px;"+
"      font-size: 0px;"+
"      padding-left: 24px;"+
"    }"+
"    .miw-location-image-div {"+
//"      background-color: green;"+
"      width: 180px;"+
"      height: 180px;"+
"      margin: auto;"+
"    }"+
"    .miw-items-wrapper {"+
//"      background-color: black;"+
"      text-align: center;"+
"      margin: auto;"+
"    }"+
"    .miw-item-image-div {"+
"      border-style: solid;"+
"      border-width: 1px;"+
//"      background-color: blue;"+
"      width: 50px;"+
"      height: 50px;"+
"      margin: auto;"+
"      display: inline-block;"+
"    }"+
"    .miw-img-fill-div {"+
"      width: 100%;"+
"      height: 100%;"+
"    }"+
"</style>"+
"</head>"+
"<body>"+
"  <div class='miw-wrapper'>"+
"    <div class='miw-title'>"+location['name']+"</div>"+
"    <div class='miw-location-image-div'>"+
"      <img class='miw-img-fill-div' src="+url+"></img>"+
"    </div>"+
"    <div class='miw-description'>"+location['description']+"</div>"+
"    <div class='miw-items-wrapper'>";
      featuredLocations[lid].forEach(function(item) {
        var img = Images.findOne({_id: item['imageid']});
        var url = img.url({store:'thumbs'});
            h=h+
"      <div class='miw-item-image-div'>"+
"        <img class='miw-img-fill-div' src="+url+"></img>"+
"      </div>"
      });
      h=h+
"    </div>"+
"  </div>"+
"</body>";
      console.log(h);
      var newmarker =  new google.maps.Marker({
        position: {lat: Number(location['lat']), lng: Number(location['lng'])},
        map: map.instance,
        htmlString: h
      });
      newmarker.addListener('click', function() {
        infowindow.setContent(this.htmlString);
        infowindow.open(map.instance, this);
      });
    }

  });
});

Template.googlemap.helpers({
  exampleMapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: {lat: 53.22, lng: -0.54},
//new google.maps.LatLng(53.22, -0.54),
        zoom: 12
      };
    }
  }
});
