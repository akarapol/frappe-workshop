// Copyright (c) 2025, Akarapol Kasvittayanun and contributors
// For license information, please see license.txt

frappe.ui.form.on("Customer", {
	refresh: function(frm) {
		// Add custom button "Customer Balance"
		frm.add_custom_button("Customer Balance", () => {
			checkCustomerBalance(frm)
		});
		frm.add_custom_button("Enable/Disable",()=>{
			toggleCustomerStatus(frm)
		});
	},
	onload: function(frm) {
		togglePersonalCorporate(frm);
	},
	organization_type: function(frm) {
		togglePersonalCorporate(frm);
	},
	country: function(frm) {
		// Set identification type based on country
		const country = frm.doc.country;
		const identificationType = frm.doc.identification_type;

		if (country === "Thailand") {
			// If country is Thailand, identification type must be Personal Identification
			if (identificationType !== "Personal Identification") {
				frm.set_value("identification_type", "Personal Identification");
				frm.refresh_field("identification_type");
			}
		} else {
			// If country is not Thailand, identification type must be Passport
			if (identificationType !== "Passport") {
				frm.set_value("identification_type", "Passport");
				frm.refresh_field("identification_type");
			}
		}
	}
});

frappe.ui.form.on("Customer Address", {
	no: function(frm, cdt, cdn) {
		fill_address(frm, cdt, cdn);
	},
	building: function(frm, cdt, cdn) {
		fill_address(frm, cdt, cdn);
	},
	district: function(frm, cdt, cdn) {
		fill_address(frm, cdt, cdn);
	},
	sub_district: function(frm, cdt, cdn) {
		fill_address(frm, cdt, cdn);
	},
	province: function(frm, cdt, cdn) {
		fill_address(frm, cdt, cdn);
	},
	country: function(frm, cdt, cdn) {
		fill_address(frm, cdt, cdn);
	},
	postal_code: function(frm, cdt, cdn) {
		fill_address(frm, cdt, cdn);
	}	
});

function checkCustomerBalance(frm) {
			// Create a dialog with a date field
			let d = new frappe.ui.Dialog({
				title: "Check Customer Balance",
				fields: [
					{
						fieldtype: "Date",
						fieldname: "as_of_date",
						label: "As Of Date",
						reqd: true,
						default: frappe.datetime.nowdate()
					}
				],
				primary_action: () => {
					values = d.get_values()

					frappe.call({
						method: "balance",
						doc: frm.doc,
						args: {
							as_of_date: values["as_of_date"],
						},
						callback: (r)=>{
							//TODO: call function on server soon.
							console.log(r)
							frappe.msgprint({
									title: __('Customer Balance as of ' + values["as_of_date"]),
									indicator: 'green',
									message: __('<h2>Customer balance is: </h4><h2 style="padding:4px; background-color:#76b8bc; color:white"> ' + r.message + '</h2>')
							});
						}
					})
					frappe.show_alert(__("Request Server to Calculate Customer Balance"))
					// Hide the dialog when the primary button is clicked
					d.hide();
				}
			});
			d.show();
}

function fill_address(frm, cdt, cdn) {
	const row = frappe.get_doc(cdt, cdn);
	let address = '';
	
	if (row.no) address += row.no + ' ';
	if (row.building) address += row.building + ' ';
	if (row.district) address += row.district + ' ';
	if (row.sub_district) address += row.sub_district + ' ';
	if (row.province) address += row.province + ' ';
	if (row.country) address += row.country + ' ';
	if (row.postal_code) address += row.postal_code + ' ';

	row.address = address.trim();
}

function togglePersonalCorporate(frm) {
	const type = frm.doc.organization_type;

	if (type === "Organization") {
		frm.set_df_property("corporate_section", "hidden", 0);
		frm.set_df_property("personal_section", "hidden", 1);
	} else if (type === "Personal") {
		frm.set_df_property("corporate_section", "hidden", 1);
		frm.set_df_property("personal_section", "hidden", 0);
	} else {
		frm.set_df_property("corporate_section", "hidden", 1);
		frm.set_df_property("personal_section", "hidden", 1);
	}
}

function toggleCustomerStatus(frm) {
	frappe.confirm('Are you sure you want to proceed?',
			() => {
					// YES
					frappe.call({
						doc: frm.doc,
						method: "toggle_customer_status",
						callback: () =>{
							frm.refresh()
						}
					})
			}, () => {
					// NO
					frappe.show_alert("Do Nothing !!!")
			})	
}