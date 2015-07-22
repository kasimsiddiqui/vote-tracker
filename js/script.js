$(document).ready(function() {

  var photos = [];
  var tracker;

  $.ajax({
    url: 'https://api.imgur.com/3/album/DDoWy.json',
    method: 'GET',
    headers: {
      'Authorization': 'Client-ID 940f3a2950b0186'
    }
  })
  .done(function(response) {
    photos = response.data.images;
    tracker = new Tracker();
  })
  .fail(function(error) {
    console.log(error);
  });

  var Photo = function(url) {
    this.url = url;
  };

  var Tracker = function() {
    console.log("creating tracker");
    this.initializePhotos();
    var toLoad = this.loadLocalData();
    if(toLoad) {
      console.log("loading local data");
      photos = this.loadLocalData();
    }
    this.renderComparison();
    this.renderChart();
    this.renderSideChart();
  };

  Tracker.prototype.generateRandom = function(max) {
    return Math.floor(Math.random() * max);
  };

  Tracker.prototype.renderRandomPhoto = function() {
    var random = this.generateRandom(photos.length);
    var photo = '<img src="' + photos[random][0].url + '" />';
    return photo;
  };

  Tracker.prototype.addPhoto = function(photo, index) {
    var photoArray = [photo, 0];
    photos[index] = photoArray;
  }

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

  var theChart = null;
  Tracker.prototype.renderChart = function() {
    var votes1 = this.getVotes($("#photo1 img").attr("src"));
    var votes2 = this.getVotes($("#photo2 img").attr("src"));
    var chartData = {
      labels: ["Cat 1", "Cat 2"],
      datasets: [
        {
          fillColor: "black",
          strokeColor: "black",
          data: [votes1, votes2]
        }
      ]
    };
    var votes = document.getElementById("canvas").getContext("2d");
    if(theChart) {
      theChart.destroy();
    }
    theChart = new Chart(votes).Bar(chartData);
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
    tracker.renderSideChart();
    tracker.renderChart();
  });

  var highlight = function() {
    $('img').click(function(e) {
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
      if($("#photo1 img").hasClass("highlight") || $("#photo2 img").hasClass("highlight")) {
        $('button').show();
      } else {
        $('button').hide();
      }
      tracker.renderChart();
    });
  };

  Tracker.prototype.initializePhotos = function() {
    console.log("initializing the array");
    for(var i = 0; i < photos.length; i++) {
      var photoURL = photos[i].link;
      var photo = new Photo(photoURL);
      this.addPhoto(photo, i);
    };
  };
});
