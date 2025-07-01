# Copyright (c) 2025, Akarapol Kasvittayanun and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Customer(Document):
	def validate(self):
		"""
		Validates the Customer document before saving.
		Checks if Date of Birth is provided when Identification Type
		is "Personal Identification" and ensures it's not in the future.
		"""
		if self.identification_type == "Personal Identification":
			if not self.date_of_birth:
				frappe.throw("Date of Birth is required when Identification Type is Personal Identification.")
			if self.date_of_birth and self.date_of_birth > frappe.utils.today():
				frappe.throw("Date of Birth cannot be in the future.")

