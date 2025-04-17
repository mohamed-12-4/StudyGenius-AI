'use server';
import { BlobServiceClient } from "@azure/storage-blob";

// Azure Storage configuration
const containerName = "study-materials";

// Initialize BlobServiceClient using a connection string
// Ensure NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING is set in environment
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING
);

// Get a reference to a container
const containerClient = blobServiceClient.getContainerClient(containerName);

/**
 * Upload a file to Azure Blob Storage
 * @param {File} file - The file to upload
 * @param {string} userId - The user ID who owns the file
 * @param {string} courseId - The course ID the file belongs to
 * @returns {Promise<{url: string, name: string, id: string, contentType: string}>} Object with file details
 */
export const uploadFile = async (file, userId, courseId) => {
  try {
    // Create a unique name for the blob using userId, courseId and original filename
    const blobName = `${userId}/${courseId}/${Date.now()}-${file.name}`;
    
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    // Upload file to blob storage
    const uploadBlobResponse = await blockBlobClient.uploadData(await file.arrayBuffer(), {
      blobHTTPHeaders: { blobContentType: file.type }
    });
    
    // Return the file details
    return {
      url: blockBlobClient.url,
      name: file.name,
      id: blobName,
      blobId: blobName,
      contentType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error uploading file to Azure Storage:", error);
    throw error;
  }
};

/**
 * Delete a file from Azure Blob Storage
 * @param {string} blobName - The name of the blob to delete
 * @returns {Promise<void>}
 */
export const deleteFile = async (blobName) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.delete();
  } catch (error) {
    console.error("Error deleting file from Azure Storage:", error);
    throw error;
  }
};

/**
 * Get a list of files for a specific course
 * @param {string} userId - The user ID who owns the files
 * @param {string} courseId - The course ID the files belong to
 * @returns {Promise<Array>} Array of file objects
 */
export const getFilesList = async (userId, courseId) => {
  try {
    const prefix = `${userId}/${courseId}/`;
    
    // List blobs with the specific prefix
    const iterator = containerClient.listBlobsFlat({ prefix });
    
    const filesList = [];
    for await (const blob of iterator) {
      // Create a block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
      
      // Get the original filename (remove the userId/courseId/timestamp prefix)
      const originalFilename = blob.name.split('/').pop().substring(blob.name.split('/').pop().indexOf('-') + 1);
      
      filesList.push({
        url: blockBlobClient.url,
        name: originalFilename,
        id: blob.name,
        blobId: blob.name,
        contentType: blob.properties.contentType,
        size: blob.properties.contentLength,
        createdAt: blob.properties.createdOn
      });
    }
    
    return filesList;
  } catch (error) {
    console.error("Error getting files list from Azure Storage:", error);
    throw error;
  }
};

/**
 * Get the content of a file as text
 * @param {string} blobName - The name of the blob
 * @returns {Promise<string>} The content of the file as text
 */
export const getFileContent = async (blobName) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    // Download the blob's content
    const downloadResponse = await blockBlobClient.download();
    
    // Convert the downloaded stream to text
    const content = await streamToText(downloadResponse.readableStreamBody);
    return content;
  } catch (error) {
    console.error("Error getting file content from Azure Storage:", error);
    throw error;
  }
};

/**
 * Convert a readable stream to text
 * @param {ReadableStream} readableStream - The readable stream to convert
 * @returns {Promise<string>} The stream content as text
 */
async function streamToText(readableStream) {
  // Create a reader from the stream
  const reader = readableStream.getReader();
  const chunks = [];

  // Process the stream
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  // Combine chunks and convert to text
  const uint8Array = new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));
  return new TextDecoder().decode(uint8Array);
}

/**
 * Get a downloadable URL for a file
 * @param {string} blobName - The name of the blob
 * @returns {Promise<string>} The download URL
 */
export const getFileDownloadURL = async (blobName) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    // For simplicity, we'll just return the regular URL
    // In a production app, you might want to generate a SAS token with an expiry time
    return blockBlobClient.url;
  } catch (error) {
    console.error("Error getting file download URL from Azure Storage:", error);
    throw error;
  }
};