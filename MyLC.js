Items = new Mongo.Collection("items");
Locations = new Mongo.Collection("locations");
Votes = new Mongo.Collection("votes");
LatestVote = new Mongo.Collection("latestvote");
//Images = new FS.Collection("images", {
//  stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
//});
Images = new FS.Collection("images", {
    stores: [
      new FS.Store.FileSystem("images", {path: "~/uploads/images"}),
      new FS.Store.FileSystem("thumbs", {
        path: "~/uploads/thumbs",
        transformWrite: function(fileObj, readStream, writeStream) {
          gm(readStream, fileObj.name()).resize('128', '128').stream().pipe(writeStream);
        }
      })
    ],
    filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
});

FlowRouter.route('/', {
    action: function() {
       BlazeLayout.render('menu');
    }
});

FlowRouter.route('/items', {
    action: function(params, queryParams) {
       BlazeLayout.render('adminItems');
    }
});

FlowRouter.route('/locations', {
    action: function(params, queryParams) {
       BlazeLayout.render('adminLocations');
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

if (Meteor.isServer) {
  Images.allow({
    'insert': function () {
      return true;
    }
  });
}

if(Meteor.isClient) {
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1657697167840424',
      status     : true,
      xfbml      : true
    });
  };
}
