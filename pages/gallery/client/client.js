Template.gallery.helpers({
  images: function () {
    // Show in alphabetical order
    var r = [];
    var result = Items.find({}, {sort: {text: 1}});
    result.forEach(function(entry) {
      var imageid = entry['imageid'];
      var img = Images.findOne({_id: imageid});
      if(img != undefined) {
        var obj = {};
        obj['_id']=entry['_id'];
        obj['text']=entry['text'];
        obj['description']=entry['description'];
        obj['image']=img;
        r.push(obj)
        }
    });
    return r;
  }
});

Template.gallery.rendered = function() {

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
    $(".fancybox").fancybox({
      helpers : {
        title: {
          type: 'inside'
        }
      },
      beforeLoad : function() {
        console.log(this.id)
        this.title = $(this.element).data('info');
      }
    });
  });

}
