Template.googlemap.onRendered(function() {
  GoogleMaps.load();
});

Template.googlemap.onCreated(function() {

try {

  GoogleMaps.ready('exampleMap', function(map) {

    var infowindow = new google.maps.InfoWindow();

    LatestVote.find({"_id":FlowRouter.current().params.userid}).observe({
      added: function(document) {

        var latest = document['latest'];

        var sitenum = 0;
        while(latest[sitenum]!=undefined) {
          var thissite = latest[sitenum]
          var thishtml=thissite['html'];
          var thislat=thissite['lat'];
          var thislng=thissite['lng'];
          sitenum++;

          var newmarker =  new google.maps.Marker({
            position: {lat: thislat, lng: thislng},
            map: map.instance,
            htmlString: thishtml
          });

          newmarker.addListener('click', function() {
            //$('#fancyboxholder').html(this.htmlString);
            $.fancybox({
              'autoScale': true,
              'transitionIn': 'elastic',
              'transitionOut': 'elastic',
              'speedIn': 500,
              'speedOut': 300,
              'autoDimensions': true,
              'centerOnScroll': true,
              'content' : "HI"+this.htmlString
            });
            console.log(this.htmlString);
            //infowindow.setContent(this.htmlString);
            //infowindow.open(map.instance, this);
          });

        }
      }
    }); //LatestVote.find
  }); //GoogleMaps.ready

} catch(err) { console.log(err); }

}); //Template.googlemap.onCreated

Template.googlemap.helpers({
  exampleMapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: {lat: 53.22, lng: -0.54},
//new google.maps.LatLng(53.22, -0.54),
        zoom: 12
      };
    }
  }
});

Template.results.rendered = function() {
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.5&appId=1657697167840424";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  !function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        p = /^http:/.test(d.location) ? 'http' : 'https';
    if (!d.getElementById(id)) {
        js = d.createElement(s);
        js.id = id;
        js.src = p + '://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js, fjs);
    }
}(document, 'script', 'twitter-wjs');
};
