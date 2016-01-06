Template.adminLocations.helpers({
  locations: function () {
    // Show in alphabetical order
    var r = [];
    var result = Locations.find({}, {sort: {name: 1}});
    result.forEach(function(entry) {
      var imageid = entry['imageid'];
      var img = Images.findOne({_id: imageid});
      if(img != undefined) {
        var obj = {};
        obj['_id']=entry['_id'];
        obj['name']=entry['name'];
        obj['url']=entry['url'];
        obj['lat']=entry['lat'];
        obj['lng']=entry['lng'];
        obj['image']=img;
        r.push(obj)
        }
    });
    return r;
  }
});

Template.adminLocations.events({

  "submit .new-item": function (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    var image = event.target.image.files[0];
    var name = event.target.name.value;
    var lat = event.target.lat.value;
    var lng = event.target.lng.value;
    var url = event.target.url.value;
    var locationId = event.target.locationId.value;

    Images.insert(image, function (err, fileObj) {
      // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      // Insert a item into the collection
      //Locations.insert({
      //  name: name,
      //  url: url,
      //  lat: lat,
      //  lng: lng,
      //  imageid: fileObj._id
      //});
      Locations.upsert(locationId, {
        $set: {
          name: name,
          url: url,
          lat: lat,
          lng: lng,
          imageid: fileObj._id
        }
      });
    });

    // Clear form
    event.target.name.value = "";
    event.target.url.value = "";
    event.target.lat.value = "";
    event.target.lng.value = "";
    event.target.image.value = "";
  }
});

Template.locationDeleteable.rendered = function() {
  $( ".portlet-toggle" ).unbind("click");
  $( ".portlet-toggle" ).click(function() {
    var icon = $( this );
    icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
    icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
  });
}

Template.locationDeleteable.events({
  "click .delete": function () {
    Locations.remove(this._id);
  }
});
