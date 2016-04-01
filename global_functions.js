$(document).ready(function() {

	// Declare this variable here so it's accessible everywhere.
	var employees;

	// Open our data file and pass the contents to our custom callback function below.
	$.get('gpDirectory.csv', insertData);

	// The $.get function above is asynchronous, so we do the work inside here
	// or it could try using our variable before the file is done loading.
	function insertData (data) {

		// Parse the CSV formated data into JSON objects.
		// employees = csvJSON(data);
		employees = $.csv.toObjects(data);


/* ------- LIST VIEW ------- */

		// Render our employee table using the template.
		var sourceTemplate = "#contactListEntryTemplate";
		$(sourceTemplate).tmpl(employees).appendTo("#contactList").find("tbody");

		// Fill non-existent data with a blank space to preven empty cells from looking funny in some browsers.
		var spaceChar = "\xa0";
		$('#contactList td:empty').append(spaceChar);
	

		// Make the table sortable.
		// See https://datatables.net/
		$('#contactList').DataTable( {
			autoWidth: false,
			paging: false,
			"order": [[ 0, 'asc' ], [ 2, 'asc' ]]
		});

		// Set the search box field to be automatically selected when the page first loads.
		// We would do this in HTML but the input is being created by the DataTable function above.
// This should be a specific ID, there could be more than one input element in the DOM.
		$('input').focus();


		// Wire up our check boxes to filter out rows based on the location.
		$('#showShreveport').change(function(){
				if ($(this).is(':checked')) {
					$("tr td:contains('Shreveport')").each(function() { $(this).closest('tr').show(); });
				} else {
					$("tr td:contains('Shreveport')").each(function() { $(this).closest('tr').hide(); });
				}
		});
		$('#showTyler').change(function(){
				if ($(this).is(':checked')) {
					$("tr td:contains('Tyler')").each(function() { $(this).closest('tr').show(); });
				} else {
					$("tr td:contains('Tyler')").each(function() { $(this).closest('tr').hide(); });
				}
		});
		$('#nonPeopleOnly').change(function(){
				if ($(this).is(':checked')) {
					$("tr td:contains('Tyler')").each(function() { $(this).closest('tr').show(); });
				} else {
					$("tr td:contains('Tyler')").each(function() { $(this).closest('tr').hide(); });
				}
		});


		// This trick allows us to drag-select text for copy/paste without invoking the click event.
		$(function() {
			var counter = 0;
			var isDragging = false;

			$('#contactList tbody tr')
			.mousedown(function() {
		 		$(window).mousemove(function() {
					isDragging = true;
					$(window).unbind("mousemove");
				});
			})
			.mouseup(function() {
				var wasDragging = isDragging;
				isDragging = false;
				$(window).unbind("mousemove");
					if (!wasDragging) {
						var targetID = $(this).closest('tr').attr('id');
						displayContactCard(employees, targetID);
					}
				});
			});

		// Keep from popping up the contact card when we're clicking on a link.
		$('#contactList a').on('click', function(e) {
			e.stopPropagation();
		});


/* ------- PHOTO VIEW ------- */

		// Render our employee photos using the template.
		var sourceTemplate = "#employeePortraitTemplate";
		$(sourceTemplate).tmpl(employees).appendTo("#photo_view");


		// MAP VIEW
		// Render our employees list using the template.
			var sourceTemplate = $("#list_item_template");
			$(sourceTemplate).tmpl(employees).appendTo("#list_pane");


	} // insertData()


























/* ------- LIST VIEW ------- */

	function displayContactCard(personList, personID) {
		
		$('.contactCard').remove(); // Make sure we aren't creating more than one card.

// Why am I having to do this for scope to be correct??
		var personList = personList;
		var personID = personID;

		// Find the person object we want from the full list.
		var personObject = findPerson(personList, personID);

		// Render that person using the contact card template.
		var sourceTemplate = "#contactCardTemplate";
		$(sourceTemplate).tmpl(personObject).appendTo("body");

//					$('.contactCard').draggable({cursor: 'move'});

//					$('.contactCard').dimBackground({ darkness : 0.5 } );	// 0: no dimming, 1: completely black




		$('#closeCardButton').on('click', function(e) {
			e.preventDefault(); // So the anchor doesn't jump us up the page.
			$(this).closest('.contactCard').remove();
			//$.undim();
			//$.undim(); // Because for some reason the function is running twice?
		});
		

		$('.personPhoto').on('click', function(e) {
			e.preventDefault();
			var sourceTemplate = "#bigPhotoTemplate";
			$(sourceTemplate).tmpl(personObject).appendTo("body");

			// Close photo when we click anywhere.
			$('.bigPhoto').on('click', function (e) { $(this).remove(); });

			//$.undim();
			//$('.bigPhoto').parent().draggable;
		});


		function findPerson (personList, personID) {
			
			for (var i = 0, len = personList.length; i < len; i++) {
				if (personList[i].itemID == personID) {
					return personList[i]; // Return as soon as the object is found.
				}
			}
			return null; // The object was not found.
		}

	} // displayContactCard()




















/* ------- PHOTO VIEW ------- */

$('#startGravityButton').on('click', function() { // This can be changed to anything you like in order to trigger jGravity effect
		$('body').jGravity({ // jGravity works best when targeting the body
			target: 'img', // Enter your target critera e.g. 'div, p, span', 'h2' or 'div#specificDiv', or even 'everything' to target everything in the body
			ignoreClass: 'ignoreGravity', // Specify if you would like to use an ignore class, and then specify the class
			weight: 25, // Enter any number 1-100 ideally (25 is default), you can also use 'heavy' or 'light'
			depth: 1, // Enter a value between 1-10 ideally (1 is default), this is used to prevent targeting structural divs or other items which may break layout in jGravity
			drag: true // Decide if users can drag elements which have been effected by jGravity
		});

	}); // #startGravityButton click action

















/* ------- MAP VIEW ------- */

// Need to stop propogation.
	$(".list_entry").click(showCard);

	// Clear the text box when the X button is clicked.
	$("#search_box_clear").click(function () {
		$("#search_box").val("");
		filterList();
	});

	// Attach the filter function to search box.
	$("#search_box").keyup(filterList);

	// Show only entries that match the search field.
	function filterList() {
		var needle = $("#search_box").val();

		if (needle) {	
			
			$("#list_pane").find("li:not(:contains(" + needle + "))").slideUp();
			$("#list_pane").find("li:contains(" + needle + ")").slideDown();
// hide map pins

		} else {
			// Search for nothing, receive everything.
			$('#list_pane li').show();
// show all map pins
		}
	} // filterList()


	// Override the standard jQuery "contains" to be case insensitive.
	$.expr[":"].contains = $.expr.createPseudo(function(arg) {
			return function( elem ) {
			return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
		};
	});


	function showCard() {
		
		console.log("click!\n");

		// Remove any already existing card just in case.
		$(".contact_card").remove();
		
		// Add a new contact card to the map pan.
		$("#card_template").tmpl(list_items[0]).appendTo("#map_pane");

		// Drop it down.
		$("#contact_card").slideDown(700,"easeOutBounce");
		
	} // showCard();


// Inlining the SVG breaks the panzoom?

	// Convert the linked SVG file into inline SVG code.
	// This lets us easily change properties with CSS.
	// https://github.com/createlogic/InlineSVG
	//$(".svg").inlineSVG();


	// Enable panning and zooming on the SVG map.
	// https://github.com/timmywil/jquery.panzoom
	$("#office_map").panzoom({
		// OPTIONS
	});

	// Enable mouse wheel zooming
	$panzoom = $("#office_map");

	$panzoom.on('mousewheel.focal', function( e ) {
		e.preventDefault();
		var delta = e.delta || e.originalEvent.wheelDelta;
		var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
		$panzoom.panzoom('zoom', zoomOut, {
			increment: 0.1,
			animate: false,
			focal: e
		});
	});

	// Wire up the zoom control icons.
	$("#zoom_in").click( function() {
		$panzoom.panzoom("zoom");
	});
	$("#zoom_reset").click( function() {
		$panzoom.panzoom("reset");
	});
	$("#zoom_out").click( function() {
		$panzoom.panzoom("zoom", true); // Boolean indicates zoom OUT 
	});












}); // $(document).ready()