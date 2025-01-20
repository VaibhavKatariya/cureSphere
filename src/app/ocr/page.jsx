'use client'
// Import necessary modules
import { useState } from 'react';
import axios from 'axios';

export default function MedicalPrescription() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [medicineDetails, setMedicineDetails] = useState([]);

  // Handle file upload
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle file submission and API calls
  const handleSubmit = async () => {
    if (!file) {
      alert('Please upload a file');
      return;
    }

    setIsLoading(true);

    try {
      // First API call to extract medicines
      const formData = new FormData();
      formData.append('file', file);

      const ocrResponse = await axios.post('http://LakshayGupta1234.pythonanywhere.com/extract-medicines', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const medicineNames = ocrResponse.data.medicines;
      setMedicines(medicineNames);

      // Second API call to fetch medicine details
      const detailsPromises = medicineNames.map((medicine) =>
        axios.post('https://medicine-data-lstd.onrender.com/get_medicine_info', { medicine_name: medicine })
      );

      const detailsResponses = await Promise.all(detailsPromises);
      setMedicineDetails(detailsResponses.map((response) => response.data));
    } catch (error) {
      console.error('Error processing file:', error);
      alert('An error occurred while processing the file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', marginBottom: '16px' }}>Upload Medical Prescription</h1>

        <div style={{ marginBottom: '16px' }}>
          <input type="file" onChange={handleFileChange} style={{ width: '100%', padding: '8px' }} />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#ccc' : '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </div>

      {medicines.length > 0 && (
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Extracted Medicines</h2>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
            {medicines.map((medicine, index) => (
              <li key={index}>{medicine}</li>
            ))}
          </ul>
        </div>
      )}

      {medicineDetails.length > 0 && (
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Medicine Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #ccc' }}>
                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ccc' }}>Medicine Name</th>
                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ccc' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {medicineDetails.map((detail, index) => (
                <tr key={index}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>{detail.medicine_name}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>{JSON.stringify(detail)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}