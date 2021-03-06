// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");

    $("#articles").append(
  '<div class="card">' + 
    '<div class="card-image waves-effect waves-block waves-light">' +
      '<img class="activator" src="http://www.sc.argentum.org/wp-content/uploads/2013/04/newspaper-stack_9801-200x200.jpg">' +
    '</div>' +
    '<div class="card-content">' +
      '<span class="card-title activator grey-text text-darken-4">' + data[i].title + '<i class="material-icons right"></i></span>' +
      '<p><a href="' + data[i].link + '">Read the article here      </a></p>' +
    '</div>' +
    '<div class="card-reveal">' +
      '<span class="card-title grey-text text-darken-4">' +
      data[i].title + '<i class="material-icons right">close</i></span>' +
      '<p data-id='+ data[i]._id+'>Click to leave a comment!</p>' +
      '<div id='+data[i]._id+'></div>' +
    '</div>' +
  '</div>'
    )

  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#"+thisId+"").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#"+thisId+"").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#"+thisId+"").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#"+thisId+"").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      console.log(data);
      $.ajax({
        method: "GET",
        url:"/notes/" + thisId,
        data: {
          title: $("#titleinput").val(),
          body: $("#bodyinput").val()
        }
      }).done(function(data){
        $("#articles").append("<h5>" + data.title + "</h5>");
        $("#articles").append("<p>" + data.body + "</p>");

        if(data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
          console.log(data.note);
        }
      })
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
