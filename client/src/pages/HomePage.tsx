import {
  ScanLine,
  Brain,
  Mic,
  Send,
  // LogIn,
  ArrowRight,
  Menu,
  X,
  CreditCard,
  // Target,
  // BarChart2,
  Phone,
  Mail,
  MapPin,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <CreditCard className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-800">
              Universal Card Reader
            </span>
          </Link>

          {/* Navigation Menu (Desktop) */}
          <nav
            className="hidden md:flex space-x-8"
            aria-label="Main Navigation"
          >
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#solution"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Solution
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Login Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Get Started <ArrowRight className="inline-block ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <Menu className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden fixed top-0 left-0 w-full h-full bg-white bg-opacity-95 backdrop-blur-sm flex flex-col items-center justify-center space-y-8 animate-fade-in-down">
            <button
              onClick={toggleMenu}
              className="absolute top-6 right-6 text-gray-600 hover:text-blue-600"
              aria-label="Close mobile menu"
            >
              <X className="w-8 h-8" />
            </button>
            <nav className="flex flex-col space-y-6 text-center">
              <a
                href="#features"
                onClick={toggleMenu}
                className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#solution"
                onClick={toggleMenu}
                className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
              >
                Solution
              </a>
              <a
                href="#pricing"
                onClick={toggleMenu}
                className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                onClick={toggleMenu}
                className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </nav>
            <div className="flex flex-col space-y-4 mt-8">
              <Link
                to="/login"
                className="bg-gray-100 text-gray-800 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-br from-blue-50 via-white to-gray-50 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight text-blue-900">
            Intelligent Lead Capture, <br /> Instant Follow-ups.
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-gray-600 leading-relaxed">
            Revolutionize your event strategy by scanning badges, transcribing
            conversations, and nurturing leads with AI-powered efficiency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              Get Started for Free <ArrowRight className="ml-2" />
            </Link>
            <a
              href="#features"
              className="bg-white text-blue-600 border border-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-transform transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-4 text-blue-800">
            Seamlessly Integrated, Powerfully Simple
          </h2>
          <p className="text-xl text-center mb-16 text-gray-600 max-w-3xl mx-auto">
            From the moment you meet a new connection to the final follow-up,
            our platform ensures you never miss an opportunity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 group">
              <ScanLine className="w-12 h-12 text-blue-600 mx-auto mb-6 group-hover:text-blue-700 transition-colors" />
              <h3 className="text-2xl font-bold mb-3 text-blue-800">
                AI-Powered OCR Scan
              </h3>
              <p className="text-gray-600">
                Instantly digitize business cards and event badges with our
                high-accuracy vision AI. Say goodbye to manual data entry.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 group">
              <Brain className="w-12 h-12 text-blue-600 mx-auto mb-6 group-hover:text-blue-700 transition-colors" />
              <h3 className="text-2xl font-bold mb-3 text-blue-800">
                Smart Data Enrichment
              </h3>
              <p className="text-gray-600">
                Automatically enrich contact profiles with CRM data, social
                profiles, and valuable intent signals in real-time.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 group">
              <Mic className="w-12 h-12 text-blue-600 mx-auto mb-6 group-hover:text-blue-700 transition-colors" />
              <h3 className="text-2xl font-bold mb-3 text-blue-800">
                Voice Conversation Summary
              </h3>
              <p className="text-gray-600">
                Capture the essence of every conversation with AI-generated
                summaries, ensuring key details are never forgotten.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 group">
              <Send className="w-12 h-12 text-blue-600 mx-auto mb-6 group-hover:text-blue-700 transition-colors" />
              <h3 className="text-2xl font-bold mb-3 text-blue-800">
                1-Tap Follow-up & Sync
              </h3>
              <p className="text-gray-600">
                Send personalized follow-up emails, book meetings, and sync
                updates to your CRM with a single tap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution/Process Section */}
      <section id="solution" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-4 text-blue-800">
                How It Works: Your Path to Smarter Lead Nurturing
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our platform simplifies the entire lead capture and follow-up
                process, allowing you to focus on what matters most: building
                relationships.
              </p>
              <ul className="space-y-6 text-lg text-gray-700">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <span>
                    <strong className="block text-xl text-blue-800">
                      Scan & Capture
                    </strong>
                    Use your phone's camera to scan any business card or event
                    badge. Our AI instantly extracts all the key information.
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <span>
                    <strong className="block text-xl text-blue-800">
                      Enrich & Analyze
                    </strong>
                    The system automatically enriches the contact with relevant
                    company data and provides an AI-generated summary of your
                    conversation.
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <span>
                    <strong className="block text-xl text-blue-800">
                      Engage & Convert
                    </strong>
                    Send personalized follow-ups with a single click, sync the
                    data to your CRM, and track your progress in real-time.
                  </span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <div className="relative p-6 bg-blue-100 rounded-3xl shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full bg-blue-200 rounded-3xl transform -rotate-3 -translate-x-4 translate-y-4"></div>
                <div className="relative z-10 p-8 bg-white rounded-2xl shadow-xl">
                  <div className="flex flex-col items-center justify-center space-y-8">
                    <div className="bg-blue-600 text-white p-6 rounded-full shadow-lg">
                      <ScanLine className="w-16 h-16" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-blue-800">
                        Scan Complete!
                      </h4>
                      <p className="text-gray-600 mt-2">
                        Profile created for John Doe, CEO at Acme Corp.
                      </p>
                    </div>
                    <div className="w-full flex justify-center">
                      <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                        View Profile <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-16">
            Choose a plan that fits your business needs, from individuals to
            large teams.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Plan 1 */}
            <div className="bg-white p-10 rounded-3xl shadow-xl border-t-4 border-blue-200">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">Basic</h3>
              <p className="text-gray-500 mb-6">For individual users</p>
              <p className="text-5xl font-extrabold text-blue-800 mb-4">
                $29
                <span className="text-xl font-normal text-gray-500">/mo</span>
              </p>
              <a
                href="#"
                className="block w-full bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Start Free Trial
              </a>
              <ul className="mt-8 space-y-4 text-left text-gray-700">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  100 scans per month
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  Basic AI enrichment
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  CRM sync (1 integration)
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  Email support
                </li>
              </ul>
            </div>
            {/* Plan 2 - Featured */}
            <div className="bg-white p-12 rounded-3xl shadow-2xl border-t-4 border-blue-600 relative transform scale-105">
              <div className="absolute top-0 right-0 -mt-4 mr-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md animate-pulse">
                Most Popular
              </div>
              <h3 className="text-3xl font-bold text-blue-800 mb-2">Pro</h3>
              <p className="text-gray-500 mb-6">For small to medium teams</p>
              <p className="text-6xl font-extrabold text-blue-800 mb-4">
                $79
                <span className="text-xl font-normal text-gray-500">/mo</span>
              </p>
              <a
                href="#"
                className="block w-full bg-gradient-to-r from-blue-400 to-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Get Started
              </a>
              <ul className="mt-8 space-y-4 text-left text-gray-700">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  Unlimited scans
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  Advanced AI enrichment
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  CRM sync (unlimited)
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  Voice summary transcription
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  Priority support
                </li>
              </ul>
            </div>
            {/* Plan 3 */}
            <div className="bg-white p-10 rounded-3xl shadow-xl border-t-4 border-blue-200">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">
                Enterprise
              </h3>
              <p className="text-gray-500 mb-6">For large organizations</p>
              <p className="text-5xl font-extrabold text-blue-800 mb-4">
                Custom
              </p>
              <a
                href="#"
                className="block w-full bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Contact Sales
              </a>
              <ul className="mt-8 space-y-4 text-left text-gray-700">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  All Pro features
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  Dedicated account manager
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  Custom integrations
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  Advanced security & compliance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-4 text-blue-800">
            What Our Customers Say
          </h2>
          <p className="text-xl text-center mb-16 text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. See how our platform has
            transformed lead management for businesses like yours.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-blue-50 p-8 rounded-2xl shadow-xl border-t-4 border-blue-200">
              <p className="text-xl italic text-gray-700 mb-6">
                "Universal Card Reader has completely changed the way our sales
                team works at trade shows. We capture more leads, and the
                follow-up process is a breeze!"
              </p>
              <div className="flex items-center space-x-4">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="Customer avatar"
                  className="w-12 h-12 rounded-full border-2 border-blue-600"
                />
                <div>
                  <p className="font-semibold text-blue-800">Jane Doe</p>
                  <p className="text-sm text-gray-500">
                    Marketing Manager, Tech Solutions Inc.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-8 rounded-2xl shadow-xl border-t-4 border-blue-200">
              <p className="text-xl italic text-gray-700 mb-6">
                "The AI voice summary feature is a game-changer. We can
                instantly recall key discussion points and send a truly
                personalized follow-up email in seconds."
              </p>
              <div className="flex items-center space-x-4">
                <img
                  src="https://i.pravatar.cc/42"
                  alt="Customer avatar"
                  className="w-12 h-12 rounded-full border-2 border-blue-600"
                />
                <div>
                  <p className="font-semibold text-blue-800">John Smith</p>
                  <p className="text-sm text-gray-500">
                    Sales Director, Innovate Corp.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-8 rounded-2xl shadow-xl border-t-4 border-blue-200">
              <p className="text-xl italic text-gray-700 mb-6">
                "Integration with our existing CRM was seamless. The data
                enrichment saves us countless hours and gives us a competitive
                edge."
              </p>
              <div className="flex items-center space-x-4">
                <img
                  src="https://i.pravatar.cc/41"
                  alt="Customer avatar"
                  className="w-12 h-12 rounded-full border-2 border-blue-600"
                />
                <div>
                  <p className="font-semibold text-blue-800">Emily Chen</p>
                  <p className="text-sm text-gray-500">
                    Head of Business Development, Global Ventures
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 bg-blue-600 text-white text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Sales Process?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of businesses who are closing more deals with
            intelligent lead capture and management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-lg"
            >
              Start Your Free Trial
            </Link>
            <a
              href="#contact"
              className="bg-transparent border border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-transform transform hover:scale-105"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-gray-300 py-12 px-6">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-3 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">
                Universal Card Reader
              </span>
            </Link>
            <p className="text-gray-400">
              Intelligent lead capture and management for modern businesses.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <a
                  href="mailto:contact@universalcardreader.com"
                  className="hover:text-white transition-colors"
                >
                  contact@universalcardreader.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-white transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1" />
                <span>
                  123 Lead Street, <br />
                  Suite 400, Innovation City, 90210
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Universal Card Reader. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
