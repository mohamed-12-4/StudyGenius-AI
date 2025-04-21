'use server';
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from "@azure/storage-blob";

// Azure Storage configuration
const containerName = "study-materials";
const storageAccount = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const storageAccountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

// Initialize SharedKeyCredential for SAS token generation
const sharedKeyCredential = new StorageSharedKeyCredential(
  storageAccount,
  storageAccountKey
);

// Initialize BlobServiceClient using a connection string
// Ensure NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING is set in environment
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING
);

// Get a reference to a container
const containerClient = blobServiceClient.getContainerClient(containerName);

/**
 * Generate a Shared Access Signature (SAS) token for a blob
 * @param {string} blobName - The name of the blob
 * @param {number} expiryMinutes - Token expiry time in minutes (default: 60)
 * @returns {string} SAS token URL
 */
function generateSasToken(blobName, expiryMinutes = 60) {
  // Set start time to 5 minutes ago to avoid clock skew issues
  const startsOn = new Date();
  startsOn.setMinutes(startsOn.getMinutes() - 5);
  
  // Set expiry time
  const expiresOn = new Date();
  expiresOn.setMinutes(expiresOn.getMinutes() + expiryMinutes);
  
  // Set permissions - read, write, delete, etc.
  const permissions = new BlobSASPermissions();
  permissions.read = true;  // Allow read access
  
  // Generate SAS token
  const sasOptions = {
    containerName,
    blobName,
    permissions,
    startsOn,
    expiresOn,
  };
  
  // Generate the SAS query parameters
  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    sharedKeyCredential
  ).toString();
  
  // Construct the full URL with SAS token
  return `${getBlobBaseUrl(blobName)}?${sasToken}`;
}

/**
 * Get the base URL for a blob (without SAS token)
 * @param {string} blobName - The name of the blob
 * @returns {string} The base URL
 */
function getBlobBaseUrl(blobName) {
  return `https://${storageAccount}.blob.core.windows.net/${containerName}/${blobName}`;
}

// Create the container if it doesn't exist (this is async, but we'll handle it in each function)
async function ensureContainerExists() {
  try {
    const exists = await containerClient.exists();
    if (!exists) {
      console.log(`Creating container "${containerName}"...`);
      const createContainerResponse = await containerClient.create({
        access: 'blob' // Allows public read access for blobs only (not containers)
      });
      console.log(`Container "${containerName}" has been created successfully`);
      return true;
    }
    return true;
  } catch (error) {
    console.error(`Error creating container "${containerName}":`, error);
    throw error;
  }
}

/**
 * Upload a file to Azure Blob Storage
 * @param {File} file - The file to upload
 * @param {string} userId - The user ID who owns the file
 * @param {string} courseId - The course ID the file belongs to
 * @returns {Promise<{url: string, name: string, id: string, contentType: string}>} Object with file details
 */
export const uploadFile = async (file, userId, courseId) => {
  try {
    // Ensure container exists before uploading
    await ensureContainerExists();
    
    // Create a unique name for the blob using userId, courseId and original filename
    const blobName = `${userId}/${courseId}/${Date.now()}-${file.name}`;
    
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    // Upload file to blob storage
    const uploadBlobResponse = await blockBlobClient.uploadData(await file.arrayBuffer(), {
      blobHTTPHeaders: { blobContentType: file.type }
    });
    
    // Generate a SAS URL for the uploaded blob
    const sasUrl = generateSasToken(blobName, 60); // 60 minutes expiry
    
    // Return the file details with SAS URL
    return {
      url: sasUrl,
      sasUrl: sasUrl,
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
    // Ensure container exists before deleting
    await ensureContainerExists();
    
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
    // Ensure container exists before listing files
    await ensureContainerExists();
    
    const prefix = `${userId}/${courseId}/`;
    
    // List blobs with the specific prefix
    const iterator = containerClient.listBlobsFlat({ prefix });
    
    const filesList = [];
    for await (const blob of iterator) {
      // Get the original filename (remove the userId/courseId/timestamp prefix)
      const originalFilename = blob.name.split('/').pop().substring(blob.name.split('/').pop().indexOf('-') + 1);
      
      // Generate a SAS URL for each blob with 60 minutes expiry
      const sasUrl = generateSasToken(blob.name, 60);
      
      filesList.push({
        url: sasUrl,
        sasUrl: sasUrl,
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
    // Ensure container exists before getting content
    await ensureContainerExists();
    
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
 * Get a downloadable URL for a file with SAS token
 * @param {string} blobName - The name of the blob
 * @param {number} expiryMinutes - Token expiry time in minutes (default: 60)
 * @returns {Promise<string>} The download URL with SAS token
 */
export const getFileDownloadURL = async (blobName, expiryMinutes = 60) => {
  try {
    // Ensure container exists before getting download URL
    await ensureContainerExists();
    
    // Generate a SAS token for the blob with specified expiry
    const sasUrl = generateSasToken(blobName, expiryMinutes);
    
    return sasUrl;
  } catch (error) {
    console.error("Error getting file download URL from Azure Storage:", error);
    throw error;
  }
};