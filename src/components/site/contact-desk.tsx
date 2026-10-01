import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/site/button";
import { site } from "@/lib/site";

export function ContactDesk() {
  const [sending, setSending] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const role = String(data.get("role") ?? "business");
    const message = String(data.get("message") ?? "").trim();
    if (!name || !email || !message) {
      toast.error("Please fill in name, email, and a short note.");
      return;
    }
    const to =
      role === "supplier" ? site.emails.partners : site.emails.hello;
    const subject =
      role === "supplier"
        ? "Supplier partnership enquiry"
        : "Business enquiry";
    const body = `Name: ${name}\nEmail: ${email}\nRole: ${role}\n\n${message}`;
    setSending(true);
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success("Opening your mail app.");
    window.setTimeout(() => setSending(false), 1200);
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="role">I am</label>
        <select id="role" name="role" defaultValue="business">
          <option value="business">
            A business looking for products or services
          </option>
          <option value="supplier">A product or service supplier</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">Note</label>
        <textarea
          id="message"
          name="message"
          required
          placeholder="What you build, or what you need."
        />
      </div>
      <Button disabled={sending} className="w-full sm:w-auto">
        {sending ? "Opening mail…" : "Send a note"}
      </Button>
    </form>
  );
}
