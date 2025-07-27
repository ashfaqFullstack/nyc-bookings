// app/contact/page.tsx
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast('Please fill all fields!', {
        icon: '⚠️',
        style: {
          background: '#facc15', // yellow-400
          color: '#000',
          fontWeight: 'bold',
        },
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });


      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast.success("We have received your message! We will contact you shortly.", {
        duration: 10000, // 10 seconds
      });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Error Occurred while Sending Message!", {
        duration: 4000, // 4 seconds
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl my-[3%] mx-auto p-4">
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      {/* Added the new text here */}
      <p className="text-gray-700 mb-6 text-lg">
        Have a question or interested in a specific place? Reach out to us through the form below—we're here to help and will get back to you as soon as possible.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} required />
        </div>
        <Button type="submit" className="bg-[#2575b8] hover:bg-[#2575b8]/80" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}