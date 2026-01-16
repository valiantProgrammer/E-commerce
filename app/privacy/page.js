'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <span className="text-4xl font-bold text-white">Belle</span>
            <span className="text-4xl font-bold text-white">Mart</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Information We Collect</h2>
              <p className="text-gray-700 mb-6">
                We collect personal information you provide when you register, make purchases, or interact with our services. 
                This may include name, email, address, payment details, and browsing behavior.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-6">
                Your information helps us process transactions, improve our services, personalize your experience, and 
                communicate with you about orders, products, and promotions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Data Protection</h2>
              <p className="text-gray-700 mb-6">
                We implement security measures including encryption, access controls, and regular audits to protect your 
                personal information against unauthorized access or disclosure.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Cookies & Tracking</h2>
              <p className="text-gray-700 mb-6">
                We use cookies and similar technologies to enhance your shopping experience, analyze trends, and administer 
                the website. You can control cookies through your browser settings.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Third-Party Sharing</h2>
              <p className="text-gray-700 mb-6">
                We may share information with trusted third parties who assist in operating our website, conducting business, 
                or servicing you, as long as they agree to keep this information confidential.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Your Rights</h2>
              <p className="text-gray-700 mb-6">
                You have the right to access, correct, or delete your personal data. You may also opt-out of marketing 
                communications at any time by updating your account preferences.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Children's Privacy</h2>
              <p className="text-gray-700 mb-6">
                Our services are not directed to individuals under 16. We do not knowingly collect personal information 
                from children without parental consent.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Policy Changes</h2>
              <p className="text-gray-700 mb-6">
                We may update this policy periodically. We'll notify you of significant changes through email or prominent 
                notices on our website.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Contact Us</h2>
              <p className="text-gray-700">
                For privacy-related questions, contact our Data Protection Officer at{' '}
                <Link href="mailto:privacy@bellemart.com" className="text-indigo-600 hover:text-indigo-800">
                  privacy@bellemart.com
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Privacy Matters</h3>
            <p className="text-gray-600">
              We're committed to protecting your personal information and being transparent about our practices.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Secure Transactions</h4>
              <p className="text-gray-600 text-sm">
                All payments are processed using industry-standard encryption.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Data Protection</h4>
              <p className="text-gray-600 text-sm">
                Your information is protected with multiple security layers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Transparent Practices</h4>
              <p className="text-gray-600 text-sm">
                We clearly explain how and why we use your data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}