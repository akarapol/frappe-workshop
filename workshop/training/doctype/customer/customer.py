# Copyright (c) 2025, Akarapol Kasvittayanun and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.query_builder.functions import Sum
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
		cust_invoice = frappe.qb.DocType("Customer Invoice")

		query = (frappe.qb.from_(cust_invoice)
					 .select(Sum(cust_invoice.invoice_amount).as_("sum_invoice_amount"))
					 .where(cust_invoice.customer == self.name)
					 .where(cust_invoice.closed == False))
		
		# print(f"\n\n {query.get_sql()} \n\n")

		return (self.credit_limit - query.run(as_dict=True)[0].sum_invoice_amount)