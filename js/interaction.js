console.log("In Interaction!");

let fsm_door = new StateMachine({
  init: "closed",
  transitions: [
    { name: "open", from: "closed", to: "opened" },
    { name: "close", from: "opened", to: "closed" },
  ],
  methods: {
    onOpen: function () {
      console.log("Opening door");
    },
    onClose: function () {
      console.log("Opening door");
    },
  },
});

let fsm_bread_cook = new StateMachine({
  init: "raw",
  transitions: [
    { name: "collapse", from: "raw", to: "collapsed" },
    { name: "bake", from: "raw", to: "baked" },
    { name: "burn", from: "raw", to: "burned" },
  ],
});

let fsm_bread_location = new StateMachine({
  init: "counter",
  transitions: [
    { name: "into_oven", from: "on_counter", to: "in_oven" },
    { name: "out_of_oven", from: "in_oven", to: "on_counter" },
  ],
});

let fsm_oven_temp = new StateMachine({
  init: "cold",
  transitions: [
    { name: "heat", from: "cold", to: "ok" },
    { name: "overheat", from: "ok", to: "overheated" },
    { name: "unoverheat", from: "overheated", to: "ok" },
    { name: "unheat", from: "ok", to: "cold" },
  ],
  methods: {
    onHeat: function () {
      console.log("Heat OK");
    },
    onOverheat: function () {
      console.log("Overheated");
    },
  },
});

$(document).ready(function () {
  let baking_time_range = [20.0, 25.0];
  let temperature_range = [60.0, 80.0];
  let temp = 0;

  var tick = new Howl({
    src: ["assets/audio/tick.wav"],
  });
  var ding = new Howl({ src: ["assets/audio/ding.wav"] });
  var door = new Howl({ src: ["assets/audio/door.wav"] });
  $(".oven-door").click(function () {
    console.log("Clicked oven door!");
    // if (door_open && !bread_in_oven) {
    //   // put bread in oven
    // } else if (!door_open && bread_in_oven) {
    //   // if not baking, start baking and timer
    //   if (!baking) {
    //     startTimer();
    //   } else {
    //     stopTimer();
    //   }
    // } else if (!door_open && !bread_in_oven) {
    //   // open door
    // } else if (door_open && bread_in_oven) {
    //   // do nothing
    // }
    door.play();
    if (fsm_door.state == "closed"){
      fsm_door.open();
    } else {
      fsm_door.close();
    }
    console.log("Door state: " + fsm_door.state);
  });

  $("#tempUp").click(function () {
    temp += 20;
    $("#temperature").html(temp);
    console.log(fsm_oven_temp.state);
    if (
      temp >= temperature_range[0] &&
      temp <= temperature_range[1] &&
      fsm_oven_temp.state != "ok"
    ) {
      fsm_oven_temp.heat();
    } else if (
      temp > temperature_range[1] &&
      fsm_oven_temp.state != "overheated"
    ) {
      fsm_oven_temp.overheat();
    }
  });

  $("#tempDown").click(function () {
    temp -= 20;
    $("#temperature").html(temp);
    console.log(fsm_oven_temp.state);
    if (
      temp >= temperature_range[0] &&
      temp <= temperature_range[1] &&
      fsm_oven_temp.state != "ok"
    ) {
      fsm_oven_temp.unoverheat();
    } else if (
      temp < temperature_range[0] &&
      fsm_oven_temp.state != "cold"
    ) {
      fsm_oven_temp.unheat();
    }
  });

  $("#tempDown").click(function () {
    temp -= 20;
    $("#temperature").html(temp);
    console.log(fsm_oven_temp.state);
    if (
      temp >= temperature_range[0] &&
      temp <= temperature_range[1] &&
      fsm_oven_temp.state != "ok"
    ) {
      fsm_oven_temp.unoverheat();
    } else if (
      temp < temperature_range[0] &&
      fsm_oven_temp.state != "cold"
    ) {
      fsm_oven_temp.unheat();
    }
  });

  function getRangeStatus(value, range) {
    if (value < range[0]) {
      return 0;
    } else if (value > range[1]) {
      return 2;
    } else {
      return 1;
    }
  }

  let baked = false;
  function determineOutcome(time) {
    return outcomes[getRangeStatus(time, baking_time_range)];
  }

  // https://www.youtube.com/watch?v=kDnfrlK2CLg&t=315s
  let time = 0;
  let baking = false;

  function startTimer() {
    baking = true;
    increment();
  }

  function stopTimer() {
    baking = false;
  }

  function toggle(variable) {
    return !variable;
  }

  function increment() {
    if (baking) {
      setTimeout(function () {
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
