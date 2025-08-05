# 📁 Storage Manager API

A comprehensive file storage and management system built with Node.js, featuring user authentication, folder organization, file uploads, and administrative controls.

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd storage-manager-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the server**

   ```bash
   # Development
   npm run dev

   ```

4. **Server Live Link**

```
   https://storage-manager-server.vercel.app

```

![Database Schema](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blank%20diagram-C5PSJQKRdXmVvDtRP17TjoQNHXHvTp.png)

## ✨ Features

### 🔐 Authentication & User Management

- **User Registration** with profile image upload
- **Secure Login** with JWT authentication
- **Password Management** (change, reset with OTP)
- **Private PIN** system for enhanced security
- **Profile Management** with image updates

### 📂 File & Folder Organization

- **Folder Creation** and management
- **File Upload** with multiple format support (PDF, images, documents)
- **Private File Storage** with PIN protection
- **File Organization** within folders
- **Favorites System** for quick access

### 🛠️ File Operations

- **Rename** files and folders
- **Copy & Duplicate** files
- **Share Files** with generated links
- **File Filtering** by date and type
- **Storage Quota** management per user

### 👨‍💼 Admin Panel

- **User Management** - view and delete users
- **Folder Oversight** - monitor all folders
- **Upload Monitoring** - track all file uploads
- **System Administration** capabilities

## 🚀 API Endpoints

### 👤 User Management

#### Create User

```http
POST /api/v1/user/create-user
Content-Type: multipart/form-data

Form Data:
- file: [Profile Image]
- data: {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
```

#### Get User Profile

```http
GET /api/v1/user/me
Authorization: {userToken}
```

#### Update Profile

```http
PATCH /api/v1/user/edit-user-profile/{userId}
Authorization: {userToken}
Content-Type: multipart/form-data
```

#### Private PIN Management

```http
# Set Private PIN
POST /api/v1/user/private-pin
Authorization: {userToken}
{
  "privatePin": 1234
}

# Verify Private PIN
POST /api/v1/user/verify-private-pin
Authorization: {userToken}
{
  "privatePin": 1234
}

# Change Private PIN
PATCH /api/v1/user/change-private-pin
Authorization: {userToken}
{
  "currentPin": 1234,
  "newPin": 4321
}
```

### 🔑 Authentication

#### Login

```http
POST /api/v1/auth/login-user
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Password Reset Flow

```http
# 1. Request Password Reset
POST /api/v1/auth/forget-password
{
  "email": "user@example.com"
}

# 2. Verify OTP
POST /api/v1/auth/verify-otp
{
  "email": "user@example.com",
  "otp": "123456"
}

# 3. Reset Password
POST /api/v1/auth/reset-password
{
  "email": "user@example.com",
  "newPassword": "newPassword123"
}
```

### 📁 Folder Management

#### Create Folder

```http
POST /api/v1/folder/create-folder
Authorization: {userToken}
{
  "name": "Documents"
}
```

#### Get User Folders

```http
GET /api/v1/folder/my-folders
Authorization: {userToken}
```

#### Get Folder Contents

```http
GET /api/v1/folder/my-folder-files/{folderId}
Authorization: {userToken}
```

### 📤 File Upload & Management

#### Upload File

```http
POST /api/v1/upload/file-upload
Authorization: {userToken}
Content-Type: multipart/form-data

Form Data:
- file: [File to upload]
- data: {
    "type": "pdf",
    "parentId": "folderId" // Optional
  }
```

#### Private File Upload

```http
POST /api/v1/upload/private-file-upload
Authorization: {userToken}
Content-Type: multipart/form-data
```

#### Get User Uploads

```http
GET /api/v1/upload/my-uploads?uploadDate=2025-01-01&type=pdf
Authorization: {userToken}
```

#### File Operations

```http
# Add to Favorites
POST /api/v1/upload/add-to-favourite/{fileId}
Authorization: {userToken}

# Remove from Favorites
POST /api/v1/upload/unfavourite/{fileId}
Authorization: {userToken}

# Get Favorites
GET /api/v1/upload/favourites
Authorization: {userToken}

# Rename File
PATCH /api/v1/upload/rename-file/{fileId}
Authorization: {userToken}
{
  "folderName": "New Name"
}

# Duplicate File
POST /api/v1/upload/duplicate-file/{fileId}
Authorization: {userToken}

# Share File
POST /api/v1/upload/share-file/{fileId}

# Open File
GET /api/v1/upload/open-file/{fileId}
Authorization: {userToken}
```

### 👨‍💼 Admin Endpoints

#### Get All Users

```http
GET /api/v1/admin/users
Authorization: {adminToken}
```

#### Get All Folders

```http
GET /api/v1/admin/folders
Authorization: {adminToken}
```

#### Get All Uploads

```http
GET /api/v1/admin/uploads
Authorization: {adminToken}
```

#### Admin Delete Operations

```http
# Delete User
PATCH /api/v1/admin/delete-user/{userId}
Authorization: {adminToken}

# Delete Folder
PATCH /api/v1/admin/delete-folder/{folderId}
Authorization: {adminToken}

# Delete Upload
PATCH /api/v1/admin/delete-upload/{uploadId}
Authorization: {adminToken}
```

## 🗄️ Database Schema

The system uses three main data models:

### User Module

- User authentication and profile management
- Storage quota tracking (total, used, available)
- File type storage limits (PDF, images, notes)
- Private PIN security system
- Role-based access control

### Upload File Module

- File metadata and storage information
- User and folder relationships
- File type categorization
- Favorite system
- Private file handling
- Share link generation

### Folder Module

- Hierarchical folder organization
- User ownership tracking
- Soft delete functionality

## 🛠️ Setup Instructions

## 📝 Usage Examples

### Authentication Flow

```javascript
// 1. Register a new user
const formData = new FormData();
formData.append("file", profileImage);
formData.append(
  "data",
  JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  }),
);

const response = await fetch("/api/v1/user/create-user", {
  method: "POST",
  body: formData,
});

// 2. Login
const loginResponse = await fetch("/api/v1/auth/login-user", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@example.com",
    password: "password123",
  }),
});

const { data } = await loginResponse.json();
const token = data.accessToken;
```

### File Upload Example

```javascript
const uploadFile = async (file, folderId = null) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "data",
    JSON.stringify({
      type: file.type.includes("image") ? "image" : "pdf",
      parentId: folderId,
    }),
  );

  const response = await fetch("/api/v1/upload/file-upload", {
    method: "POST",
    headers: {
      Authorization: `${token}`,
    },
    body: formData,
  });

  return response.json();
};
```

## 🔒 Security Features

- **JWT Authentication** with configurable expiration
- **Private PIN System** for sensitive files
- **Role-based Access Control** (User/Admin)
- **OTP Verification** for password reset
- **File Type Validation** and size limits
- **Secure File Storage** with organized directory structure

## 📊 Storage Management

- **Per-user Storage Quotas** with real-time tracking
- **File Type Categorization** (PDF, Images, Notes)
- **Storage Analytics** for administrators
- **Automatic Storage Calculation** on upload/delete

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please open an issue in the GitHub repository or contact the development team.
