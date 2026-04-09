import React, { useEffect, useState } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";

function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // track fetch errors
  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    duration: "monthly",
    features: "",
    popular: false,
  });

  // Fetch all plans
  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/plans");
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      setError("Failed to load plans. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit new or updated plan
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, features: JSON.stringify(form.features ? form.features.split(",") : []) };

    try {
      const method = form.id ? "PUT" : "POST";
      const url = form.id ? `http://localhost:5000/plans/${form.id}` : "http://localhost:5000/plans";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      await res.json();
      setForm({ id: "", name: "", price: "", description: "", duration: "monthly", features: "", popular: false });
      fetchPlans();
    } catch (err) {
      console.error("Failed to save plan:", err);
      setError("Failed to save plan. Try again.");
    }
  };

  // Edit plan
  const handleEdit = (plan) => {
    setForm({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      description: plan.description || "",
      duration: plan.duration || "monthly",
      features: Array.isArray(plan.features) ? plan.features.join(",") : "",
      popular: plan.popular || false,
    });
  };

  // Delete plan
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      const res = await fetch(`http://localhost:5000/plans/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      fetchPlans();
    } catch (err) {
      console.error("Failed to delete plan:", err);
      setError("Failed to delete plan. Try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Plans</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded shadow-sm bg-white">
        <input
          type="text"
          placeholder="Plan Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mb-2 w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="mb-2 w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Duration (monthly/yearly)"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          className="mb-2 w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mb-2 w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Features (comma separated)"
          name="features"
          value={form.features}
          onChange={handleChange}
          className="mb-2 w-full p-2 border rounded"
        />
        <label className="flex items-center mb-2">
          <input type="checkbox" name="popular" checked={form.popular} onChange={handleChange} className="mr-2" />
          Popular Plan
        </label>
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded flex items-center gap-2 hover:bg-blue-600 transition"
        >
          <Save size={16} /> {form.id ? "Update Plan" : "Add Plan"}
        </button>
      </form>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <Loader2 size={32} className="animate-spin text-blue-500" />
        </div>
      )}

      {/* Plans Table */}
      {!loading && plans.length > 0 && (
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Duration</th>
              <th className="border p-2">Popular</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-gray-50">
                <td className="border p-2">{plan.name}</td>
                <td className="border p-2">${plan.price}</td>
                <td className="border p-2">{plan.duration}</td>
                <td className="border p-2">{plan.popular ? "Yes" : "No"}</td>
                <td className="border p-2 flex gap-2">
                  <button onClick={() => handleEdit(plan)} className="p-1 bg-yellow-400 rounded hover:bg-yellow-500">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && plans.length === 0 && (
        <div className="mt-4 text-gray-600">No plans available. Add a plan to get started.</div>
      )}
    </div>
  );
}

export default AdminPlans;