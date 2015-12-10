Template.adminItems.helpers({
  items: function () {
    // Show in alphabetical order
    var r = [];
    var result = Items.find({}, {sort: {text: 1}});
    result.forEach(function(entry) {
      var locationid = entry['locationid'];
      var location = Locations.findOne({_id:locationid})
      var locationText = "Unknown";
      if(location != undefined) {
        locationText = location['text'];
      }

      var imageid = entry['imageid'];
      var img = Images.findOne({_id: imageid});
      if(img != undefined) {
        var obj = {};
        obj['_id']=entry['_id'];
        obj['text']=entry['text'];
        obj['description']=entry['description'];
        obj['location'] = locationText;
        obj['image']=img;
        r.push(obj)
        }
    });
    return r;
  },
  locations: function () {
    // Show in alphabetical order
    return Locations.find({}, {sort: {text: 1}});
  }
});

Template.adminItems.events({

  "submit .new-item": function (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    var image = event.target.image.files[0];
    var text = event.target.text.value;
    var description = event.target.description.value;
    var location = event.target.location.value;

    Images.insert(image, function (err, fileObj) {
      // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      // Insert a item into the collection
      Items.insert({
        text: text,
        description: description,
        locationid: location,
        imageid: fileObj._id
      });
    });

    // Clear form
    event.target.text.value = "";
    event.target.description.value = "";
    event.target.location.value = "";
    event.target.image.value = "";
  }
});

Template.itemDeleteable.rendered = function() {
  $( ".portlet-toggle" ).unbind("click");
  $( ".portlet-toggle" ).click(function() {
    var icon = $( this );
    icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
    icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
  });
}

Template.itemDeleteable.events({
  "click .delete": function () {
    Items.remove(this._id);
  }
});
