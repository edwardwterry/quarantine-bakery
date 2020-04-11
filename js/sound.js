console.log("In sound.js");

var tick = new Howl({src: ['../assets/audio/tick.wav']});
  var ding = new Howl({ src: ['../assets/audio/ding.wav']});
  var door = new Howl({ src: ['../assets/audio/door.wav']});


$('.toast').click(function () {
    console.log("Clicked toast!");


    ding.play();
});