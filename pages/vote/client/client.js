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

var thumbsize;
updateSizes = function() {
  var width = $('.container').width()-40;
  var topgap = $('header').height()*2+70/*for infotext*/;
  var height = $('.container').height()-topgap; /*header +row? + instructions*/

  var numRows = 0;
  do {
    numRows++;
    var wh = Math.floor(height/numRows);
    var numCols = Math.floor(width/wh);
    var numItems = numRows * numCols;
  } while((numItems<100 || numCols<10) && numRows<20);
  thumbsize = wh;
  if(thumbsize<31) {thumbsize=31}; /*Fiddles for iOS to make 10x10*/
  if(width==335)thumbsize=36; /*iPhone6/s*/
  if(width==374)thumbsize=40; /*iPhone6/s Plus*/
  if(width==360)thumbsize=39; /*Chrome*/
  /*console.log(width);*/
  $('.sortable-items-target').css('height',thumbsize);
  $('.sortable-items-target').css('width',thumbsize*10);
  $('.list-item-style').css('width',thumbsize);
  $('.list-item-style').css('height',thumbsize);
  $('.list-dummy-style').css('width',thumbsize);
  $('.list-dummy-style').css('height',thumbsize);
}

Template.selectItems.rendered = function() {

  $( ".sortable-items-target" ).sortable({
    placeholder: "list-placeholder-style",
    items: "li:not(.list-dummy-style)",
    over: function() {
      $('.list-dummy-style').remove();
    },
    start: function() {
      $('.list-placeholder-style').css('width',thumbsize);
      $('.list-placeholder-style').css('height',thumbsize);
    },
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
    placeholder: "list-placeholder-style",
    start: function() {
      $('.list-placeholder-style').css('width',thumbsize);
      $('.list-placeholder-style').css('height',thumbsize);
    },
    connectWith: ".sortable-items-target",
    revert: 300,
    receive: function(event, ui) {
      if ($(ui.sender).children().length == 9) {
        $(".sortable-items-source").sortable( "option", "connectWith", ".sortable-items-target" );
      }
    }
  }).disableSelection();

  $(document).ready(function() {
    Session.set("currentPage", 1);

    $( window ).resize( updateSizes );
    //updateSizes(); Delay until next clicked

    $.fancybox({
      helpers : {
        title: {
          type: 'inside'
        }
      },
      'width': '100%',
      'height': '100%',
      'autoScale': true,
      'transitionIn': 'fade',
      'transitionOut': 'fade',
      'closeBtn' : false,
      'type': 'image',
      'href': 'Banner.jpg',
      'title': ""+
"<div class='info-text'>"+
"<br>"+
"<h2>Make your own collection of Lincolnshire's treasures and share it with your friends.</h2><br>"+
"<input type='button' class='button-style' onclick='$.fancybox.close()' value='Start' />"+
"<br><h5>"+
"Your preferences will contribute to the ‘Our Lincolnshire’ research project. For more details, please check out our "+
"<a target='_blank' href='http://ourlincolnshire.blogs.lincoln.ac.uk/'>"+
"blog</a>.</h5>"+
"<br>"+
"</div>"
            });

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
    v["timestamp"] = new Date().getTime().toString();
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

Template.vote.helpers({
  hideTargetThumbs: function(){
    if(!Meteor.userId() && Session.get("currentPage")!=0) {
      $(".sortable-items-target").empty();
      $(".sortable-items-target").append("<li class='list-dummy-style'><img src='/drophere.png' class='img-fill-div'/></li>");
      Session.set("currentPage", 0);
      FlowRouter.go('/');
    }
    return Session.get("currentPage")==0;
  }
});

Template.item.rendered = function() {
  $( ".portlet-toggle" ).unbind("click");
  $( ".portlet-toggle" ).click(function() {
    var icon = $( this );
    icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
    icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
  });
  updateSizes();
}

Template.navigator.helpers({
  currentPageHasBack: function(){
    return Session.get("currentPage")==2;
  },
  currentPageHasSubmit: function(){
    return Session.get("currentPage")==2;
  },
  currentPageHasNext: function(){
    return Session.get("currentPage")==1;
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
