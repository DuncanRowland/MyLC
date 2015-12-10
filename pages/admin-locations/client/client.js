Template.adminLocations.helpers({
  locations: function () {
    // Show in alphabetical order
    var r = [];
    var result = Locations.find({}, {sort: {text: 1}});
    result.forEach(function(entry) {
      var imageid = entry['imageid'];
      var img = Images.findOne({_id: imageid});
      if(img != undefined) {
        var obj = {};
        obj['_id']=entry['_id'];
        obj['text']=entry['text'];
        obj['description']=entry['description'];
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
    var text = event.target.text.value;
    var description = event.target.description.value;

    Images.insert(image, function (err, fileObj) {
      // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      // Insert a item into the collection
      Locations.insert({
        text: text,
        description: description,
        imageid: fileObj._id
      });
    });

    // Clear form
    event.target.text.value = "";
    event.target.description.value = "";
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
