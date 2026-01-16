export default function NewsletterSection() {
  return (
    <section className="hidden md:block py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Content */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Get exclusive access to new products, special offers, and insider updates. 
            Join our community of savvy shoppers!
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center justify-center text-indigo-100">
            <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Early Access</span>
          </div>
          <div className="flex items-center justify-center text-indigo-100">
            <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-sm font-medium">Exclusive Deals</span>
          </div>
          <div className="flex items-center justify-center text-indigo-100">
            <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Product Updates</span>
          </div>
        </div>

        {/* Newsletter Form */}
        <div className="max-w-md mx-auto">
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 text-gray-900 placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-colors"
            >
              Subscribe
            </button>
          </form>
          
          {/* Privacy Notice */}
          <p className="text-xs text-indigo-200 mt-4">
            By subscribing, you agree to our{' '}
            <a href="/privacy" className="underline hover:text-white">
              Privacy Policy
            </a>
            {' '}and consent to receive marketing emails.
          </p>
        </div>

        {/* Social Proof */}
        <div className="mt-8 pt-8 border-t border-indigo-500">
          <p className="text-indigo-200 mb-4">
            Join 50,000+ satisfied subscribers
          </p>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center text-indigo-200">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">No spam, ever</span>
            </div>
            <div className="flex items-center text-indigo-200">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Unsubscribe anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 