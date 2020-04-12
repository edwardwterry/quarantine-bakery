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
  init: "on_counter",
  transitions: [
    { name: "intoOven", from: "on_counter", to: "in_oven" },
    { name: "outOfOven", from: "in_oven", to: "on_counter" },
  ]
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
  $(".bread_oven").hide();

  let baking_time_range = [20.0, 25.0];
  let temperature_range = [60.0, 80.0];
  let temp = 0;

  var tick = new Howl({
    src: ["assets/audio/timer.wav"],
  });
  var door = new Howl({ src: ["assets/audio/door.wav"] });
  $(".oven-door").click(function () {
    console.log("Clicked oven door!");
    door.play();
    if (fsm_door.state == "closed") {
      fsm_door.open();
      stopTimer();
      tick.stop();
    } else {
      fsm_door.close();
      startTimer();
      tick.play();
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
    } else if (temp < temperature_range[0] && fsm_oven_temp.state != "cold") {
      fsm_oven_temp.unheat();
    }
  });

  $(".bread_counter").click(function () {
    console.log('bread loc: ' + fsm_bread_location.state);
    if (fsm_door.state == "opened") {
      fsm_bread_location.intoOven();
      $(".bread_counter").hide();
      $(".bread_oven").show();
    }
  });

  $(".bread_oven").click(function () {
    if (fsm_door.state == "opened") {
      fsm_bread_location.outOfOven();
      $(".bread_counter").show();
      $(".bread_oven").hide();
      getFinalBreadState();
    }
  });

  function getFinalBreadState() {
    
  }

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
    increment();
  }

  function stopTimer() {
    baking = false;
  }

  function toggle(variable) {
    return !variable;
  }

  function increment() {
    if (fsm_bread_location == "in_oven") {
      setTimeout(function () {
        time++;
        console.log("Time: " + time);
        increment();
      }, 100);
    }
  }
});
