// app/contact/page.tsx
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", agency: "", phone: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || !form.agency || !form.phone) {
      toast('Please fill all required fields!', {
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
      const res = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast.success("We have received your message! Thanks for Referring a guest to us.", {
        duration: 10000, // 10 seconds
      });
      setForm({ name: "", agency: "", phone: "", email: "", message: "" });
    } catch (error) {
      toast.error('Error occurred while sending message!');
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
      <h1 className="text-2xl font-bold mb-4">Refer a Guest</h1>
      {/* New text for the referral form */}
      <p className="text-gray-700 mb-6 text-lg">
        <b>Are you a travel agency?</b> Earn <b>8% commission</b> on the total booking price for every guest you refer! Simply share your information below—we'd love to partner with you and will follow up with more details soon.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="agency">Travel Agency Name</Label>
          <Input id="agency" name="agency" value={form.agency} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
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