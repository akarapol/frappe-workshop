frappe.listview_settings["Customer"] = {
  refresh: function(listview) {
    listview.page.add_inner_button("Generate Sample Data", ()=>{
        create_sample_data()
      });
  }
}
function create_sample_data() {
  frappe.call({
    method:"workshop.training.api.enqueue_create_sample_data",
    args: {
      "number": 15
    },
    callback: (r)=>{
      frappe.show_alert("Enqueued")
    }
  })
}