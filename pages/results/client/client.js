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
      var htmlString = "<div class='map-info-box'>";
      htmlString = htmlString + location['name'];
      htmlString = htmlString + "<div class='inline-location-image'>"
      htmlString = htmlString + "<img class='img-fill-div' src='"+url+"'>";
      htmlString = htmlString + "</div>";
      htmlString = htmlString + "<div>"+location['description']+"</div>";
      featuredLocations[lid].forEach(function(item) {
        var img = Images.findOne({_id: item['imageid']});
        var url = img.url({store:'thumbs'});
        htmlString = htmlString + "<div class='inline'>";
        htmlString = htmlString + "<img class='img-fill-div' title='"+item['name']+"' src='"+url+"'>";
        htmlString = htmlString + "</div>";
      });
      htmlString = htmlString + "</div>";
      var newmarker =  new google.maps.Marker({
        position: {lat: Number(location['lat']), lng: Number(location['lng'])},
        map: map.instance,
        site: htmlString
      });
      newmarker.addListener('click', function() {
        infowindow.setContent(this.site);
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
