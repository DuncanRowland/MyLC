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
       BlazeLayout.render('vote');
    }
});

FlowRouter.route('/r/:userid', {
    action: function(params, queryParams) {
       BlazeLayout.render('results');
    }
});

FlowRouter.route('/admin', {
    action: function(params, queryParams) {
       BlazeLayout.render('menu');
    }
});

FlowRouter.route('/locations', {
    action: function(params, queryParams) {
       BlazeLayout.render('adminLocations');
    }
});

FlowRouter.route('/items', {
    action: function(params, queryParams) {
       BlazeLayout.render('adminItems');
    }
});

if (Meteor.isServer) {
  Accounts.emailTemplates.from = "MyLC <no-reply@mylincolnshirecollection.org>";
  Accounts.emailTemplates.sitename = "MyLC";
  Images.allow({
    'insert': function () {
      return true;
    }
  });
}

randomisedIndex = [];
if (Meteor.isClient) {

  if (/Edge\/1/i.test(navigator.userAgent)){
     // this is Microsoft Edge
     window.alert('Microsoft Edge partially supported.\nClick the green arrow to load items.');
  }

  for(var i=0;i<100;i++) {
    var id;
    id=""+i;
    while(id.length<3) {
      id="0"+id;
    }
    randomisedIndex.push(id);
  }
  for(var i=0;i<randomisedIndex.length;i++) {
    var j = Math.floor((Math.random() * randomisedIndex.length));
    var tmp =  randomisedIndex[i];
    randomisedIndex[i] = randomisedIndex[j];
    randomisedIndex[j] = tmp;
  }

}
