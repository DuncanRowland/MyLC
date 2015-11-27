Items = new Mongo.Collection("items");
Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
});
Votes = new Mongo.Collection("votes");

FlowRouter.route('/', {
    action: function() {
       BlazeLayout.render('menu');
    }
});

FlowRouter.route('/admin', {
    action: function(params, queryParams) {
       BlazeLayout.render('admin');
    }
});

FlowRouter.route('/vote', {
    action: function(params, queryParams) {
       BlazeLayout.render('vote');
    }
});

FlowRouter.route('/results', {
    action: function(params, queryParams) {
       BlazeLayout.render('results');
    }
});

FlowRouter.route('/gallery', {
    action: function(params, queryParams) {
       BlazeLayout.render('gallery');
    }
});

if (Meteor.isClient) {
  // This code only runs on the client
  Template.admin.helpers({
    items: function () {
      // Show in alphabetical order
      var r = [];
      var result = Items.find({}, {sort: {text: 1}});
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

  Template.vote.helpers({
    items: function () {
      // Show in alphabetical order
      var r = [];
      var result = Items.find({}, {sort: {text: 1}});
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
        text = text.substring(0, text.length - 2);
        obj = {preferences: text};
        r.push(obj)
      });
      return r;
    }
  });

  Template.gallery.helpers({
    images: function () {
      // Show in alphabetical order
      var r = [];
      var result = Items.find({}, {sort: {text: 1}});
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

  Template.vote.rendered = function() {
    $( ".column" ).sortable({
      connectWith: ".column",
      handle: ".portlet-header",
      cancel: ".portlet-toggle",
      placeholder: "portlet-placeholder ui-corner-all"
    });
  }

  Template.itemDelete.rendered = function() {
    $( ".portlet-toggle" ).unbind("click");
    $( ".portlet-toggle" ).click(function() {
      var icon = $( this );
      icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
      icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
    });
  }

  Template.item.rendered = function() {
    $( ".portlet-toggle" ).unbind("click");
    $( ".portlet-toggle" ).click(function() {
      var icon = $( this );
      icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
      icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
    });
  }

  Template.gallery.rendered = function() {
    $(document).ready(function() {
        $('.fancybox').fancybox();
    });
  }

  Template.vote.events({

    "submit .user-submit": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var v = {};
      var rank = 0;
      $("div[id='ranked']").children().each(function(){
         v[rank]=this.id;
         rank+=1;
      });
      Votes.insert(v);
      FlowRouter.go('/results');
    }
  });

  Template.admin.events({

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
        Items.insert({
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

  Template.itemDelete.events({
    "click .delete": function () {
      Items.remove(this._id);
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
