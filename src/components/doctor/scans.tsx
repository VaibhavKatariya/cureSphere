'use client';

import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

export default function MedicalPrescription() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [medicines, setMedicines] = useState<string[]>([]);
  const [medicineDetails, setMedicineDetails] = useState<any[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Missing file",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // First API call to extract medicines
      const formData = new FormData();
      formData.append('file', selectedFile);

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

      toast({
        title: "Success",
        description: "File processed successfully",
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing the file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload Medical Prescription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Prescription File</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className="w-full"
          >
            {uploading ? 'Processing...' : 'Submit'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extracted Medicines</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[200px]">
          <CardContent>
            {medicines.length > 0 ? (
              <ul className="list-disc pl-5">
                {medicines.map((medicine, index) => (
                  <li key={index}>{medicine}</li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 py-4">No medicines extracted yet</div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medicine Details</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[400px]">
          <CardContent>
            {medicineDetails.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-4 py-2 text-left">Medicine Name</th>
                    <th className="px-4 py-2 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {medicineDetails.map((detail, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{detail.medicine_name}</td>
                      <td className="px-4 py-2">{JSON.stringify(detail)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-500 py-4">No medicine details available</div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
