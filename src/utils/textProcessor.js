const pdf = require('pdf-parse');
const Tesseract = require('tesseract.js');
const textract = require('textract');
const { NlpManager } = require('node-nlp');

const nlpManager = new NlpManager({ languages: ['pt'], forceNER: true });

nlpManager.addDocument('pt', 'extrair palavras-chave do texto', 'extrairPalavrasChave');
nlpManager.addDocument('pt', 'encontrar termos-chave no conteúdo', 'extrairPalavrasChave');
nlpManager.train();

const extractTextFromDocument = async (fileData, contentType) => {
  if (contentType === 'application/pdf') {
    return extractTextFromPDF(fileData);
  } else if (contentType.startsWith('image/')) {
    return extractTextFromImage(fileData);
  } else {
    return extractTextFromOtherFormats(fileData, contentType);
  }
};

const extractTextFromOtherFormats = async (fileData, contentType) => {
  return new Promise((resolve, reject) => {
    textract.fromBufferWithMime(contentType, fileData, (err, text) => {
      if (err) reject(err);
      else resolve(text);
    });
  });
};

const extractTextFromPDF = async (fileData) => {
  const dataBuffer = Buffer.from(fileData);
  const data = await pdf(dataBuffer);
  return data.text;
};

const extractTextFromImage = async (fileData) => {
  const { data: { text } } = await Tesseract.recognize(
    fileData,
    'eng',
    { logger: info => console.log(info) }
  );
  return text;
};


const identifyKeywords = async (text) => {
  const response = await nlpManager.process('pt', text);
  const palavrasChave = response.entities.map(entity => entity.utteranceText);
  return  palavrasChave ;
};

module.exports = {
  extractTextFromDocument,
  identifyKeywords
};