import React from "react";

const LandingPage: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#f1fffe] text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#f1fffe]/80 backdrop-blur border-b border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo/logo.png" alt="Menu QR" className="h-12 w-auto" />
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-[#38b6ff]">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#38b6ff]">
              How it works
            </a>
            <a href="#pricing" className="hover:text-[#38b6ff]">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 rounded-lg border border-[#38b6ff] text-[#38b6ff] hover:bg-[#38b6ff]/10 transition"
            >
              Sign in
            </a>
            <a
              href="/page/rigester/register/"
              className="inline-flex px-4 py-2 rounded-lg bg-[#38b6ff] text-white hover:brightness-95 shadow-sm shadow-[#38b6ff]/30 transition"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#38b6ff]/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#38b6ff]/10 blur-3xl"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          {/* Hero Text */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#38b6ff]/10 px-3 py-1 text-xs font-medium text-[#38b6ff] ring-1 ring-inset ring-[#38b6ff]/20">
              Fast • Simple • Contactless
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight">
              Generate menu QR codes in seconds
            </h1>
            <p className="mt-4 text-slate-600">
              Create, customize, and share QR codes that open your restaurant
              menu instantly. No apps. No hassle.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="/page/rigester/getstart"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#38b6ff] text-white font-medium hover:brightness-95 shadow-md shadow-[#38b6ff]/30 transition"
              >
                Create free QR
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-[#38b6ff] text-[#38b6ff] bg-white/70 hover:bg-[#38b6ff]/10 transition"
              >
                Live demo
              </a>
            </div>

            <div className="mt-6 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>{" "}
                No app required
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>{" "}
                Unlimited scans
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div id="demo" className="relative">
            <div className="mx-auto max-w-md">
              <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 overflow-hidden">
                <div className="bg-gradient-to-br from-[#38b6ff]/15 to-[#38b6ff]/0 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Your Restaurant</p>
                      <p className="font-semibold">Digital Menu</p>
                    </div>

                    {/* QR Preview */}
                    <div className="h-20 w-20 rounded-lg bg-white ring-1 ring-[#38b6ff]/30 p-2 flex items-center justify-center">
                      <svg
                        viewBox="0 0 64 64"
                        className="h-full w-full text-slate-800"
                      >
                        <rect width="64" height="64" fill="white" />
                        <rect x="4" y="4" width="18" height="18" fill="currentColor" />
                        <rect x="42" y="4" width="18" height="18" fill="currentColor" />
                        <rect x="4" y="42" width="18" height="18" fill="currentColor" />
                        <rect x="28" y="28" width="8" height="8" fill="currentColor" />
                        <rect x="42" y="42" width="10" height="10" fill="currentColor" />
                        <rect x="28" y="46" width="6" height="6" fill="currentColor" />
                        <rect x="50" y="28" width="6" height="6" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-6 gap-3">
                  <div className="col-span-4 space-y-2">
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                    <div className="h-3 w-56 bg-slate-200 rounded"></div>
                    <div className="h-3 w-48 bg-slate-200 rounded"></div>
                    <div className="h-4 w-28 bg-slate-200 rounded mt-4"></div>
                    <div className="h-3 w-52 bg-slate-200 rounded"></div>
                    <div className="h-3 w-40 bg-slate-200 rounded"></div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-28 w-full rounded-lg bg-[#38b6ff]/10 ring-1 ring-[#38b6ff]/20"></div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#38b6ff] text-white hover:brightness-95 transition">
                    Scan to view menu
                  </button>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-slate-500">
                Preview only. Customize branding, colors, and logos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Instant QR generation",
              desc: "Create QR codes that link to your digital menu in seconds.",
              icon: (
                <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM16 13h4v4h-4z" />
              ),
            },
            {
              title: "Custom branding",
              desc: "Use your logo and colors to match your brand.",
              icon: <path d="M12 3l8 4v6c0 5-3.5 7.5-8 8-4.5-.5-8-3-8-8V7l8-4z" />,
            },
            {
              title: "Multi-language menus",
              desc: "Serve customers in their language with one QR code.",
              icon: <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" />,
            },
            {
              title: "Scan analytics",
              desc: "Track scans by time and location to learn usage.",
              icon: <path d="M5 3h14v2H5zM7 8h10v2H7zM9 13h6v2H9zM11 18h2v2h-2z" />,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="h-10 w-10 rounded-lg bg-[#38b6ff]/10 text-[#38b6ff] flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  {feature.icon}
                </svg>
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14"
      >
        <h2 className="text-2xl font-bold text-center">How it works</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {
              step: "Step 1",
              title: "Add your menu",
              desc: "Upload PDF, link, or build with our editor.",
            },
            {
              step: "Step 2",
              title: "Customize QR",
              desc: "Choose colors, logo, and frame styles.",
            },
            {
              step: "Step 3",
              title: "Print & share",
              desc: "Download high-res codes for tables, flyers, and more.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="text-sm font-medium text-[#38b6ff]">
                {item.step}
              </div>
              <h3 className="mt-1 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14"
      >
        <div className="rounded-3xl bg-white shadow-lg ring-1 ring-slate-200 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Start free. Upgrade anytime.</h3>
            <p className="mt-2 text-slate-600 text-sm">
              Free plan includes unlimited scans and basic customization.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/page/rigester/getstart"
              className="inline-flex px-5 py-2.5 rounded-lg bg-[#38b6ff] text-white hover:brightness-95 shadow-sm shadow-[#38b6ff]/30 transition"
            >
              Create free account
            </a>
            <a
              href="/pricing"
              className="inline-flex px-5 py-2.5 rounded-lg border border-[#38b6ff] text-[#38b6ff] hover:bg-[#38b6ff]/10 transition"
            >
              View pricing
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {currentYear} Menu QR. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/terms" className="hover:text-[#38b6ff]">
              Terms
            </a>
            <a href="/privacy" className="hover:text-[#38b6ff]">
              Privacy
            </a>
            <a href="/contact" className="hover:text-[#38b6ff]">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
