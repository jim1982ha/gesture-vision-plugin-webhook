# gesture-vision-plugin-webhook

Sends HTTP requests to a specified URL.

---

<p align="center">
  <img src="https://raw.githubusercontent.com/jim1982ha/gesture-vision/main/packages/frontend/public/icons/icon-72.webp" width="80" alt="Webhook Plugin Icon">
</p>
<h1 align="center">GestureVision - Webhook Plugin</h1>
<p align="center">
  <strong>Connect GestureVision to countless web services and APIs like IFTTT, Zapier, or your own custom endpoints.</strong>
</p>

---

The Webhook plugin is a versatile tool for sending generic HTTP requests when a gesture is detected. This allows for powerful integrations with virtually any web-based service that can receive incoming requests.

## ✨ Key Features

-   **Flexible Methods:** Supports `GET`, `POST`, `PUT`, and `DELETE` HTTP methods.
-   **Custom Payloads:** Define a custom request body, with support for templates to include dynamic data like gesture name and confidence score.
-   **Custom Headers:** Add any necessary HTTP headers, such as `Content-Type` or `Authorization` for authenticated APIs.
-   **Robust & Reliable:** Includes automatic retries for transient network errors or server-side issues (5xx status codes).

## 🔧 Configuration

This plugin has no global configuration. All settings are configured per action.

### Action Configuration

When you select "Webhook" as the Action Type for a gesture, you will see the following fields:

-   **Webhook URL:** The full URL of the endpoint you want to send the request to.
-   **Method:** The HTTP method to use (`POST`, `GET`, etc.).
-   **Headers (JSON, Optional):** A JSON object for any custom headers. For example: `{"Content-Type": "application/json", "Authorization": "Bearer YOUR_TOKEN"}`.
-   **Body Template (Optional):** The request body. You can use variables:
    -   `{{gestureName}}`: The name of the detected gesture.
    -   `{{confidence}}`: The confidence score (0.0 to 1.0).
    -   `{{timestamp}}`: The timestamp of the detection.

## 🚀 Usage Example

**Goal:** Send a notification to a Discord channel via a Discord Webhook URL when a "Victory" gesture is detected.

1.  In Discord, create a Webhook for your desired channel and copy its URL.
2.  Go to the **Gesture Settings** panel in the GestureVision UI.
3.  Select **"Victory"** from the Gesture dropdown.
4.  For **Action Type**, select **"Webhook"**.
5.  Configure the action settings:
    -   **Webhook URL:** (Paste your Discord Webhook URL here)
    -   **Method:** `POST`
    -   **Headers:** `{"Content-Type": "application/json"}`
    -   **Body Template:** `{"content": "Victory gesture detected with {{confidence}}% confidence!"}`
6.  Click **Add Configuration**.

Now, when you make a victory sign, a message will be posted to your Discord channel.

---

Part of the **GestureVision** application.