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

if (Meteor.isServer) {
  Images.allow({
    'insert': function () {
      return true;
    }
  });
  Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: false
  });
}
