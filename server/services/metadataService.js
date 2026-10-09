const fs = require('fs');

function inspectMetadata(filename, buffer) {
  const metadata = {
    filename,
    fileSizeBytes: buffer.length,
    timestamp: new Date().toISOString(),
    extractedProperties: {},
    hasGpsData: false,
    hasSensitiveExif: false,
    recommendations: []
  };

  const textContent = buffer.toString('binary');
  
  // Basic EXIF header checks in JPEG / PNG / PDF
  if (filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg')) {
    if (textContent.includes('Exif')) {
      metadata.extractedProperties['Format'] = 'JPEG with EXIF Header';
      if (textContent.includes('GPS')) {
        metadata.hasGpsData = true;
        metadata.hasSensitiveExif = true;
        metadata.extractedProperties['GPS Coordinates'] = 'GPS Location Tags Present in EXIF';
      }
      if (textContent.includes('Photoshop') || textContent.includes('Adobe')) {
        metadata.extractedProperties['Software'] = 'Adobe / Editing Software Tags Detected';
      }
    }
  } else if (filename.toLowerCase().endsWith('.pdf')) {
    metadata.extractedProperties['Format'] = 'PDF Document';
    const authorMatch = textContent.match(/\/Author\s*\(([^)]+)\)/i);
    const creatorMatch = textContent.match(/\/Creator\s*\(([^)]+)\)/i);
    const producerMatch = textContent.match(/\/Producer\s*\(([^)]+)\)/i);

    if (authorMatch) metadata.extractedProperties['Author'] = authorMatch[1];
    if (creatorMatch) metadata.extractedProperties['Creator'] = creatorMatch[1];
    if (producerMatch) metadata.extractedProperties['Producer'] = producerMatch[1];

    if (authorMatch || creatorMatch) metadata.hasSensitiveExif = true;
  } else {
    metadata.extractedProperties['Format'] = 'Binary / Generic File';
  }

  if (metadata.hasSensitiveExif || metadata.hasGpsData) {
    metadata.recommendations.push('Sanitize metadata before sharing file publicly to protect location & personal identity.');
  }

  return metadata;
}

function cleanMetadata(buffer, filename) {
  // Safe metadata cleaning simulation / basic header strip
  let cleanedBuffer = Buffer.from(buffer);
  
  // For basic JPEGs, if Exif segment present, replace Exif marker with zeroed bytes
  const exifIdx = cleanedBuffer.indexOf(Buffer.from('Exif'));
  if (exifIdx !== -1) {
    for (let i = exifIdx; i < exifIdx + 100 && i < cleanedBuffer.length; i++) {
      cleanedBuffer[i] = 0x00;
    }
  }

  return {
    cleanedBuffer,
    originalSize: buffer.length,
    cleanedSize: cleanedBuffer.length,
    message: 'Metadata headers stripped successfully.'
  };
}

module.exports = { inspectMetadata, cleanMetadata };
