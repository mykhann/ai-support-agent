import mongoose from "mongoose";
import dotenv from "dotenv";
import FAQ from "../models/faq.models.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const faqs = [
  // Account & Security
  {
    question: "How do I reset my password?",
    answer: "Go to the login page and click on 'Forgot Password'. Enter your registered email address and follow the instructions sent to your inbox to reset your password."
  },
  {
    question: "How do I change my email address?",
    answer: "Navigate to your Profile Settings > Account Information. Click on 'Change Email' and follow the verification process to update your email address."
  },
  {
    question: "How do I enable two-factor authentication?",
    answer: "Go to Security Settings > Two-Factor Authentication. Click 'Enable' and follow the setup wizard to link your authenticator app."
  },
  {
    question: "How do I delete my account?",
    answer: "Go to Settings > Privacy & Security > Delete Account. You'll need to confirm your password and acknowledge that all data will be permanently removed."
  },
  {
    question: "How do I update my profile information?",
    answer: "Click on your avatar in the top right > Profile Settings. You can update your name, profile picture, and contact information there."
  },

  // Webhooks & Integrations
  {
    question: "What is the retry policy for failing webhook integrations?",
    answer: "The system will retry failed webhook deliveries up to 5 times with exponential backoff (1s, 2s, 4s, 8s, 16s). After 5 failures, the webhook is marked as failed and logged for manual review."
  },
  {
    question: "How do I authenticate incoming webhooks from external services?",
    answer: "Use HMAC-SHA256 signatures. Generate a secret key in your webhook settings, and verify incoming requests by comparing the signature header with your computed HMAC of the request body."
  },
  {
    question: "How do I create a new webhook endpoint?",
    answer: "Go to Developer Settings > Webhooks. Click 'Create Webhook', enter your endpoint URL, select events to subscribe to, and save. You'll receive a test ping to verify connectivity."
  },
  {
    question: "How do I test webhook integrations?",
    answer: "Use the Webhook Testing Tool in Developer Settings. You can send test payloads, view delivery logs, and debug failed deliveries. Enable 'Test Mode' to simulate different scenarios."
  },

  // API & Rate Limiting
  {
    question: "What is the API rate limit?",
    answer: "The API rate limit is 100 requests per minute per API key. If you exceed this, you'll receive a 429 Too Many Requests response. Contact support for higher limits."
  },
  {
    question: "How do I create a new API key?",
    answer: "Go to Developer Settings > API Keys. Click 'Generate New Key', give it a name, select permissions, and save the key immediately (it won't be shown again)."
  },
  {
    question: "How do I revoke an API key?",
    answer: "Go to Developer Settings > API Keys. Find the key you want to revoke and click 'Revoke'. This action is immediate and cannot be undone."
  },
  {
    question: "What are API key permissions and scopes?",
    answer: "API keys have granular permissions: Read (GET), Write (POST/PUT), Delete (DELETE), and Admin (full access). Scopes limit access to specific resources like webhooks, jobs, or analytics."
  },

  // Queue & Jobs
  {
    question: "How do I clear a stalled task or job?",
    answer: "Navigate to the Admin Dashboard > Queue Management. Identify the stalled job and click 'Force Clear' or 'Retry'. You can also use the API endpoint /api/queue/clear/{jobId}."
  },
  {
    question: "How do I monitor job queue status?",
    answer: "Access the Queue Dashboard at /dashboard/queue. You'll see real-time metrics: pending jobs, active jobs, completed jobs, and failed jobs with timestamps."
  },
  {
    question: "How do I prioritize jobs in the queue?",
    answer: "Set the 'priority' field when creating a job (values: 1-5, where 1 is highest). Jobs with higher priority are processed first. You can also use the 'Reorder Queue' feature in the dashboard."
  },
  {
    question: "What happens to failed jobs?",
    answer: "Failed jobs are moved to the 'Failed' queue with error logs. They remain there for 7 days. You can retry, mark as resolved, or permanently delete them from the dashboard."
  },

  // Billing & Subscription
  {
    question: "How do I change my billing plan?",
    answer: "Navigate to Billing > Subscription. Click 'Change Plan' and select your desired tier. Your account will be prorated and updated immediately."
  },
  {
    question: "How do I update my payment method?",
    answer: "Go to Billing > Payment Methods. Click 'Add Payment Method' or 'Update Card'. Enter your new card details and set it as default for future payments."
  },
  {
    question: "How do I view my billing history?",
    answer: "Go to Billing > Invoices. You'll see a list of all past invoices with payment status, amounts, and PDF download options. Invoices are generated on the 1st of each month."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "Go to Billing > Subscription. Click 'Cancel Subscription' and confirm. Your access will continue until the end of your current billing cycle, then downgrade to the Free plan."
  },

  // Notifications & Alerts
  {
    question: "How do I set up email notifications?",
    answer: "Go to Settings > Notifications. Toggle the email notifications switch and select which events you want to receive notifications for (webhook failures, job completions, etc.)."
  },
  {
    question: "How do I configure Slack alerts?",
    answer: "Go to Settings > Integrations > Slack. Click 'Connect Workspace', authorize the app, and configure which events should trigger Slack notifications."
  },
  {
    question: "How do I set up custom alerts?",
    answer: "Go to Monitoring > Alerts. Click 'Create Alert', define the condition (e.g., error rate > 5%), select notification channels, and save. You'll be alerted when the condition is met."
  },

  // Monitoring & Logging
  {
    question: "How do I monitor system health?",
    answer: "Access the Monitoring Dashboard at /dashboard/monitor. You'll see real-time metrics including response times, error rates, queue lengths, and system resource usage."
  },
  {
    question: "How do I enable debug logging?",
    answer: "Add 'DEBUG=true' to your environment variables or toggle 'Enable Debug Mode' in the Admin Settings. This will provide detailed logs for troubleshooting."
  },
  {
    question: "How do I view system logs?",
    answer: "Go to Admin > System Logs. You can filter by date, severity level (info, warning, error), and service. Download logs for offline analysis."
  },

  // Deployment & Configuration
  {
    question: "How do I rollback a deployment?",
    answer: "Go to Deployments > History. Find the previous successful deployment and click 'Rollback'. The system will revert to that version within 2-3 minutes."
  },
  {
    question: "How do I set up environment variables?",
    answer: "Go to Settings > Environment Variables. Click 'Add Variable', enter the key-value pair, and click 'Save'. The system will restart with the new variables applied."
  },
  {
    question: "How do I configure custom domains?",
    answer: "Go to Settings > Custom Domains. Enter your domain, follow the DNS configuration instructions (add CNAME record), and click 'Verify'. SSL certificates are auto-generated."
  },

  // User Management
  {
    question: "How do I add team members?",
    answer: "Go to Team Management > Invite Members. Enter their email address, assign a role (Admin, Editor, Viewer), and send the invitation. They'll receive an email to join."
  },
  {
    question: "How do I remove a team member?",
    answer: "Go to Team Management > Members. Find the user, click the 'Remove' button, and confirm. The user will lose all access to the workspace immediately."
  },
  {
    question: "How do I assign roles and permissions?",
    answer: "Go to Team Management > Roles. Admins have full access, Editors can create/modify resources, and Viewers can only read data. You can create custom roles with granular permissions."
  },

  // Data & Export
  {
    question: "How do I export my data?",
    answer: "Go to Settings > Data Export. Choose your preferred format (CSV, JSON, or Excel), select the data range, and click 'Export'. You'll receive a download link via email."
  },
  {
    question: "How do I schedule automated backups?",
    answer: "Go to Settings > Backups. Toggle 'Enable Automated Backups', select frequency (daily/weekly/monthly), and choose the data to include. Backups are stored securely in cloud storage."
  },
  {
    question: "How do I restore from a backup?",
    answer: "Go to Settings > Backups > Restore. Select the backup timestamp and click 'Restore'. The process takes 5-15 minutes and the system will be temporarily paused during restoration."
  }
];

const seedFAQs = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing FAQs (optional)
    // await FAQ.deleteMany({});
    // console.log("Cleared existing FAQs");

    // Insert new FAQs
    const result = await FAQ.insertMany(faqs);
    console.log(`✅ Successfully added ${result.length} FAQs to the database`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding FAQs:", error.message);
    process.exit(1);
  }
};

seedFAQs();