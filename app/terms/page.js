'use client';

import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <span className="text-4xl font-bold text-white">Belle</span>
            <span className="text-4xl font-bold text-white">Mart</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Glass-morphism effect container */}
          <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12">
            <div className="prose prose-indigo max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Introduction</h2>
              <p className="text-gray-700 mb-6">
                Welcome to Belle Mart! These Terms of Service ("Terms") govern your use of our website and services. 
                By accessing or using our platform, you agree to be bound by these Terms and our Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Account Registration</h2>
              <p className="text-gray-700 mb-6">
                To access certain features, you may need to create an account. You must provide accurate information and 
                keep your account secure. You're responsible for all activities under your account.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Products & Pricing</h2>
              <p className="text-gray-700 mb-6">
                We reserve the right to change product prices and availability without notice. All prices are in USD unless 
                otherwise stated. Product images are for illustrative purposes only.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Orders & Payments</h2>
              <p className="text-gray-700 mb-6">
                By placing an order, you agree to pay the specified price plus applicable taxes and shipping. We accept 
                various payment methods as displayed at checkout.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Returns & Refunds</h2>
              <p className="text-gray-700 mb-6">
                Our return policy lasts 30 days from delivery. To be eligible, items must be unused and in original packaging. 
                Some products may have different return policies as noted on their product pages.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Intellectual Property</h2>
              <p className="text-gray-700 mb-6">
                All content on our platform, including text, graphics, logos, and images, is our property or our licensors' 
                and is protected by intellectual property laws.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-6">
                Belle Mart shall not be liable for any indirect, incidental, or consequential damages arising from your use 
                of our services or products.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Changes to Terms</h2>
              <p className="text-gray-700 mb-6">
                We may update these Terms periodically. We'll notify you of significant changes, but it's your responsibility 
                to review them regularly.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Contact Us</h2>
              <p className="text-gray-700">
                For questions about these Terms, please contact us at{' '}
                <Link href="mailto:legal@bellemart.com" className="text-indigo-600 hover:text-indigo-800">
                  legal@bellemart.com
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Shop with Confidence</h3>
          <p className="text-gray-600 mb-6">
            We're committed to providing you with the best shopping experience while protecting your rights.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}