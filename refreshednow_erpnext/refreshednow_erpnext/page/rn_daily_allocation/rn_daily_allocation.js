frappe.provide("refreshednow_erpnext.rn_calendar");

frappe.pages['rn-daily-allocation'].on_page_load = function(wrapper) {	
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Daily Allocation',
		single_column: true
	});


	frappe.require(["assets/refreshednow_erpnext/js/lib/fullcalendar.min.js", 
		"assets/refreshednow_erpnext/js/lib/fullcalendar.min.css",
		"assets/refreshednow_erpnext/js/lib/scheduler.min.js", 
		"assets/refreshednow_erpnext/js/lib/scheduler.min.css"], 
		function() { 

			frappe.call({
				args: {
					date: "2016-12-07"
				},
				method: "refreshednow_erpnext.api.get_cleaners",
				callback: function(r) {

					console.log(r);

					var resources = r.message;
					var options = prepare_options(resources);

					cal = new refreshednow_erpnext.RNCalendar(options, page, "refreshednow_erpnext.api.get_timeslots");
					cal.filters = [
									{
										"fieldtype": "Link",
										"fieldname": "service_type",
										"options": "Item",
										"label": __("Service Type")
									},
									{
										"fieldtype": "Date",
										"fieldname": "scheduled_date",
										"label": __("Date")
									},
								];
					//cal.get_events_method = "refreshednow_erpnext.api.get_timeslots";
					cal.add_filters();
					cal.set_filters_from_route_options()
					page.fields_dict["service_type"].get_query = function() {
						return {
							"filters": {
								"item_group": "Services"
							}
						}
					}
				}
			});
		});
	}


function prepare_options(resources) {
	return	{
		header:{
			left: null,
			center: 'title',
			right: null
		},
		schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
		allDaySlot: false,
		selectHelper: true,
		forceEventDuration: true,
		defaultView: "agendaDay",
		snapDuration: "01:00:00",
		minTime: "10:00:00",
		maxTime: "16:00:00",
		eventStartEditable: true,
		eventDurationEditable: true,
		resources: resources,
		selectAllow: function(selectInfo) {
			console.log(selectInfo);
		},
		eventClick: function(calEvent, jsEvent, view) {

			alert('Event: ' + calEvent.title);
			alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
			alert('View: ' + view.name);

			// change the border color just for fun
			$(this).css('border-color', 'green');

		}
	}
}



