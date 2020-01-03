// create a particular invoice by name
const createInvoice = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: `https://api.freshbooks.com/accounting/account/${bundle.inputData.account_id}/invoices/invoices`,
    body: JSON.stringify({
      client: bundle.inputData.client,
      currency_code: bundle.inputData.currency_code,
      notes: bundle.inputData.notes
    })
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

module.exports = {
  key: 'Create_invoice',
  noun: 'Invoice',

  display: {
    label: 'Create Invoice',
    description: 'Creates a invoice.'
  },

  operation: {
    inputFields: [
      {key: 'client', required: true},
      {key: 'account_id', required: true},
      {key: 'currency_code', label: "Currency Code"},
      {key: 'notes', label: "Notes"},

    ],
    perform: createInvoice,

    sample: {
        "accountid": "AQW5qM",
        "accounting_systemid": "AQW5qM",
        "address": "",
        "amount": {
          "amount": "0.00",
          "code": "USD"
        },
        "auto_bill": false,
        "autobill_status": null,
        "basecampid": 0,
        "city": "",
        "code": "",
        "country": "",
        "create_date": "2016-04-04",
        "created_at": "2020-01-03 16:59:10",
        "currency_code": "USD",
        "current_organization": "joiuygiuyfhn.doe@abcorp.com",
        "customerid": 127893,
        "date_paid": null,
        "deposit_amount": null,
        "deposit_percentage": null,
        "deposit_status": "none",
        "description": "",
        "discount_description": null,
        "discount_total": {
          "amount": "0.00",
          "code": "USD"
        },
        "discount_value": "0",
        "display_status": "draft",
        "dispute_status": null,
        "due_date": "2016-04-04",
        "due_offset_days": 0,
        "estimateid": 0,
        "ext_archive": 0,
        "fname": "",
        "fulfillment_date": null,
        "generation_date": null,
        "gmail": false,
        "id": 66139,
        "invoice_number": "0000002",
        "invoiceid": 66139,
        "language": "en",
        "last_order_status": null,
        "lname": "",
        "notes": "",
        "organization": "joiuygiuyfhn.doe@abcorp.com",
        "outstanding": {
          "amount": "0.00",
          "code": "USD"
        },
        "ownerid": 1,
        "paid": {
          "amount": "0.00",
          "code": "USD"
        },
        "parent": 0,
        "payment_details": "",
        "payment_status": "unpaid",
        "po_number": null,
        "province": "",
        "return_uri": null,
        "sentid": 1,
        "show_attachments": true,
        "status": 1,
        "street": "",
        "street2": "",
        "template": "clean-grouped",
        "terms": "",
        "updated": "2020-01-03 16:59:10",
        "v3_status": "draft",
        "vat_name": "",
        "vat_number": "",
        "vis_state": 0
      },

    // outputFields: [
    //   {key: 'id', label: 'ID'},
    //   {key: 'name', label: 'Name'}
    // ]
  }
};
