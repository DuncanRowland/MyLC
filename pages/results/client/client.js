Template.results.helpers({
  results: function () {
    // Get all votes
    var r = [];
    var votenum = 0
    var result = Votes.find();
    result.forEach(function(entry) {
      votenum += 1;
      var text = "#"+votenum+": ";
      var rank = 0;
      while(entry[rank]!=undefined) {
          _id = Items.findOne({_id: entry[rank]})
          if(_id===undefined) {
            text += "?, ";
          } else {
            text += _id.text + ", ";
          }
        rank+=1;
        }
      var commentText = "none";
      if(entry["comment"]!=undefined) {
        commentText = entry["comment"];
      }
      obj = {preferences: text, comment: commentText};
      r.push(obj);
    });
    return r;
  }
});
