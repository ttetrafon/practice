// https://www.tutorialrepublic.com/jquery-tutorial/
import './jquery.js'; // .js so that it is imported properly...
// var $j = jQuery.noConflict(); // Use this when other libraries need to use '$'.

$(document).ready(function() {
    $("h1").css("color", "#0088ff"); // Selects all h1 and changes their colour.
    $("#p1").text("The page loaded, time to say hello!"); // Selects the id 'p1' and changes its text.
    $('input[type="text"]').css("background-color", "yellow"); // Selects all input of type text and changes their background colour.
    $("ul li").css("background-color", "red"); // Selects all 'li' elements within an 'ul' element (compound selector).
    $("ul li").css("color", "green");

    $("#i1").val("ttetrafon");
    $("#b1").click(function() { hiButtonClicked(); }); // Adds an event.
    // Events:
    //      Document: ready(), resize(), scroll()
    //      General: focus(), blur(), change()
    //      Mouse: click(), dblclick(), hover(), mouseenter(), mouseleave()
    //      Keyboard: keypress(), keydown(), keyup()
    //      Forms: submit()
    $("#p3").hover(function() { addHighlight($(this)); }, function() { removeHighlight($(this)); });

    $("#b2").click(function() { $("#p4").show('slow') }); // hide adds 'display: none' to the element, while show removes it.
    $("#b3").click(function() { $("#p4").hide('fast') }); // Also: show(), hide(50), toggle(1000): no param -> instantaneous; numeric param -> animation time in ms; 'slow' = 200ms, 'fast' = 600ms
    $("#b4").click(function() { $("#p4").toggle() }); // toggle combines show & hide

    // .fadeIn(), .fadeOut(), fadeToggle(), .fadeTo(speed, opacity, callback): to change an element's opacity
    // All can take speed and a callback: .fadeIn('slow', function() {})

    // .slideUp(speed, callback), .slideDown(speed, callback), slideToggle(speed, callback): hide/show element by changing its height

    // .animate({ properties }, duration, callback); animate css numeric properties (e.g.: width, height, margin, padding, opacity, top, left, etc)
    $("#b5").click(function() { $("#p5").animate({"marginLeft": "100px", "opacity": 0.5}, 1000) }); // toggle combines show & hide
    $("#b6").click(function() { $("#p5").animate({"marginLeft": "0px", "opacity": 1}, 1000) }); // toggle combines show & hide
    // Can use .animate().animate()... to sequence animations.
    // Can use "+=50px" to amend properties relative to the current value.

    // .stop(bool stopAll, bool goToEnd): stop/finish (goToEnd) immediately current/all (stopAll) animations running on the element
    // .stop(true, true) should be used before other animations are invoked (like on hover) to avoid issues with fast triggers (mouse movement for example) going off: .stop(true, true).fadeOut();

    // .text(), attr(), .html(), .val(): can be used as getters and setters (just provide the new value as parameter)
    $("#b7").click(function() { alert($("#a1").attr("href")); });

    // .append(), prepend(), before(), after(): add content to an element
    // .wrap(): add an element wrapping the selected element
    // .empty(), .remove(), .unwrap(), .removeAttr(): remove content

    // Traversing the document:
    //      Ancestors: .parent(), .parents(), .parentsUntil(),
    //      Descendants: children(), .find()
    //      Siblings: .siblings(), .next(), .nextAll(), .nextUntil(), prev(), .prevAll(), .prevUntil()
    //      Filtering: .first(), .last(), .eq(), .filter(), has(), .not(), slice()

    // Ajax
    //  .load(URL, data, function(responseTxt, statusTxt, jqXHR)): loads data from the server and place the returned HTML into the selected element
    //      The URL can be appended with a selector to filter the results (e.g.: .load("test-content.html #hint");)
    //  $.get(URL, data, function(data)), $.post(URL, data, function(data))
});

async function hiButtonClicked() {
    // console.log("---> hiButtonClicked()");
    let text = $("#p2").text();
    let val = $("#i1").val();
    if (text === "") {
        $("#p2").text("Hello " + (val && (val !== '') ? val : "there") + "!");
    }
    else {
        $("#p2").text("");
    }
}

async function addHighlight(element) {
    // console.log("---> addHighlight()", element);
    element.addClass("highlight");
}
async function removeHighlight(element) {
    // console.log("---> removeHighlight()", element);
    element.removeClass("highlight");
}
// Can use .toggleClass() instead of addClass/removeClass