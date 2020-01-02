// // triggers on invoice with a certain tag
// const triggerInvoice = (z, bundle) => {
//   const responsePromise = z.request({
//     url: 'https://api.freshbooks.com/accounting/account/<accountid>/invoices/invoices/<invoiceid>',
//     params: {
//       tag: bundle.inputData.tagName,
//       filter: bundle.inputData.filter,
//       state: bundle.inputData.state
//     }
//   });
//   return responsePromise
//     .then(response => z.JSON.parse(response.content));
// };
//
// module.exports = {
//   key: 'invoice',
//   noun: 'Invoice',
//
//   display: {
//     label: 'Get Invoice',
//     description: 'Triggers on a new invoice.'
//   },
//
//   operation: {
//     inputFields: [
//
//     ],
//     perform: triggerInvoice,
//
//     sample: {
//       id: 1,
//       name: 'Test'
//     },
//
//     outputFields: [
//       {key: 'id', label: 'ID'},
//       {key: 'name', label: 'Name'}
//     ]
//   }
// };
