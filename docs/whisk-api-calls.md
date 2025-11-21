# Image Generation API Calls Summary for Whisk

## Main Image Generation Request

**URL**: `https://aisandbox-pa.googleapis.com/v1/media/2eqmolq8v0000`  
**Method**: `GET`  
**Status**: 200 OK  
**Response Size**: 1.5 MB (base64 encoded PNG image)

This is the core request that retrieves the generated images. It returns the complete image data with metadata.

---

## Key API Endpoints Called

### 1. Check App Availability
- **URL**: `https://aisandbox-pa.googleapis.com/v1:checkAppAvailability`
- **Method**: `POST`
- **Request Body**: 
  ```json
  {
    "clientContext": {
      "tool": "PINHOLE"
    }
  }
  ```
- **Response**: 
  ```json
  {
    "availabilityState": "AVAILABLE"
  }
  ```

### 2. Fetch Tool Availability
- **URL**: `https://labs.google/fx/api/trpc/general.fetchToolAvailability`
- **Method**: `GET`
- **Query Parameters**: `tool=BACKBONE`
- **Response**: Tool availability status

### 3. Get User Session
- **URL**: `https://labs.google/fx/api/auth/session`
- **Method**: `GET`
- **Returns**: 
  - User info (name, email, profile image)
  - Access token
  - Token expiry time
  - Session metadata

### 4. Get Video Credit Status
- **URL**: `https://aisandbox-pa.googleapis.com/v1/whisk:getVideoCreditStatus`
- **Method**: `POST`
- **Request Body**: `{}`
- **Response**:
  ```json
  {
    "credits": 5,
    "g1MembershipState": "AVAILABLE_CREDITS",
    "isUserAnimateCountryEnabled": true,
    "userPaygateTier": "PAYGATE_TIER_NOT_PAID",
    "isGemPix2CreditAvailable": false
  }
  ```

### 5. Fetch Feature Availability
- **URL**: `https://labs.google/fx/api/trpc/general.fetchFeatureAvailability`
- **Method**: `GET`
- **Features Checked**: 
  - `WHISK_R2I`
  - `WHISK_R2I_PHOTOREALISTIC_REFERENCE`
- **Response**: Feature availability status for each feature

### 6. Fetch User Preferences
- **URL**: `https://labs.google/fx/api/trpc/general.fetchUserPreferences`
- **Method**: `GET`
- **Response**: User preferences including history enablement

### 7. Fetch User Acknowledgements
- **URL**: `https://labs.google/fx/api/trpc/general.fetchUserAcknowledgement`
- **Method**: `GET`
- **Acknowledgement Versions Checked**:
  - `CREATIVE_PARTNER_PROGRAM_TOS`
  - `WHISK_IMAGE_UPLOAD_TOS`
  - `USER_HISTORY_V1`

---

## Common Request Headers

All API requests include the following headers:

```
Authorization: Bearer {access_token}
Content-Type: application/json or text/plain;charset=UTF-8
Referer: https://labs.google/fx/tools/whisk
X-goog-api-key: AIzaSyBtrm0o5ab1c-Ec8ZuLcGt3oJAA5VWt3pY
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36
sec-ch-ua: "Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
```

---

## Response Pattern (tRPC Protocol)

The API uses a consistent tRPC protocol format for most endpoints:

```json
{
  "result": {
    "data": {
      "json": {
        "result": { ... },
        "status": 200,
        "statusText": "OK"
      }
    }
  }
}
```

---

## Generated Image Metadata

When an image is successfully generated, the response includes:

- **Model**: `IMAGEN_3_5`
- **Seed**: 658680 (example)
- **Image Format**: PNG (base64 encoded)
- **Aspect Ratio**: `IMAGE_ASPECT_RATIO_UNSPECIFIED`
- **Creation Time**: ISO 8601 timestamp
- **Media Generation ID**: Unique identifier for the generated image
- **Workflow ID**: Identifier for the generation workflow
- **Prompt**: The user's input prompt

### Example Image Metadata Structure

```json
{
  "image": {
    "encodedImage": "iVBORw0KGgo...",
    "seed": 658680,
    "mediaGenerationId": "CAMaJDgzMzQxYj...",
    "mediaVisibility": "PUBLIC",
    "prompt": "A sculptural, stylized hippopotamus...",
    "modelNameType": "IMAGEN_3_5",
    "previousMediaGenerationId": "",
    "workflowId": "83341b7e-ad47-4f68-b395-34576fef6fb3",
    "fingerprintLogRecordId": "160bdc80f00000000000000000000000",
    "aspectRatio": "IMAGE_ASPECT_RATIO_UNSPECIFIED"
  },
  "createTime": "2025-05-12T22:31:08.258249Z",
  "backboneMetadata": {
    "mediaCategory": "MEDIA_CATEGORY_BOARD",
    "recipeInput": {
      "userInput": { "userInstructions": "..." },
      "mediaInputs": [...]
    }
  }
}
```

---

## API Request Sequence

During image generation, the application follows this sequence:

1. Check app availability (PINHOLE tool)
2. Fetch tool availability (BACKBONE)
3. Fetch user acknowledgements (multiple versions)
4. Fetch user locale
5. Get user session and access token
6. Fetch feature availability (WHISK_R2I features)
7. Fetch user preferences
8. Check video credit status
9. Generate image (through Whisk backend)
10. Retrieve generated image via media endpoint

---

## Network Capture Statistics

- **Total Requests Captured**: 56
- **Total Duration**: 56,076 ms (~56 seconds)
- **Common Response Headers**:
  - `cache-control: private`
  - `content-type: application/json`
  - `server: ESF` or `Google Frontend`
  - `access-control-allow-origin: https://labs.google`

