var Photo = function(url){
  this.url = url;
}

var Tracker = function(){
  this.photos = [];
}

Tracker.prototype.generateRandom = function(numPhotos) {
  return Math.floor(Math.random() * numPhotos);
};

Tracker.prototype.pickRandomPhoto = function(){
  return this.generateRandom(this.photos.length);
};

Tracker.prototype.renderRandomPhoto = function() {
  var random = this.pickRandomPhoto();
  var photo = '<img src="' + this.photos[random][0].url + '" />' + this.photos[random][1];
  return photo;
};

Tracker.prototype.addPhoto = function(photo) {
  var photoArray = [photo,0];
  this.photos.push(photoArray);
};

Tracker.prototype.renderComparison = function(){
  var photo1 = this.renderRandomPhoto();
  var photo2 = this.renderRandomPhoto();
  while(photo1 == photo2){
    console.log("the photos were the same!");
    var photo1 = this.renderRandomPhoto();
    var photo2 = this.renderRandomPhoto();
  }
  $('#photo1').html(photo1);
  $('#photo2').html(photo2);
  highlight();
};

Tracker.prototype.findPhotoInArray = function(url) {
  console.log(url);
  for(var i = 0; i < this.photos.length; i++){
    if(this.photos[i][0].url == url){
      return i;
    }
  }
  return false;
};

Tracker.prototype.incrementVote = function(photo){
  var index = this.findPhotoInArray(photo);
  this.photos[index][1]++;
};

$(document).ready(function(){
  $('button').click(function(){
    testTracker.incrementVote($('.highlight').attr('src'));
    $('button').css({'visibility':'hidden'});
    testTracker.renderComparison();
  });
});

var highlight = function(){
  $(document).ready(function(){
    $('img').click(function(){
    $('button').css({'visibility':'visible'});
    $('.highlight').removeClass('highlight');
    $(this).toggleClass('highlight');
    });
  });
}

var testTracker = new Tracker();
testTracker.generateRandom(14);
for(var i = 0; i <= 13; i++) {
  var photoURL = "img/" + i + ".jpg";
  var photo = new Photo(photoURL);
  testTracker.addPhoto(photo);
};
testTracker.renderComparison();
