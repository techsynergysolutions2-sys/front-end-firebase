import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  BarChart3,
  Users,
  Boxes,
  ClipboardList,
  Briefcase,
  Ticket,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers3,
  Globe2,
  Clock3,
} from "lucide-react";


export default function About() {

  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "#050816",
        minHeight: "100vh",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* HERO BACKGROUND */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            background: "rgba(37,99,235,0.2)",
            filter: "blur(140px)",
            top: 0,
            left: 0,
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            background: "rgba(147,51,234,0.2)",
            filter: "blur(140px)",
            bottom: 0,
            right: 0,
          }}
        />
      </div>

      {/* NAVBAR */}
      <nav
        className="navbar navbar-expand-lg navbar-dark border-bottom"
        style={{
          background: "rgba(5,8,22,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <div className="container py-2">
          <a className="navbar-brand d-flex align-items-center gap-3" href="#">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background:
                  "linear-gradient(135deg, #6da3fa, #a864e8)",
              }}
            >
              {/* <Layers3 size={20} /> */}
              <img
                  src="https://firebasestorage.googleapis.com/v0/b/crm-solutions-34e5f.firebasestorage.app/o/Logo.png?alt=media&token=256064a5-ba6a-4a42-837f-368fb4fde59d"
                  width={30}
                />
                
            </div>

            <div>
              <div className="fw-bold fs-4">Eben CRM</div>
              <small className="text-secondary">
                Business Management Platform
              </small>
            </div>
          </a>

          <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav align-items-lg-center gap-lg-4">
              <li className="nav-item">
                <a className="nav-link text-light" href="#features">
                  Features
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link text-light" href="#security">
                  Security
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link text-light" href="#pricing">
                  Pricing
                </a>
              </li>

              <li className="nav-item">
                <button className="btn btn-light px-4 rounded-4 fw-semibold" onClick={() => navigate('/login')}>
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="py-5">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            {/* LEFT */}
            <div className="col-lg-6">
              <div
                className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill mb-4"
                style={{
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  color: "#93c5fd",
                }}
              >
                <Sparkles size={16} />
                Eben CRM SaaS Platform
              </div>

              <h1
                className="fw-bold mb-4"
                style={{
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                  lineHeight: 1.1,
                }}
              >
                The CRM Built To
                <span
                  style={{
                    display: "block",
                    background:
                      "linear-gradient(to right, #60a5fa, #c084fc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Scale Your Business
                </span>
              </h1>

              <p
                className="text-secondary mb-5"
                style={{
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                }}
              >
                Manage customers, sales, inventory, support tickets,
                projects, teams, and operations from one simple
                enterprise platform designed for modern businesses.
              </p>

              {/* <div className="d-flex flex-wrap gap-3 mb-5">
                <button
                  className="btn btn-primary px-4 py-3 rounded-4 fw-semibold d-flex align-items-center gap-2"
                  style={{
                    background:
                      "linear-gradient(to right, #3b82f6, #9333ea)",
                    border: "none",
                  }}
                >
                  Start Free Trial
                  <ArrowRight size={18} />
                </button>

                <button
                  className="btn px-4 py-3 rounded-4 text-white"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  Book Demo
                </button>
              </div> */}

              {/* STATS */}
              <div className="row g-3">
                <Stat number="99.9%" label="Uptime" />
                <Stat number="24/7" label="Support" />
                {/* <Stat number="150+" label="Businesses" /> */}
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-lg-6">
              <div
                className="p-2 rounded-5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2))",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop"
                  alt="CRM Dashboard"
                  className="img-fluid rounded-5 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5 mb-3">
              Everything Your Business Needs
            </h2>

            <p className="text-secondary mx-auto" style={{ maxWidth: 700 }}>
              Replace disconnected systems with a unified enterprise
              platform designed to streamline operations and increase
              productivity.
            </p>
          </div>

          <div className="row g-4">
            <FeatureCard
              icon={<Boxes />}
              title="Inventory Management"
              desc="Track stock levels, suppliers, and product movement in real-time."
            />

            <FeatureCard
              icon={<ClipboardList />}
              title="Orders & Invoicing"
              desc="Manage quotations, invoices, sales orders, and fulfillment workflows."
            />

            <FeatureCard
              icon={<BarChart3 />}
              title="Analytics"
              desc="Interactive dashboard."
            />

            <FeatureCard
              icon={<Briefcase />}
              title="Project Management"
              desc="Manage projects, deadlines, and collaboration from one place."
            />

            <FeatureCard
              icon={<Users />}
              title="Clients Management"
              desc="Centralize client communication and relationship tracking."
            />

            <FeatureCard
              icon={<Ticket />}
              title="Support Ticketing"
              desc="Deliver exceptional customer support with automated ticket workflows."
            />
          </div>
        </div>
      </section>

      {/* PRODUCTIVITY */}
      <section className="py-5">
        <div className="container py-5">
          <div
            className="p-5 rounded-5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1400&auto=format&fit=crop"
                  className="img-fluid rounded-5"
                  alt="Team"
                />
              </div>

              <div className="col-lg-6">
                <h2 className="fw-bold display-6 mb-4">
                  Built For Modern Teams
                </h2>

                <p
                  className="text-secondary mb-4"
                  style={{ lineHeight: 1.8 }}
                >
                  Empower your organization with centralized workflows,
                  automation, and analytics.
                </p>

                <div className="d-flex flex-column gap-3">
                  <Benefit text="Manage employees and permissions" />
                  {/* <Benefit text="Automate repetitive workflows" /> */}
                  <Benefit text="Improve productivity and collaboration" />
                  <Benefit text="Scale with confidence" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section id="security" className="py-5">
        <div className="container py-5">
          <div
            className="rounded-5 p-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1))",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="row g-5 align-items-center">
              <div className="col-lg-6">
                <div
                  className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill mb-4"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    color: "#86efac",
                  }}
                >
                  <ShieldCheck size={16} />
                  Enterprise Security
                </div>

                <h2 className="fw-bold display-6 mb-4">
                  Secure, Reliable & Scalable
                </h2>

                <p
                  className="text-secondary"
                  style={{ lineHeight: 1.8 }}
                >
                  Protect your organization using advanced permissions, and
                  encrypted infrastructure.
                </p>
              </div>

              <div className="col-lg-6">
                <div className="row g-3">
                  <Metric label="System Uptime" value="99.9%" />
                  <Metric label="Data Encryption" value="256-bit" />
                  <Metric label="Cloud Infrastructure" value="Enterprise" />
                  <Metric label="24/7 Support" value="Available" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5 mb-3">
              Affordable Enterprise Pricing
            </h2>

            <p className="text-secondary">
              Powerful enterprise tools at startup-friendly pricing.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div
                className="rounded-5 p-5 text-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(14px)",
                }}
              >
                <div
                  className="d-inline-block px-4 py-2 rounded-pill mb-4"
                  style={{
                    background:
                      "linear-gradient(to right, #3b82f6, #9333ea)",
                  }}
                >
                  All in one
                </div>

                <h3 className="fw-bold mb-3">Enterprise CRM Suite</h3>

                <div className="mb-5">
                  <span
                    className="fw-bold"
                    style={{ fontSize: "4rem" }}
                  >
                    $4.99
                  </span>

                  <span className="text-secondary fs-5">
                    {" "}
                    / user / month
                  </span>
                </div>

                <div className="row text-start g-3 mb-5">
                  <PricingFeature text="Unlimited customers" />
                  <PricingFeature text="Inventory management" />
                  <PricingFeature text="Project management" />
                  <PricingFeature text="Sales & invoicing" />
                  <PricingFeature text="Analytics" />
                  <PricingFeature text="Role permissions" />
                  <PricingFeature text="Tasks" />
                  <PricingFeature text="Tickets" />
                  <PricingFeature text="Employee Leaves" />
                  <PricingFeature text="EbenCRM Android Application (Apple coming soon)" />
                  <PricingFeature text="Everything included in one price" />
                </div>

                <button
                  className="btn btn-lg w-100 text-white fw-semibold rounded-4 py-3"
                  style={{
                    background:
                      "linear-gradient(to right, #3b82f6, #9333ea)",
                    border: "none",
                  }}
                  onClick={() => navigate('/register')}
                >
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container py-5">
          <div
            className="rounded-5 p-5 text-center"
            style={{
              background:
                "linear-gradient(to right, #2563eb, #7c3aed)",
            }}
          >
            <h2 className="fw-bold display-5 mb-4">
              Ready To Grow Your Business?
            </h2>

            <p
              className="mx-auto mb-5 text-light"
              style={{ maxWidth: 700 }}
            >
              Join businesses already using our CRM to simplify
              operations, improve customer relationships, and scale
              faster.
            </p>

            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button className="btn btn-light btn-lg px-5 rounded-4 fw-semibold" onClick={() => navigate('/register')}>
                Get Started
              </button>

              {/* <button className="btn btn-outline-light btn-lg px-5 rounded-4">
                Contact Sales
              </button> */}
            </div>
            <br/>
             Email: support@ebencrm.com
          </div>
        </div>
      </section>
    </div>
  );
}

/* FEATURE CARD */
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="col-md-6 col-xl-4">
      <div
        className="h-100 p-4 rounded-5"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center mb-4"
          style={{
            width: 60,
            height: 60,
            borderRadius: 20,
            background:
              "linear-gradient(135deg, #3b82f6, #9333ea)",
          }}
        >
          {icon}
        </div>

        <h3 className="fw-bold mb-3">{title}</h3>

        <p className="text-secondary">{desc}</p>
      </div>
    </div>
  );
}

/* BENEFITS */
function Benefit({ text }) {
  return (
    <div className="d-flex align-items-center gap-3">
      <CheckCircle2 className="text-primary" size={20} />
      <span>{text}</span>
    </div>
  );
}

/* STATS */
function Stat({ number, label }) {
  return (
    <div className="col-4">
      <div
        className="p-4 rounded-4 text-center"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h3 className="fw-bold">{number}</h3>
        <div className="text-secondary small">{label}</div>
      </div>
    </div>
  );
}

/* METRIC */
function Metric({ label, value }) {
  return (
    <div className="col-6">
      <div
        className="p-4 rounded-4"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="text-secondary small mb-2">{label}</div>
        <div className="fw-bold fs-3">{value}</div>
      </div>
    </div>
  );
}

/* PRICING FEATURE */
function PricingFeature({ text }) {
  return (
    <div className="col-md-6">
      <div className="d-flex align-items-center gap-3">
        <CheckCircle2 className="text-success" size={20} />
        <span>{text}</span>
      </div>
    </div>
  );
}