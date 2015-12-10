Template.googlemap.onRendered(function() {
  GoogleMaps.load();
});

Template.googlemap.onCreated(function() {
  GoogleMaps.ready('exampleMap', function(map) {

    var infowindow = new google.maps.InfoWindow();
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

    var marker1 = new google.maps.Marker({
      position: {lat: 53.22, lng: -0.54},
      map: map.instance,
      site: "M1"
    });
    marker1.addListener('click', function(){setupInfoWindow(marker1)});

    var marker2 = new google.maps.Marker({
      position: {lat: 53.22, lng: -0.55},
      map: map.instance,
      site: "M2"
    });
    marker2.addListener('click', function(){setupInfoWindow(marker2)});

    function setupInfoWindow(marker) {
        infowindow.setContent(marker.site);
        infowindow.open(map.instance, marker);
    }


  });
});

Template.googlemap.helpers({
  exampleMapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: {lat: 53.22, lng: -0.54},
//new google.maps.LatLng(53.228226, -0.546926),
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
