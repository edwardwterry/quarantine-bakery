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
      console.log("Closing door");
    },
  },
});

let fsm_bread_location = new StateMachine({
  init: "on_counter",
  transitions: [
    { name: "intoOven", from: "on_counter", to: "in_oven" },
    { name: "outOfOven", from: "in_oven", to: "on_counter" },
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
  $(".bread_oven").hide();
  $(".steam").hide();
  $(".bread3__strip").hide();
  let timer = new Timer(1000);

  let baking_time_range = [10.0, 15.0];
  let temperature_range = [400.0, 410.0];
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
      tick.stop();
      if (fsm_bread_location.state == "in_oven") {
        timer.stop();
        let duration = timer.ticks();
        getFinalBreadState(duration);
      }
    } else {
      fsm_door.close();
      if (fsm_bread_location.state == "in_oven") {
        tick.play();
        timer.start();
      }
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
    console.log("bread loc: " + fsm_bread_location.state);
    if (fsm_door.state == "opened") {
      fsm_bread_location.intoOven();
      $(".bread_counter").hide();
      $(".steam__ring").hide();
      $(".bread_oven").show();
    }
  });

  $(".bread_oven").click(function () {
    if (fsm_door.state == "opened") {
      fsm_bread_location.outOfOven();
      $(".bread_counter").show();
      $(".steam__ring").show();
      $(".bread_oven").hide();
      getFinalBreadState();
    }
  });

  function getFinalBreadState(duration) {
    if (fsm_oven_temp.state == "overheated") {
      console.log("Oven was too hot")
      // oven too hot
      // change color of bread_counter to black
      $(".bread_counter").css("background-color", "#AA631B");
      $(".bread_counter").height("10%" );
      $(".bread_counter").width("10%" );
      $(".bread3__strip").css("background-color", "#7F4A16");
      $(".bread3__strip").width("25px");
      $(".bread3__strip").height("50px");
      $(".bread3__strip").show();
    } else if (fsm_oven_temp.state == "cold") {
      console.log("Oven was too cold")
      // oven too cold
      // change bread_counter to collapsed apperance
      $(".bread_counter").css("background-color", "#F7E4C4");
      $(".bread_counter").height("7%" );
      $(".bread_counter").width("9%" );
      $(".bread3__strip").css("background-color", "#F4BEA4");
      $(".bread3__strip").width("10px");
      $(".bread3__strip").height("30px");
      $(".bread3__strip").show();
    } else {
      // temperature was OK
      if (duration < baking_time_range[0]) {
        console.log("Too impatient")
        // not long enough
        // change bread_counter to collapsed apperance
        $(".bread_counter").css("background-color", "#F7E4C4");
        $(".bread_counter").height("7%" );
        $(".bread_counter").width("9%" );
        $(".bread3__strip").css("background-color", "#F4BEA4");
        $(".bread3__strip").width("10px"); 
        $(".bread3__strip").height("30px");
        $(".bread3__strip").show();
      } else if (duration > baking_time_range[1]) {
        console.log("Too long in oven")
        // in for too long
        // change color of bread_counter to black
        $(".bread_counter").css("background-color", "#AA631B");
        $(".bread_counter").height("10%" );
        $(".bread_counter").width("10%" );
        $(".bread3__strip").css("background-color", "#7F4A16");
        $(".bread3__strip").width("25px");
        $(".bread3__strip").height("50px");
        $(".bread3__strip").show();
      } else {
        console.log("Just right!")
        // steamy juicy loaf
        $(".bread_counter").css("background-color", "#F4B651");
        $(".bread_counter").height("11%" );
        $(".bread_counter").width("11%" );
        $(".bread3__strip").css("background-color", "#D48B3A");
        $(".bread3__strip").show();
        $(".steam").show();
      }
    }
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
