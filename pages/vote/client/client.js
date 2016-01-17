//var itemArray; //Lazy load and shuffle (needs 100 items in database)

Template.selectItems.helpers({
  items: function (options) {
    var r = [];
    var start = options.hash.start;
    var end = start + options.hash.count;
    for(var index=start; index<end; index++) {
      var id = randomisedIndex[index];
      var entry = Items.findOne({_id: id});
      if(entry===undefined) { return [] }; //Database not ready?
      var imageid = entry['imageid'];
      var img = Images.findOne({_id: imageid});
      if(img != undefined) {
        var obj = {};
        obj['_id']=entry['_id'];
        obj['name']=entry['name'];
        obj['description']=entry['description'];
        obj['image']=img;
        r.push(obj);
      }
    }
    return r;
  }
});

updateSizes = function() {
  var width = $('.container').width()-40;
  var topgap = $('header').height() * 2.75;
  var height = $('.container').height()-topgap; /*header +row? + instructions*/

  var numRows = 0;
  do {
    numRows++;
    var wh = Math.floor(height/numRows);
    var numCols = Math.floor(width/wh);
    var numItems = numRows * numCols;
  } while((numItems<100 || numCols<10) && numRows<20);
  var thumbsize = wh;
  if(thumbsize<30) {thumbsize=30};
  $('.sortable-items-target').css('height',(thumbsize+4));
  $('.sortable-items-target').css('width',(thumbsize+2)*10);
  $('.list-item-style').css('width',thumbsize);
  $('.list-item-style').css('height',thumbsize);
}

Template.selectItems.rendered = function() {

  $( ".sortable-items-target" ).sortable({
    connectWith: ".sortable-items-source",
    revert: 300,
    dropOnEmpty: true,
    receive: function(event, ui) {
      if ($(this).children().length == 10) {
        $(".sortable-items-source").sortable( "option", "connectWith", "" );
      }
    }
  }).disableSelection();

  $( ".sortable-items-source" ).sortable({
    connectWith: ".sortable-items-target",
    revert: 300,
    receive: function(event, ui) {
      if ($(ui.sender).children().length == 9) {
        $(".sortable-items-source").sortable( "option", "connectWith", ".sortable-items-target" );
      }
    }
  }).disableSelection();

  $(document).ready(function() {
    Session.set("currentPage", 0);

    $( window ).resize( updateSizes );
    //updateSizes(); Delay until next clicked

    $(".fancybox").fancybox({
      helpers : {
        title: {
          type: 'inside'
        }
      },
      beforeLoad : function() {
        this.title = $(this.element).data('info');
      }
    });
  });

}

Template.vote.events({
  "click .back-click": function (event) {
    var cp = Session.get("currentPage");
    if(cp>0){cp--};
    Session.set("currentPage", cp);
  },
  "click .next-click": function (event) {
    var cp = Session.get("currentPage");
    if(cp<2){cp++};
    Session.set("currentPage", cp);
    updateSizes();
  },
  "click .submit-click": function (event) {
    // Get values from form element
    var v = {};
    var rank = 0;
    v["userid"] = Meteor.userId();
    v["comment"] = $("#comment").val();
    //$("div[id='ranked']").children().each(function(){
    $("#ranked").children().each(function(){
       v[rank]=this.id;
       rank+=1;
    });

    //Votes.insert(v, function(err,newid){
    //  LatestVote.upsert(Meteor.userId(), { $set: { latest: newid } } );
    //});
    Votes.insert(v);
    LatestVote.upsert(Meteor.userId(), { $set: { latest: MakeInfoboxes(v) } } );

    FlowRouter.go('/r/'+Meteor.userId());
  }
});

Template.item.rendered = function() {
  $( ".portlet-toggle" ).unbind("click");
  $( ".portlet-toggle" ).click(function() {
    var icon = $( this );
    icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
    icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
  });
}

Template.navigator.helpers({
  currentPageHasBack: function(){;
    return Session.get("currentPage")!=0;
  },
  currentPageHasSubmit: function(){;
    return Session.get("currentPage")==2;
  },
  currentPageHasNext: function(){;
    return Session.get("currentPage")!=2;
  }
});

Template.instructions.helpers({
  hidePage: function(){
    if(Meteor.userId()==null) return false;
    return Session.get("currentPage")!=0;
  }
})

Template.selectItems.helpers({
  hidePage: function(){
    return (Session.get("currentPage")!=1);
  }
})

Template.addCommentAndSubmit.helpers({
  hidePage: function(){
    return (Session.get("currentPage")!=2);
  }
})
