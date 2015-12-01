Session.setDefault("xx", 0);

Template.itemSelector.helpers({
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
          obj['text']=entry['text'];
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

Template.itemSelector.rendered = function() {

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
  "submit .user-submit": function (event) {
    // Prevent default browser form submit
    event.preventDefault();

    Session.set("xx", (Session.get("xx")+1)%3);
    console.log(Session.get("xx"));
    return false;

    // Get value from form element
    var v = {};
    var rank = 0;
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

Template.vote.helpers({
  menutype0: function(){;
    return Session.get("xx")==0;
  },
  menutype1: function(){;
    return Session.get("xx")==1;
  },
  menutype2: function(){;
    return Session.get("xx")==2;
  }
});
