import express from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';

dotenv.config();

const router = express.Router();
const apiKey = process.env.API_KEY;


router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // Create a FormData object and append payload fields
    const form = new FormData();
    form.append('prompt', prompt);
    form.append('output_format', 'webp');

    // Make the API request using fetch
    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${apiKey}`,
        Accept: 'image/*',
      },
      body: form,
    });

    // Check response status and handle appropriately
    if (response.ok) {
      const imgBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(imgBuffer);

      // Optionally save the image locally
      fs.writeFileSync('./lighthouse.webp', buffer);

      console.log('Image received and saved.');
      res
        .status(200)
        .set({
          'Content-Type': 'image/webp',
          'Content-Length': buffer.length,
        })
        .send(buffer);
    } else {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return res
        .status(response.status)
        .json({ message: `Failed to generate image: ${errorText}` });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
