Template.googlemap.onRendered(function() {
  GoogleMaps.load();
});

Template.googlemap.onCreated(function() {
  GoogleMaps.ready('exampleMap', function(map) {

    var infowindow = new google.maps.InfoWindow();
    var markers=[];

    var vote = Votes.findOne({"userid":Meteor.userId()}, {sort: {_id:1}});
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

    console.log(featuredLocations);
    for (var lid in featuredLocations) {
      var location = Locations.findOne({_id:lid});
      console.log(location['name']);
      console.log(location['lat']);
      console.log(location['lng']);
      featuredLocations[lid].forEach(function(item) {
        console.log(item['name']);
      });
    }

    for (var lid in featuredLocations) {
      var location = Locations.findOne({_id:lid});
      var htmlString = "";
      featuredLocations[lid].forEach(function(item) {
        htmlString = htmlString + item['name'] +":";
      });
      var newmarker =  new google.maps.Marker({
        position: {lat: Number(location['lat']), lng: Number(location['lng'])},
        map: map.instance,
        site: htmlString
      });
      newmarker.addListener('click', function() {
        infowindow.setContent(this.site);
        infowindow.open(map.instance, this);
        console.log("OK");
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

Template.vote.events({
  "click .map-marker": function (event) {
    var cp = Session.get("currentPage");
    if(cp>0){cp--};
    Session.set("currentPage", cp);
  }
});
