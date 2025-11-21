# MusicFX API Calls Summary

## Primary Music Generation Request

- **URL**: `https://aisandbox-pa.googleapis.com/v1:soundDemo`
- **Method**: `POST`
- **Status**: 200 OK
- **Payload (example)**:
  ```json
  {
    "generationCount": 2,
    "input": { "textInput": "Toe-tapping, foot-stomping Americana" },
    "loop": false,
    "soundLengthSeconds": 30,
    "model": "DEFAULT",
    "clientContext": {
      "tool": "MUSICLM_V2",
      "sessionId": ";1763664795734"
    }
  }
  ```
- **Purpose**: Requests two 30-second audio clips from the DEFAULT MusicFX model using the provided text prompt.

---

## Supporting Requests Observed

### 1) CORS Preflight
- **URL**: `https://aisandbox-pa.googleapis.com/v1:soundDemo`
- **Method**: `OPTIONS`
- **Headers**:
  ```
  Access-Control-Request-Method: POST
  Access-Control-Request-Headers: authorization
  Origin: https://labs.google
  Sec-Fetch-Mode: cors
  ```
- **Response**: 200 OK, allows `POST` with `authorization` header.

### 2) Event Logging (tRPC)
- **URL**: `https://labs.google/fx/api/trpc/general.submitBatchLog`
- **Method**: `POST`
- **Payload (example)**:
  ```json
  {
    "json": {
      "appEvents": [
        {
          "event": "IM_FEELING_LUCKY",
          "eventProperties": [
            { "key": "TOOL_NAME", "stringValue": "MUSICLM_V2" },
            { "key": "USER_AGENT", "stringValue": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36" },
            { "key": "IS_DESKTOP" }
          ],
          "activeExperiments": [],
          "eventMetadata": { "sessionId": ";1763664795734" },
          "eventTime": "2025-11-20T18:44:44.989Z"
        }
      ]
    }
  }
  ```
- **Response**:
  ```json
  {
    "result": {
      "data": {
        "json": {
          "result": {},
          "status": 200,
          "statusText": "OK"
        }
      }
    }
  }
  ```
- **Purpose**: Logs UI action for “I’m Feeling Lucky” generation in MusicFX.

---

## Common Request Headers

```
Authorization: Bearer {access_token}
Content-Type: application/json or text/plain;charset=UTF-8
Referer: https://labs.google/
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36
sec-ch-ua: "Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
```

---

## Response Characteristics

- `soundDemo` responds with JSON; audio payload is returned in the body (encoded, size observed ~17 MB compressed via gzip).
- CORS responses include:
  - `access-control-allow-origin: https://labs.google`
  - `access-control-allow-credentials: true`
  - `access-control-allow-headers: authorization`
  - `access-control-allow-methods: DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT`
  - `access-control-max-age: 3600`

---

## Observed Sequence for a Music Generation

1. Browser sends CORS preflight (`OPTIONS`) to `v1:soundDemo`.
2. Main music creation request (`POST v1:soundDemo`) with prompt, duration, generationCount, and session context.
3. Event log submission (`POST general.submitBatchLog`) capturing the UI action and session metadata.

---

## Capture Stats (this session)

- **Total Requests Captured**: 3
- **Duration**: ~63 s
- **Largest Response**: `v1:soundDemo` (~17 MB compressed, gzip)
