// server/index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1';

app.post('/api/chat', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        }
      }
    );

    const generatedText = response.data?.[0]?.generated_text || 'No se pudo generar una respuesta.';
    res.json({ reply: generatedText });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ reply: 'Error al conectar con Hugging Face' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
