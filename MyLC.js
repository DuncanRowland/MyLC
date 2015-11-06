Tasks = new Mongo.Collection("tasks");
Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
});

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      // Show in alphabetical order

      return Tasks.find({}, {sort: {text: 1}});
    }
  });

  Template.task.rendered = function() {
        $( ".portlet" )
          .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
          .find( ".portlet-header" )
            .addClass( "ui-widget-header ui-corner-all" )
            .prepend( "<span class='ui-icon ui-icon-plusthick portlet-toggle'></span>");

        $( ".portlet-toggle" ).unbind("click");
        $( ".portlet-toggle" ).click(function() {
          var icon = $( this );
          icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
          icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
        });
  }


  //var imageFile = "";

  Template.body.events({

//    "change .myFileInput": function(event, template) {
//      imageFile = event.target.files[0];
//    },

    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var imageFile = event.target.myFileInput.files[0];
      var text = event.target.text.value;
      var description = event.target.description.value;

      Images.insert(imageFile, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        console.log(err);
        console.log(fileObj._id);
      });

      // Insert a task into the collection
      Tasks.insert({
        text: text,
        description: description
      });

      // Clear form
      event.target.text.value = "";
      event.target.description.value = "";
    }
  });

  Template.task.events({
    "click .delete": function () {
      Tasks.remove(this._id);
    }
  });
}

if (Meteor.isServer) {
  // This code only runs on the server
  Images.allow({
    'insert': function () {
      // add custom authentication code here
      return true;
    }
  });
}
