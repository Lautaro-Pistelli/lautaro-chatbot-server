const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Modelo gratuito compatible con Hugging Face Inference API
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/google/flan-t5-small';

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

    // ✅ Este modelo devuelve un array con 'generated_text'
    const generatedText = response.data?.[0]?.generated_text || 'No se pudo generar una respuesta.';
    res.json({ reply: generatedText });
  } catch (error) {
    console.error('Error al conectar con Hugging Face:', error.message);
    res.status(500).json({ reply: 'Error al conectar con Hugging Face' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
});

// ✅ Ruta raíz para testear que el server esté vivo
app.get("/", (req, res) => {
  res.send("🚀 Lautaro GPT backend is running!");
});
