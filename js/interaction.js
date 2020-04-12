console.log("In Interaction!")

$(document).ready(function() {

    let baking_time_range = [10.0, 15.0]
    let temperature_range = [400.0, 425.0]

    var tick = new Howl({
  src: ['assets/audio/tick.wav']
});
var ding = new Howl({ src: ['assets/audio/ding.wav']});
var door = new Howl({ src: ['assets/audio/door.wav']});
$('.oven-handle').click(function () {
      console.log("Clicked oven door!");
      if (door_open && !bread_in_oven){
        // put bread in oven
      } else if (!door_open && bread_in_oven){
        // if not baking, start baking and timer
        if (!baking) {
          startTimer();
        } else {
          stopTimer();
        }
      } else if (!door_open && !bread_in_oven){
        // open door
      } else if (door_open && bread_in_oven){
        // do nothing
      }
      door.play();
});

function getRangeStatus(value, range){
  if (value < range[0]){
    return 0;
  } else if (value > range[1]){
    return 2;
  } else {
    return 1;
  }
}

let door_open = false;
let bread_in_oven = false;
let outcomes = ['undercooked', 'ok', 'burned']
let baked = false;
function determineOutcome(time){
  return outcomes[getRangeStatus(time, baking_time_range)];
}

// https://www.youtube.com/watch?v=kDnfrlK2CLg&t=315s
let time = 0;
let baking = false;

function startTimer(){
  baking = true;
  increment();
}

function stopTimer(){
  baking = false;
}

function toggle(variable){
  return !variable;
}

function increment(){
  if (baking){
    setTimeout(function() {
      time++;
      console.log("Time: " + time);
      increment();
    }, 100);
  }
}
// close the door
// start the timer
// open the door
// check the difference between opened-closed, compare to range

  });