import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';

import { CSV_RECORDS_LIMIT } from '@/constants';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Validate record count (simple newline count for CSV)
    const content = buffer.toString('utf-8');
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    const recordCount = lines.length - 1; // Assuming header row

    if (recordCount > CSV_RECORDS_LIMIT) {
      return NextResponse.json({ 
        message: `CSV file too large. Maximum ${CSV_RECORDS_LIMIT.toLocaleString()} records allowed. Found ${recordCount.toLocaleString()}.` 
      }, { status: 400 });
    }

    
    // 1. Upload to Cloudinary
    const cloudinaryUrl = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: "raw", 
          folder: "campaign_contacts" 
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      ).end(buffer);
    });

    // 2. Pass URL to Backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const backendRes = await axios.post(`${backendUrl}/api/contacts/upload`, {
      csvUrl: cloudinaryUrl
    });

    return NextResponse.json(backendRes.data, { status: 200 });

  } catch (error) {
    console.error("API Route Error:", error);
    const errorMsg = error.response?.data?.message || "Internal server error processing file";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}
