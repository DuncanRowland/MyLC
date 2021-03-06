MakeInfoboxes = function(vote) {

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

  var doc={};
  var sitenum=0;
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
"    <div class='miw-title'><a target='_blank' href='"+location['url']+"'>"+location['name']+"</a></div>"+
"    <div class='miw-location-image-div'>"+
"      <img class='miw-img-fill-div' src='"+url+"'></img>"+
"    </div>"+
"    <div class='miw-items-wrapper'>";
    featuredLocations[lid].forEach(function(item) {
      var img = Images.findOne({_id: item['imageid']});
      var url = img.url({store:'thumbs'});
        h=h+
"      <div class='miw-item-image-div'>"+
"        <img class='miw-img-fill-div' src='"+url+"'></img>"+
"      </div>"
    });
    h=h+
"    </div>"+
"  </div>"+
"</body>";

    var site={};
    site['html']=h;
    site['lat']=Number(location['lat']);
    site['lng']=Number(location['lng']);
    doc[sitenum]=site;
    sitenum++;
  } //lid in featuredLocations

  return doc;
}
