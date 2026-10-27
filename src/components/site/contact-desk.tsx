'use client';
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/site/button";

export function ContactDesk() {
  const router = useRouter();
  const [sending, setSending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (key: string) => String(data.get(key) ?? "").trim();
    const role = field("role") === "supplier" ? "supplier" : "business";
    const name = field("name");
    const email = field("email");
    const message = field("message");
    if (!name || !email || !message) {
      toast.error("Please fill in your name, email and requirement.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiry_type: role,
          name,
          company_name: field("company"),
          email,
          phone: field("phone"),
          budget: field("budget"),
          message,
          product_desc: role === "supplier" ? message : undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not send your enquiry.");
      toast.success("Thanks, your enquiry has been received.");
      router.push(`/enquiry-sent?type=${role}&ref=${encodeURIComponent(json.referenceId || "")}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" autoComplete="organization" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="role">I am</label>
          <select id="role" name="role" defaultValue="business">
            <option value="business">A business looking for a solution</option>
            <option value="supplier">A supplier interested in distribution</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="budget">Budget range</label>
          <select id="budget" name="budget" defaultValue="">
            <option value="">Not sure yet</option>
            <option value="Under ₹50,000">Under ₹50,000</option>
            <option value="₹50,000 – ₹2,00,000">₹50,000 – ₹2,00,000</option>
            <option value="₹2,00,000 – ₹10,00,000">₹2,00,000 – ₹10,00,000</option>
            <option value="Above ₹10,00,000">Above ₹10,00,000</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">Requirement</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          placeholder="What you need, or what you offer."
        />
      </div>
      <Button disabled={sending} className="w-full sm:w-auto">
        {sending ? "Sending…" : "Request a Quote"}
      </Button>
    </form>
  );
}
