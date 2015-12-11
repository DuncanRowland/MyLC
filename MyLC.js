Items = new Mongo.Collection("items");
Locations = new Mongo.Collection("locations");
Votes = new Mongo.Collection("votes");
LatestVote = new Mongo.Collection("latestvote");
//Images = new FS.Collection("images", {
//  stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
//});
Images = new FS.Collection("images", {
    stores: [
      new FS.Store.FileSystem("large", {path: "~/uploads/img"}),
      new FS.Store.FileSystem("small", {path: "~/uploads/thm"}, {
        transformWrite: function(fileObj, readStream, writeStream) {
          // Transform the image into a 10x10px thumbnail
          gm(readStream, fileObj.name()).resize('10', '10').stream().pipe(writeStream);
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
