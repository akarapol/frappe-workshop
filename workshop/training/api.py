import frappe

def create_sample_data(number: int):
  for i in range(0, number):
    new_customer = frappe.new_doc("Customer")
    
    new_customer.customer_name = f"customer-{i+1}"
    new_customer.organization_type = "None"
    new_customer.Country = "Thailand"
    new_customer.date_of_birth = "2020-01-01"

    new_customer.save()

@frappe.whitelist()
def enqueue_create_sample_data(number: int):
  frappe.enqueue(create_sample_data, number=number)