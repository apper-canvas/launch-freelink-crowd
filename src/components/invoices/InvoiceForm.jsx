import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';
import { createInvoice, updateInvoice } from '../../store/slices/invoiceSlice';

const InvoiceForm = ({ invoice, clients, isEditing = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date();
  
  const PlusIcon = getIcon('Plus');
  const TrashIcon = getIcon('Trash');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  
  const initialValues = invoice ? {
    ...invoice,
    issueDate: invoice.issueDate || format(today, 'yyyy-MM-dd'),
    dueDate: invoice.dueDate || format(new Date(today.setDate(today.getDate() + 14)), 'yyyy-MM-dd'),
    items: invoice.items || [{ description: '', quantity: 1, rate: 0, amount: 0 }]
  } : {
    clientId: '',
    clientName: '',
    issueDate: format(today, 'yyyy-MM-dd'),
    dueDate: format(new Date(today.setDate(today.getDate() + 14)), 'yyyy-MM-dd'),
    status: 'draft',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: ''
  };

  const validationSchema = Yup.object({
    clientId: Yup.string().required('Client is required'),
    issueDate: Yup.date().required('Issue date is required'),
    dueDate: Yup.date().required('Due date is required'),
    items: Yup.array().of(
      Yup.object({
        description: Yup.string().required('Description is required'),
        quantity: Yup.number().positive('Quantity must be positive').required('Quantity is required'),
        rate: Yup.number().min(0, 'Rate must be positive').required('Rate is required')
      })
    ).min(1, 'At least one item is required')
  });

  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (invoice && clients) {
      const client = clients.find(c => c.id === invoice.clientId);
      setSelectedClient(client);
    }
  }, [invoice, clients]);

  const handleClientChange = (e, setFieldValue) => {
    const clientId = e.target.value;
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client);
    setFieldValue('clientId', clientId);
    if (client) {
      setFieldValue('clientName', client.name);
    }
  };

  const calculateLineAmount = (quantity, rate) => {
    return (parseFloat(quantity) * parseFloat(rate)).toFixed(2);
  };

  const updateTotals = (values, setFieldValue) => {
    const subtotal = values.items.reduce((sum, item) => {
      const amount = calculateLineAmount(item.quantity, item.rate);
      return sum + parseFloat(amount);
    }, 0);
    
    setFieldValue('subtotal', subtotal.toFixed(2));
    
    const tax = parseFloat(values.tax || 0);
    const total = (subtotal + tax).toFixed(2);
    
    setFieldValue('total', total);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditing) {
        await dispatch(updateInvoice({ id: invoice.id, data: values })).unwrap();
        toast.success('Invoice updated successfully!');
      } else {
        await dispatch(createInvoice(values)).unwrap();
        toast.success('Invoice created successfully!');
      }
      navigate('/invoices');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update invoice' : 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <button 
          type="button" 
          onClick={() => navigate('/invoices')} 
          className="p-2 mr-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Invoice' : 'Create New Invoice'}</h1>
      </div>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="input-group">
                <label htmlFor="clientId" className="input-label">Client</label>
                <Field 
                  as="select" 
                  name="clientId" 
                  id="clientId"
                  className="w-full"
                  onChange={(e) => handleClientChange(e, setFieldValue)}
                >
                  <option value="">Select a client</option>
                  {clients && clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="clientId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label htmlFor="issueDate" className="input-label">Issue Date</label>
                  <Field type="date" name="issueDate" id="issueDate" className="w-full" />
                  <ErrorMessage name="issueDate" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div className="input-group">
                  <label htmlFor="dueDate" className="input-label">Due Date</label>
                  <Field type="date" name="dueDate" id="dueDate" className="w-full" />
                  <ErrorMessage name="dueDate" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Invoice Items</h2>
              <FieldArray name="items">
                {({ push, remove }) => (
                  <div>
                    <div className="bg-surface-100 dark:bg-surface-700 rounded-t-lg p-3 grid grid-cols-12 gap-2 font-medium text-sm">
                      <div className="col-span-6">Description</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-2">Rate</div>
                      <div className="col-span-1">Amount</div>
                      <div className="col-span-1"></div>
                    </div>
                    
                    {values.items.map((item, index) => (
                      <div key={index} className="p-3 border-b border-surface-200 dark:border-surface-700 grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6">
                          <Field name={`items.${index}.description`} type="text" placeholder="Item description" className="w-full" />
                          <ErrorMessage name={`items.${index}.description`} component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        <div className="col-span-2">
                          <Field name={`items.${index}.quantity`} type="number" min="1" step="1"
                            onChange={(e) => {
                              setFieldValue(`items.${index}.quantity`, parseFloat(e.target.value) || 0);
                              setFieldValue(`items.${index}.amount`, calculateLineAmount(e.target.value, values.items[index].rate));
                              updateTotals({...values, items: [...values.items]}, setFieldValue);
                            }}
                            className="w-full" />
                            <ErrorMessage name={`items.${index}.quantity`} component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        <div className="col-span-2">
                          <Field name={`items.${index}.rate`} type="number" min="0" step="0.01"
                            onChange={(e) => {
                              setFieldValue(`items.${index}.rate`, parseFloat(e.target.value) || 0);
                              setFieldValue(`items.${index}.amount`, calculateLineAmount(values.items[index].quantity, e.target.value));
                              updateTotals({...values, items: [...values.items]}, setFieldValue);
                            }}
                            className="w-full" />
                            <ErrorMessage name={`items.${index}.rate`} component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        <div className="col-span-1 text-right font-medium">
                          ${parseFloat(values.items[index].amount || calculateLineAmount(values.items[index].quantity, values.items[index].rate)).toFixed(2)}
                        </div>
                        <div className="col-span-1">
                          {values.items.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => {
                                remove(index);
                                updateTotals({...values, items: values.items.filter((_, i) => i !== index)}, setFieldValue);
                              }}
                              className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => push({ description: '', quantity: 1, rate: 0, amount: 0 })}
                        className="flex items-center text-sm text-primary hover:text-primary-dark transition-colors"
                      >
                        <PlusIcon className="w-4 h-4 mr-1" />
                        Add Item
                      </button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </div>
            
            <div className="mt-6 flex flex-col items-end">
              <div className="w-full md:w-1/3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-surface-600 dark:text-surface-400">Subtotal:</span>
                  <span className="font-medium">${values.subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-surface-600 dark:text-surface-400">Tax:</span>
                  <Field 
                    type="number" 
                    name="tax" 
                    min="0" 
                    step="0.01" 
                    className="w-24 text-right"
                    onChange={(e) => {
                      setFieldValue('tax', parseFloat(e.target.value) || 0);
                      updateTotals(values, setFieldValue);
                    }}
                  />
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-surface-200 dark:border-surface-700">
                  <span>Total:</span>
                  <span>${values.total}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="input-group">
                <label htmlFor="notes" className="input-label">Notes</label>
                <Field as="textarea" name="notes" id="notes" rows="3" placeholder="Payment terms, instructions, or notes to the client" className="w-full" />
              </div>
            </div>
            
            <div className="mt-8 flex space-x-4">
              <button 
                type="button"
                onClick={() => navigate('/invoices')}
                className="btn-outline"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : (isEditing ? 'Update Invoice' : 'Create Invoice')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default InvoiceForm;