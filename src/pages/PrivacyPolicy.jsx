
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-light min-vh-100">
      {/* Hero */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">Privacy Policy</h1>
          <p className="lead mb-0">
            Your privacy and data security are important to us.
          </p>
          <small>Last Updated: June 2026</small>
        </div>
      </section>

      {/* Content */}
      <section className="py-5">
        <div className="container">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-lg-5">

              <h2>Introduction</h2>
              <p>
                Welcome to Eben CRM. We are committed to protecting your privacy
                and safeguarding your personal and business information. This
                Privacy Policy explains how we collect, use, store, and protect
                information when you use our website, platform, and mobile
                applications.
              </p>

              <hr />

              <h2>Information We Collect</h2>

              <h5>Account Information</h5>
              <ul>
                <li>First and last name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Department and job title</li>
                <li>User permissions and roles</li>
                <li>Profile photo (optional)</li>
              </ul>

              <h5>Business Data</h5>
              <ul>
                <li>Tasks and projects</li>
                <li>Support tickets</li>
                <li>Orders and inventory records</li>
                <li>Employee records</li>
                <li>Client information</li>
                <li>Uploaded documents and files</li>
              </ul>

              <hr />

              <h2>How We Use Information</h2>

              <p>We use collected information to:</p>

              <ul>
                <li>Provide and maintain our services</li>
                <li>Manage user accounts</li>
                <li>Authenticate users</li>
                <li>Deliver notifications and updates</li>
                <li>Improve platform performance</li>
                <li>Provide customer support</li>
                <li>Prevent fraud and unauthorized access</li>
                <li>Comply with legal obligations</li>
              </ul>

              <hr />

              <h2>Push Notifications</h2>

              <p>
                Our mobile applications may send push notifications related to:
              </p>

              <ul>
                <li>Task assignments</li>
                <li>Project updates</li>
                <li>Support ticket activity</li>
                <li>Order updates</li>
                <li>System notifications</li>
              </ul>

              <p>
                Users may disable notifications through their device settings at
                any time.
              </p>

              <hr />

              <h2>Data Security</h2>

              <p>
                We implement industry-standard security measures to protect your
                information, including:
              </p>

              <ul>
                <li>Secure authentication systems</li>
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Role-based access controls</li>
                <li>Cloud-hosted infrastructure</li>
                <li>Regular security monitoring</li>
              </ul>

              <p>
                While we strive to protect your information, no electronic
                storage method can be guaranteed to be completely secure.
              </p>

              <hr />

              <h2>Data Sharing</h2>

              <p>
                We do not sell personal information to third parties.
              </p>

              <p>
                Information may only be shared with trusted service providers
                that help us operate our platform, including:
              </p>

              <ul>
                <li>Cloud hosting providers</li>
                <li>Authentication providers</li>
                <li>Analytics services</li>
                <li>Notification services</li>
              </ul>

              <hr />

              <h2>Data Retention</h2>

              <p>
                We retain information only for as long as necessary to provide
                our services, comply with legal requirements, and support
                business operations.
              </p>

              <hr />

              <h2>Your Rights</h2>

              <p>You may have the right to:</p>

              <ul>
                <li>Access your personal information</li>
                <li>Request corrections</li>
                <li>Request deletion of your data</li>
                <li>Restrict certain processing activities</li>
                <li>Request a copy of your information</li>
              </ul>

              <hr />

              <h2>Children's Privacy</h2>

              <p>
                Eben CRM is designed for business use and is not intended for
                individuals under the age of 18.
              </p>

              <hr />

              <h2>Third-Party Services</h2>

              <p>
                Our platform may use services provided by trusted third parties,
                including:
              </p>

              <ul>
                <li>Firebase Authentication</li>
                <li>Firebase Cloud Messaging</li>
                <li>Firebase Storage</li>
                <li>Analytics services</li>
              </ul>

              <hr />

              <h2>Changes to This Policy</h2>

              <p>
                We may update this Privacy Policy from time to time. Changes
                will be posted on this page along with an updated revision date.
              </p>

              <hr />

              <h2>Contact Us</h2>

              <div className="alert alert-primary">
                <strong>Eben CRM</strong>
                <br />
                Email: support@ebencrm.com
                <br />
                Website: https://eben-crm.com/crm
              </div>

              <p className="text-muted mb-0">
                By using Eben CRM, you acknowledge that you have read and agree
                to this Privacy Policy.
              </p>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
