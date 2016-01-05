Template.googlemap.onRendered(function() {
  GoogleMaps.load();
});

Template.googlemap.onCreated(function() {
  GoogleMaps.ready('exampleMap', function(map) {

    var infowindow = new google.maps.InfoWindow();

    LatestVote.find({"_id":FlowRouter.current().params.userid}).observe({
      added: function(document) {
        Votes.find({"_id":document["latest"]}).observe({
          added: function(document) {
            var vote = document;

            var rank = 0;
            var featuredLocations = {};
            while(vote[rank]!=undefined) {
              var item = Items.findOne({_id: vote[rank]})
              if(item!=undefined) {
                var lid = item.locationid;
                if(!(lid in featuredLocations)) { featuredLocations[lid]=[] }
                featuredLocations[lid].push(item);
              }
              rank++;
            }

            for (var lid in featuredLocations) {
              var location = Locations.findOne({_id:lid});
              var img = Images.findOne({_id: location['imageid']});
              var url = img.url({store:'images'});

              var h=""+ //css for googlemap info window
"<head>"+
"  <style>"+
"    .miw-title {"+
//"      background-color: green;"+
"      text-align: center;"+
"      font-size: 20px;"+
"      padding-top: 10px;"+
"      padding-bottom: 5px;"+
"    }"+
"    .miw-wrapper {"+
//"      background-color: linen;"+
"      width: 250px;"+
//"      height: 350px;"+
"      font-size: 0px;"+
"      padding-left: 0px;"+
"      padding-bottom: 24px;"+
"    }"+
"    .miw-location-image-div {"+
//"      background-color: green;"+
"      width: 200px;"+
//"      height: 200px;"+
"      margin: auto;"+
"      padding-bottom: 12px;"+
"    }"+
"    .miw-items-wrapper {"+
//"      background-color: black;"+
"      text-align: center;"+
"      margin: auto;"+
"    }"+
"    .miw-item-image-div {"+
"      border-style: solid;"+
"      border-width: 1px;"+
//"      background-color: blue;"+
"      width: 23px;"+
"      height: 23px;"+
"      margin: auto;"+
"      display: inline-block;"+
"    }"+
"    .miw-img-fill-div {"+
"      width: 100%;"+
"      height: 100%;"+
"    }"+
"</style>"+
"</head>"+
"<body>"+
"  <div class='miw-wrapper'>"+
"    <div class='miw-title'><a target='_blank' href="+location['url']+">"+location['name']+"</a></div>"+
"    <div class='miw-location-image-div'>"+
"      <img class='miw-img-fill-div' src="+url+"></img>"+
"    </div>"+
"    <div class='miw-items-wrapper'>";
              featuredLocations[lid].forEach(function(item) {
                var img = Images.findOne({_id: item['imageid']});
                var url = img.url({store:'thumbs'});
                    h=h+
"      <div class='miw-item-image-div'>"+
"        <img class='miw-img-fill-div' src="+url+"></img>"+
"      </div>"
              });
              h=h+
"    </div>"+
"  </div>"+
"</body>";
              var newmarker =  new google.maps.Marker({
                position: {lat: Number(location['lat']), lng: Number(location['lng'])},
                map: map.instance,
                htmlString: h
              });

              newmarker.addListener('click', function() {
                infowindow.setContent(this.htmlString);
                infowindow.open(map.instance, this);
              });

            }
          }
        }); //Votes.find
      }
    }); //LatestVote.find
  }); //GoogleMaps.ready
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
