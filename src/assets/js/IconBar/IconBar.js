console.log("listening iconbar");
$("#dashboardButton").click(function() {
  $("#mainHeading").text("Dashboard");
  $(".Batches_").fadeOut("fast");
  $(".Student_").fadeOut("fast");
  $(".Schedule_").fadeOut("fast");
  $(".Video_").fadeOut("fast");
  $(".Lecture_").fadeOut("fast");
  $(".Settings_").fadeOut("fast");
  $(".Notes_").fadeOut("fast");

  $(".Dashboard_").fadeIn("fast");

  return false;
});

$("#batchesButton").click(function() {
  $("#mainHeading").text("Batches");
  $(".Dashboard_").fadeOut("fast");
  $(".Student_").fadeOut("fast");
  $(".Schedule_").fadeOut("fast");
  $(".Video_").fadeOut("fast");
  $(".Lecture_").fadeOut("fast");
  $(".Settings_").fadeOut("fast");
  $(".Notes_").fadeOut("fast");

  $(".Batches_").fadeIn("fast");

  return false;
});

$("#studentButton").click(function() {
  $("#mainHeading").text("Students");
  $(".Dashboard_").fadeOut("fast");
  $(".Batches_").fadeOut("fast");
  $(".Schedule_").fadeOut("fast");
  $(".Video_").fadeOut("fast");
  $(".Lecture_").fadeOut("fast");
  $(".Settings_").fadeOut("fast");
  $(".Notes_").fadeOut("fast");

  $(".Student_").fadeIn("fast");

  return false;
});

$("#ScheduleButton").click(function() {
  $("#mainHeading").text("Schedule");
  $(".Dashboard_").fadeOut("fast");
  $(".Batches_").fadeOut("fast");
  $(".Student_").fadeOut("fast");
  $(".Video_").fadeOut("fast");
  $(".Lecture_").fadeOut("fast");
  $(".Settings_").fadeOut("fast");
  $(".Notes_").fadeOut("fast");

  $(".Schedule_").fadeIn("fast");

  return false;
});

$("#videoButton").click(function() {
  $("#mainHeading").text("Video");
  $(".Dashboard_").fadeOut("fast");
  $(".Batches_").fadeOut("fast");
  $(".Student_").fadeOut("fast");
  $(".Schedule_").fadeOut("fast");
  $(".Lecture_").fadeOut("fast");
  $(".Settings_").fadeOut("fast");
  $(".Notes_").fadeOut("fast");

  $(".Video_").fadeIn("fast");

  return false;
});

$("#lectureButton").click(function() {
  $("#mainHeading").text("Lectures");
  $(".Dashboard_").fadeOut("fast");
  $(".Batches_").fadeOut("fast");
  $(".Student_").fadeOut("fast");
  $(".Schedule_").fadeOut("fast");
  $(".Video_").fadeOut("fast");
  $(".Settings_").fadeOut("fast");
  $(".Notes_").fadeOut("fast");

  $(".Lecture_").fadeIn("fast");

  return false;
});

$("#settingsButton").click(function() {
  $("#mainHeading").text("Settings");
  $(".Dashboard_").fadeOut("fast");
  $(".Batches_").fadeOut("fast");
  $(".Student_").fadeOut("fast");
  $(".Schedule_").fadeOut("fast");
  $(".Video_").fadeOut("fast");
  $(".Lecture_").fadeOut("fast");
  $(".Notes_").fadeOut("fast");

  $(".Settings_").fadeIn("fast");

  return false;
});

$("#notesButton").click(function() {
  $("#mainHeading").text("Notes");

  $(".Dashboard_").fadeOut("fast");
  $(".Batches_").fadeOut("fast");
  $(".Student_").fadeOut("fast");
  $(".Schedule_").fadeOut("fast");
  $(".Video_").fadeOut("fast");
  $(".Lecture_").fadeOut("fast");
  $(".Settings_").fadeOut("fast");

  $(".Notes_").fadeIn("fast");

  return false;
});
