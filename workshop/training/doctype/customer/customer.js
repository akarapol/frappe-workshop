// Copyright (c) 2025, Akarapol Kasvittayanun and contributors
// For license information, please see license.txt

frappe.ui.form.on("Customer", {
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
