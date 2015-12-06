Template.results.helpers({
  results: function () {
    // Get all votes
    var r = [];
    var votenum = 0
    var result = Votes.find();
    result.forEach(function(entry) {
      votenum += 1;
      var text = "#"+votenum+": ";
      var rank = 0;
      while(entry[rank]!=undefined) {
          _id = Items.findOne({_id: entry[rank]})
          if(_id===undefined) {
            text += "?, ";
          } else {
            text += _id.text + ", ";
          }
        rank+=1;
        }
      var commentText = "none";
      if(entry["comment"]!=undefined) {
        commentText = entry["comment"];
      }
      obj = {preferences: text, comment: commentText};
      r.push(obj);
    });
//DEBUG
    var last_element = r[r.length - 1];
    var rr = [];
    rr.push(last_element);
    return rr;
//DEBUG
//    return r;
  }
});

Template.googlemap.onRendered(function() {
  GoogleMaps.load();
});

Template.googlemap.onCreated(function() {
  GoogleMaps.ready('exampleMap', function(map) {

    var infowindow = new google.maps.InfoWindow();

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
