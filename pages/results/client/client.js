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
    var marker1 = new google.maps.Marker({
      position: {lat: 53.22, lng: -0.54},
      map: map.instance,
      url: 'http://localhost:3000/cfs/files/images/EwKzaNFZQYTPZm3w2/ben.jpg?store=images'
    });
    var infowindow1 = new google.maps.InfoWindow({
      content: '<div>window 1</div>'
    });
    //google.maps.event.addListener(marker, 'click', function() {
    marker1.addListener('click', function() {
      //window.location.href = 'http://www.google.com';
      infowindow1.open(map.instance, marker1);
    });

    var marker2 = new google.maps.Marker({
      position: {lat: 53.22, lng: -0.55},
      map: map.instance,
      url: 'http://localhost:3000/cfs/files/images/EwKzaNFZQYTPZm3w2/ben.jpg?store=images'
    });
    var infowindow2 = new google.maps.InfoWindow({
      content: '<div>window 2</div>'
    });
    //google.maps.event.addListener(marker, 'click', function() {
    marker2.addListener('click', function() {
      //window.location.href = 'http://www.google.com';
      infowindow2.open(map.instance, marker2);
    });


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
