import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-[#070f2b] text-white font-sans">

      {/* HERO */}
      <section className="text-center py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl opacity-40" />

        <h1 className="text-5xl font-semibold mb-6 leading-tight">
          The CRM That <span className="text-blue-400">Scales With You</span>
        </h1>

        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Manage clients, projects, tasks, and your entire business workflow 
          from one beautifully designed platform.
        </p>

        <div className="mt-8 inline-block bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10">
          <span className="text-2xl font-semibold">$4.99</span>
          <span className="text-gray-400 ml-2">/ user / month</span>
        </div>

        <div className="mt-8">
          <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 transition rounded-xl text-lg shadow-lg shadow-blue-500/20">
            Get Started
          </button>
        </div>
      </section>

      {/* IMAGE */}
      <section className="px-6 max-w-6xl mx-auto mb-20">
        <img
          src="https://via.placeholder.com/1200x500?text=CRM+Dashboard"
          alt="CRM Dashboard"
          className="rounded-2xl shadow-2xl border border-white/10"
        />
      </section>

      {/* FEATURES */}
      <section className="px-6 max-w-6xl mx-auto mb-24">
        <h2 className="text-3xl font-semibold mb-10">Core Features</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card title="Inventory" desc="Track stock in real-time" />
          <Card title="Orders" desc="Manage orders seamlessly" />
          <Card title="Analytics" desc="Powerful business insights" />
          <Card title="Tasks" desc="Stay on top of daily work" />
          <Card title="Projects" desc="Organize your workflows" />
          <Card title="Tickets" desc="Handle support efficiently" />
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="px-6 max-w-6xl mx-auto mb-24">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-10">
          <h2 className="text-3xl font-semibold mb-4">Built for Productivity</h2>
          <p className="text-gray-300 max-w-2xl">
            From task tracking to full project management, our CRM helps your team stay aligned,
            efficient, and focused on what matters most.
          </p>
        </div>
      </section>

      {/* MANAGEMENT */}
      <section className="px-6 max-w-6xl mx-auto mb-24">
        <h2 className="text-3xl font-semibold mb-10">Business Management</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card title="Employees" desc="Manage your team easily" />
          <Card title="Clients" desc="Build stronger relationships" />
          <Card title="Departments" desc="Structure your business" />
          <Card title="Groups" desc="Organize roles and access" />
          <Card title="Permissions" desc="Secure your data" />
        </div>
      </section>

      {/* SECOND IMAGE */}
      <section className="px-6 max-w-6xl mx-auto mb-24">
        <img
          src="https://via.placeholder.com/1200x500?text=Team+Management"
          alt="Team Management"
          className="rounded-2xl shadow-2xl border border-white/10"
        />
      </section>

      {/* WHY */}
      <section className="px-6 max-w-6xl mx-auto mb-24">
        <h2 className="text-3xl font-semibold mb-8">Why Businesses Choose Us</h2>

        <div className="grid md:grid-cols-2 gap-6 text-gray-300">
          <p>✔ All-in-one platform for your entire business</p>
          <p>✔ Clean and modern user experience</p>
          <p>✔ Built for scalability</p>
          <p>✔ Enterprise-grade security</p>
          <p>✔ Affordable pricing</p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 shadow-2xl">
          <h2 className="text-3xl font-semibold mb-4">
            Start Growing Your Business Today
          </h2>
          <p className="text-gray-200 mb-6">
            Join teams already using our CRM to work smarter.
          </p>

          <button className="px-8 py-3 bg-white text-black rounded-xl font-medium hover:opacity-90 transition">
            Get Started
          </button>
        </div>
      </section>

    </div>
  );
}

/* COMPONENT */
function Card({ title, desc }) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 hover:scale-105 transition duration-300">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}