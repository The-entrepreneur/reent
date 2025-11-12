import Link from 'next/link'
import { Search, MapPin, Star, Home, Shield, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: 'Smart Search',
      description: 'Find properties that match your exact preferences with our intelligent filtering system.'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Location-Based',
      description: 'Discover properties in your preferred neighborhoods with detailed location insights.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Verified Listings',
      description: 'All properties are thoroughly verified to ensure quality and authenticity.'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Market Insights',
      description: 'Get real-time market data and pricing trends for informed decisions.'
    }
  ]

  const popularLocations = [
    'Lekki',
    'Victoria Island',
    'Ikeja',
    'Surulere',
    'Yaba',
    'Gbagada'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Find Your Perfect
              <span className="block text-primary-200">Rental Property</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Discover thousands of verified rental properties across Nigeria. Your dream home is just a search away.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-large p-2 mb-8">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by location, property type, or keyword..."
                    className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-0"
                  />
                </div>
                <button className="btn-primary px-8 py-3 rounded-lg whitespace-nowrap">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {popularLocations.map((location) => (
                <Link
                  key={location}
                  href={`/properties?location=${location.toLowerCase()}`}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-200"
                >
                  {location}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Reent?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make finding and renting properties simple, secure, and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-6 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Properties Listed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-gray-600">Verified Listings</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your New Home?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied tenants who found their perfect rental through Reent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
              <Home className="w-5 h-5 mr-2" />
              Browse Properties
            </Link>
            <Link href="/auth/signup" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg">
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
