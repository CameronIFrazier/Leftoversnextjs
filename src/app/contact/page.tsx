import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NavbarDemo } from "../components/ui/NavbarDemo";

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-black">
      <NavbarDemo />
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-2xl p-8 space-y-8 bg-black/50 backdrop-blur-sm border-neutral-800">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white text-center">Contact Us</h1>
          <p className="text-neutral-400 text-center">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
          <div className="text-center space-y-4">
            <div>
              <a
                href="mailto:inquire@leftovers.org"
                className="text-purple-500 hover:text-purple-400"
              >
                inquire@leftovers.org
              </a>
            </div>
            <div className="text-neutral-400">or</div>
            <div className="text-neutral-400">Fill out the form below</div>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                className="bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                className="bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">
              Your Message
            </Label>
            <textarea
              id="message"
              placeholder="Type your message here..."
              className="w-full min-h-[150px] p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-500 hover:bg-gradient-to-b from-indigo-500 to-purple-500 text-white font-bold rounded-md transition duration-200"
          >
            Submit Inquiry
          </button>
        </form>
      </Card>
    </div>
    </section>
  );
}