Session.setDefault("currentPage", 0);

Template.selectItems.helpers({
  items: function (options) {
    // Show start-stop sliced subset from alphabetical order
    var r = [];
    var result = Items.find( {}, {sort: {text: 1}});
    var index = 0;
    var start = options.hash.start;
    var end = options.hash.start + options.hash.count;
    result.forEach(function(entry) {
      var imageid = entry['imageid'];
      var img = Images.findOne({_id: imageid});
      if(img != undefined) {
        if( index >= start && index < end ) {
          var obj = {};
          obj['_id']=entry['_id'];
          obj['name']=entry['name'];
          obj['description']=entry['description'];
          obj['image']=img;
          r.push(obj);
        }
        index += 1;
      }
    });
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
    v["comment"] = $("#comment").val();
    //$("div[id='ranked']").children().each(function(){
    $("#ranked").children().each(function(){
       v[rank]=this.id;
       rank+=1;
    });
    Votes.insert(v);
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
