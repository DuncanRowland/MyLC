Template.googlemap.onRendered(function() {
  GoogleMaps.load();
});

Template.googlemap.onCreated(function() {
  GoogleMaps.ready('exampleMap', function(map) {

    var infowindow = new google.maps.InfoWindow();
    var vote = Votes.findOne({"userid":Meteor.userId()}, {sort: {_id:1}});
    var rank = 0;
    while(vote[rank]!=undefined) {
      var item_id = Items.findOne({_id: vote[rank]})
      if(item_id!=undefined) {
        console.log(item_id.locationid);
        console.log(Locations.findOne({_id:item_id.locationid})['name']);
        console.log(Locations.findOne({_id:item_id.locationid})['lat']);
        console.log(Locations.findOne({_id:item_id.locationid})['lng']);
        rank+=1;
      }
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
