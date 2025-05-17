import { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import { addClient, updateClient } from '../../services/clientService';

const ClientForm = ({ client, onClose, onSubmit }) => {
  const isEditMode = !!client;
  const XIcon = getIcon('X');
  
  const initialValues = {
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    company: client?.company || '',
    status: client?.status || 'lead',
    notes: client?.notes || ''
  };
  
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().matches(
      /^(\+\d{1,3}[- ]?)?\d{10}$/,
      'Phone number must be 10 digits with optional country code'
    ),
    company: Yup.string(),
    status: Yup.string().oneOf(['active', 'inactive', 'lead'], 'Invalid status').required('Status is required'),
    notes: Yup.string()
  });
  
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      let result;
      
      if (isEditMode) {
        result = await updateClient(client.id, values);
      } else {
        result = await addClient(values);
      }
      
      onSubmit(result, !isEditMode);
    } catch (error) {
      console.error('Error saving client:', error);
      if (error.validationErrors) {
        setErrors(error.validationErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle escape key press to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 bg-surface-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isEditMode ? 'Edit Client' : 'Add New Client'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              aria-label="Close"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="input-group">
                    <label htmlFor="name" className="input-label">Name *</label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className={`w-full ${errors.name && touched.name ? 'border-red-500' : ''}`}
                      placeholder="John Doe"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="email" className="input-label">Email *</label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className={`w-full ${errors.email && touched.email ? 'border-red-500' : ''}`}
                      placeholder="john@example.com"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="phone" className="input-label">Phone</label>
                    <Field
                      type="text"
                      id="phone"
                      name="phone"
                      className={`w-full ${errors.phone && touched.phone ? 'border-red-500' : ''}`}
                      placeholder="+1 123 456 7890"
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="company" className="input-label">Company</label>
                    <Field
                      type="text"
                      id="company"
                      name="company"
                      className="w-full"
                      placeholder="Company Name"
                    />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="status" className="input-label">Status *</label>
                    <Field
                      as="select"
                      id="status"
                      name="status"
                      className="w-full"
                    >
                      <option value="lead">Lead</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="notes" className="input-label">Notes</label>
                  <Field as="textarea" id="notes" name="notes" rows="4" className="w-full" placeholder="Additional notes about the client..." />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? 'Saving...' : isEditMode ? 'Update Client' : 'Add Client'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientForm;