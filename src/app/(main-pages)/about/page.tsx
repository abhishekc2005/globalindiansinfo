import { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Global Indian Info",
  description:
    "Learn more about Prabisha Consulting and our mission to empower businesses globally.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            About Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering businesses with 360-degree digital solutions since 2018.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Who We Are</h2>
            <div className="prose dark:prose-invert">
              <p>
                Founded in 2018, <strong>Prabisha Consulting</strong> is a
                premier Digital Marketing and IT Solutions agency dedicated to
                helping businesses grow rapidly and efficiently.
              </p>
              <p>
                We specialize in a comprehensive range of services including Web
                & App Development, Software Design, Branding, and Data-Driven
                Digital Marketing. Our team of experts works tirelessly to
                deliver profitable, user-friendly solutions tailored to your
                unique business needs.
              </p>
              <p>
                With a global footprint in <strong>India (New Delhi)</strong>{" "}
                and the <strong>UK (London)</strong>, we have successfully
                partnered with over 300 clients across diverse industries such
                as Finance, Education, Healthcare, and Manufacturing.
              </p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl bg-muted aspect-video relative flex items-center justify-center">
            {/* Placeholder for About Image - using a colored block or generic image if available */}
            <div className="bg-primary/10 w-full h-full flex flex-col items-center justify-center p-8 text-center">
              <span className="text-4xl font-bold text-primary mb-2">
                1200+
              </span>
              <span className="text-muted-foreground">Successful Projects</span>
              <div className="mt-8 flex gap-8">
                <div>
                  <span className="block text-2xl font-bold text-primary">
                    300+
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Global Clients
                  </span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-primary">
                    200+
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Websites Created
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our mission is to provide high-quality, cost-effective, and
            cutting-edge digital solutions that empower businesses to achieve
            their full potential. We believe in Integrity, Innovation, and
            Teamwork as the pillars of our success.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Grow Your Business?
        </h2>
        <div className="flex justify-center gap-4">
          <Link href="/contact">
            <Button size="lg">Contact Us</Button>
          </Link>
         
        </div>
      </section>
    </main>
  );
}
