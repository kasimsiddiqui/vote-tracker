$(document).ready(function() {

  var photos = [];

  var Photo = function(url) {
    this.url = url;
    this.addPhoto();
  };

  var Tracker = function() {
    photos = this.loadLocalData();
    if(!photos || photos == []) {
      photos = [];
      initializePhotos();
    }
    this.renderComparison();
    this.renderChart();
  };

  Tracker.prototype.generateRandom = function(max) {
    return Math.floor(Math.random() * max);
  };

  Tracker.prototype.pickRandomPhoto = function() {
    return this.generateRandom(photos.length);
  };

  Tracker.prototype.renderRandomPhoto = function() {
    var random = this.generateRandom(photos.length);
    var photo = '<img src="' + photos[random][0].url + '" />';
    return photo;
  };

  Photo.prototype.addPhoto = function() {
    var photoArray = [this, 0];
    photos.push(photoArray);
  };

  Tracker.prototype.renderComparison = function() {
    this.saveLocalData();
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

  var ctx = null;
  Tracker.prototype.renderChart = function() {
    var left = this.getVotes($("#photo1 img").attr("src"));
    var right = this.getVotes($("#photo2 img").attr("src"));
    var chartData = {
      labels: ["left", "right"],
      datasets: [
        {
          fillColor: "black",
          strokeColor: "black",
          data: [left, right]
        }
      ]
    };
    var votes = document.getElementById("canvas").getContext("2d");
    if(ctx) {
      ctx.destroy();
    }
    ctx = new Chart(votes).Bar(chartData);
  };

  Tracker.prototype.findPhotoInArray = function(url) {
    for(var i = 0; i < photos.length; i++) {
      if(photos[i][0].url == url) {
        return i;
      }
    }
    return false;
  };

  Tracker.prototype.incrementVote = function(photo) {
    var index = this.findPhotoInArray(photo);
    photos[index][1]++;
  };

  Tracker.prototype.decrementVote = function(photo) {
    var index = this.findPhotoInArray(photo);
    photos[index][1]--;
  };

  Tracker.prototype.getVotes = function(photo) {
    var index = this.findPhotoInArray(photo);
    return photos[index][1];
  };

  Tracker.prototype.saveLocalData = function() {
    localStorage.setItem("photos", JSON.stringify(photos));
  };

  Tracker.prototype.loadLocalData = function() {
    return JSON.parse(localStorage.getItem("photos"));
  }

  $('button').hide();
  $('button').click(function() {
    $('button').hide();
    tracker.renderComparison();
    tracker.renderChart();
  });

  var highlight = function() {
    $('img').click(function(e) {
      $('button').show();
      var url = e.target.getAttribute("src");
      var currentCat = e.target.parentNode.id;
      var otherCat;
      switch(currentCat) {
        case "photo1":
          otherCat = $("#photo2 img").attr("src");
          if($("#photo1 img").hasClass("highlight")) {
            $(this).removeClass("highlight");
            tracker.decrementVote(url);
          } else {
            $(this).addClass("highlight");
            tracker.incrementVote(url);
          }
          if($("#photo2 img").hasClass("highlight")) {
            $("#photo2 img").removeClass("highlight");
            tracker.decrementVote(otherCat);
          }
          break;
        case "photo2":
          otherCat = $("#photo1 img").attr("src");
          if($("#photo2 img").hasClass("highlight")) {
            $(this).removeClass("highlight");
            tracker.decrementVote(url);
          } else {
            $(this).addClass("highlight");
            tracker.incrementVote(url);
          }
          if($("#photo1 img").hasClass("highlight")) {
            $("#photo1 img").removeClass("highlight");
            tracker.decrementVote(otherCat);
          }
          break;
      }
      tracker.renderChart();
    });
  };

  var initializePhotos = function() {
    for(var i = 0; i <= 13; i++) {
      var photoURL = "img/" + i + ".jpg";
      var photo = new Photo(photoURL);
    };
  };
  var tracker = new Tracker();
});
