Session.setDefault("currentPage", 0);

//var itemArray; //Lazy load and shuffle (needs 100 items in database)

Template.selectItems.helpers({
  items: function (options) {
    console.log("Template.selectItems.helpers");
    /*randomisedIndex
    var itemArray;
    // Show start-stop sliced subset from alphabetical order
    var r = [];
    if(itemArray===undefined) {
      var result = Items.find( {}, {sort: {name: 1}});
      itemArray = [];
      result.forEach(function(entry) {
        itemArray.push(entry);
      });
      //Sometime itemArray.length is wrong here and I don't know why
      //Maybe a timeout issue?
      for(var i=0;i<itemArray.length;i++) {
        var j = Math.floor((Math.random() * itemArray.length));
        var tmp =  itemArray[i];
        itemArray[i] = itemArray[j];
        itemArray[j] = tmp;
      }
    }*/
    var r = [];
    var start = options.hash.start;
    var end = start + options.hash.count;
    for(var index=start; index<end; index++) {
      var id = randomisedIndex[index];
      console.log(id);
      var entry = Items.findOne({_id: id});
      console.log(entry);
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

Template.selectItems.rendered = function() {

  $( ".sortable-items-target" ).sortable({
    connectWith: ".sortable-items-source",
    revert: 300,
    dropOnEmpty: true,
    receive: function(event, ui) {
      if ($(this).children().length == 10) {
        $(".sortable-items-source").sortable( "option", "connectWith", "" );
      }
      for (r=0;r<9;r++) {
        if ($("#row"+r).children().length == 9) {
          $("#row"+(r+1)).children().eq(0).appendTo($("#row"+r));
        }
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
      for (r=0;r<9;r++) {
        if ($("#row"+r).children().length == 11) {
          $("#row"+r).children().eq(10).prependTo($("#row"+(r+1)));
        }
      }
    }
  }).disableSelection();

  $(document).ready(function() {
    Session.set("currentPage", 0);
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

    Votes.insert(v, function(err,newid){
      LatestVote.upsert(Meteor.userId(), { $set: { latest: newid } } );
    });

    FlowRouter.go('/results');
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
    return (Session.get("currentPage")!=0);
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
