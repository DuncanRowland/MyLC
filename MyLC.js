Items = new Mongo.Collection("items");
Locations = new Mongo.Collection("locations");
Votes = new Mongo.Collection("votes");
LatestVote = new Mongo.Collection("latestvote");
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
/* Commented out admin access, also requres insecure and autopublish
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
}); Don't forget to uncomment Images.allow insert below too...
*/


if (Meteor.isServer) {
  Accounts.emailTemplates.from = "MyLC <no-reply@mylincolnshirecollection.org>";
  Accounts.emailTemplates.sitename = "MyLC";
  Images.allow({
    //'insert': function () {
    //  return true;
    //},
    'download':function() {
      return true;
    }
  });
  Meteor.publish("items", function () {
    return Items.find();
  });
  Meteor.publish("images", function () {
    return Images.find();
  });
  Meteor.publish("locations", function () {
    return Locations.find();
  });
  Meteor.publish("latestvote", function () {
    return LatestVote.find();
  });
}

Meteor.methods({
  insertVotes: function (votes) {
    Votes.insert(votes);
  },
  upsertLatestVote: function (uid, html) {
    LatestVote.upsert(uid, { $set: { latest: html } } );
  }
});

randomisedIndex = [];
if (Meteor.isClient) {

  Meteor.subscribe("items");
  Meteor.subscribe("images");
  Meteor.subscribe("locations");
  Meteor.subscribe("latestvote");

  if(Meteor.userId()){ Meteor.logout() }

  if (/Edge\/1/i.test(navigator.userAgent)){
     // this is Microsoft Edge
     window.alert('Microsoft Edge partially supported.\nClick the green arrow to load items.');
  }

  //Shuffle order of tiles
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

  //Fancybox hack to correct size issue (too tall when off bottom)
  var F = $.fancybox;
  F._orig_setDimension = F._setDimension;
  F._setDimension = function() {
    var viewport,
        maxWidth;
    F._orig_setDimension();
    if ( this.group.length!=1 && this.current.title.length > 400 ) { //Just hack for gallery fancyboxes
      viewport  = F.getViewport();
      maxWidth  = viewport.w - (F.current.margin[0] + F.current.margin[2]);
      maxWidth = maxWidth / 1.25;
      if ( parseFloat( F.current.dim.width ) < maxWidth ) {
        F.current.dim.width = maxWidth + 'px';
        F.wrap.width( maxWidth );
      }
    }
  }
}
