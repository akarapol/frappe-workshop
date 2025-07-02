# Copyright (c) 2025, Akarapol Kasvittayanun and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import frappe.utils


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
	
	@frappe.whitelist()
	def toggle_customer_status(self):
		self.disabled = not self.disabled
		self.save()

	@frappe.whitelist()
	def balance(self):
		customer = frappe.get_doc("Customer",self.name)
		invoices = frappe.get_list("Customer Invoice",fields=["invoice_amount","invoice_date", "closed"],filters={"customer":customer.name})
		open_invoice_amount = sum([inv["invoice_amount"] for inv in invoices if not inv["closed"]])
		
		return (customer.credit_limit - open_invoice_amount)
