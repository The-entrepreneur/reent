'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Share2,
  Star,
  Calendar,
  User,
  Phone,
  MessageCircle,
  Shield,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'

interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  isVerified: boolean
  rating: number
  reviews: number
  type: 'apartment' | 'house' | 'commercial'
  features: string[]
  agent: {
    name: string
    phone: string
    rating: number
    properties: number
    verified: boolean
  }
  amenities: string[]
  availability: string
}

const mockProperty: Property = {
  id: '1',
  title: 'Modern 3-Bedroom Apartment in Lekki',
  description: 'Beautiful modern apartment with stunning views of the lagoon. This fully furnished apartment features contemporary design, high-quality finishes, and premium amenities. Located in a secure estate with 24/7 security, swimming pool, gym, and dedicated parking.',
  price: 450000,
  location: 'Lekki Phase 1, Lagos',
  bedrooms: 3,
  bathrooms: 2,
  area: 120,
  images: ['/property-1.jpg', '/property-1-2.jpg', '/property-1-3.jpg'],
  isVerified: true,
  rating: 4.8,
  reviews: 24,
  type: 'apartment',
  features: ['Fully Furnished', 'Air Conditioning', 'Balcony', 'Modern Kitchen', 'Ensuite Bathrooms'],
  agent: {
    name: 'Sarah Johnson',
    phone: '+234 801 234 5678',
    rating: 4.9,
    properties: 47,
    verified: true
  },
  amenities: [
    'Swimming Pool',
    'Gym',
    '24/7 Security',
    'Parking Space',
    'Water Supply',
    'Power Backup',
    'CCTV',
    'Elevator'
  ],
  availability: 'Immediate'
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/properties"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="card overflow-hidden mb-6">
              <div className="relative h-80 bg-gradient-to-br from-primary-100 to-primary-200">
                {/* Main Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

                {/* Image Navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {mockProperty.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        selectedImage === index ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 bg-white/90 rounded-full text-gray-600 hover:bg-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="p-4 border-t">
                <div className="flex gap-2 overflow-x-auto">
                  {mockProperty.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary-500'
                          : 'border-gray-200 hover:border-gray-300'
                      } bg-gradient-to-br from-primary-50 to-primary-100`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-6">
              {/* Header */}
              <div className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {mockProperty.isVerified && (
                        <div className="badge-success flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                      <span className="badge-primary capitalize">
                        {mockProperty.type}
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {mockProperty.title}
                    </h1>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{mockProperty.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600">
                      {formatPrice(mockProperty.price)}
                    </div>
                    <div className="text-gray-500">per year</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900">{mockProperty.rating}</span>
                  </div>
                  <span className="text-gray-500">({mockProperty.reviews} reviews)</span>
                </div>
              </div>

              {/* Description */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{mockProperty.description}</p>
              </div>

              {/* Key Features */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mockProperty.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Specifications */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <Bed className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{mockProperty.bedrooms}</div>
                    <div className="text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <Bath className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{mockProperty.bathrooms}</div>
                    <div className="text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <Square className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{mockProperty.area}</div>
                    <div className="text-gray-600">Square Meters</div>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{mockProperty.availability}</div>
                    <div className="text-gray-600">Available</div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mockProperty.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success-500" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="card p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>

              {/* Agent Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{mockProperty.agent.name}</h4>
                    {mockProperty.agent.verified && (
                      <Shield className="w-4 h-4 text-success-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{mockProperty.agent.rating}</span>
                    <span>•</span>
                    <span>{mockProperty.agent.properties} properties</span>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="space-y-3">
                <button className="w-full btn-primary flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call Agent
                </button>
                <button className="w-full btn-outline flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </button>
              </div>

              {/* Quick Actions */}
              <div className="border-t pt-4 mt-4">
                <button className="w-full btn-secondary text-sm">
                  Schedule Viewing
                </button>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="card p-6 bg-primary-50 border-primary-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Safety Tips</h3>
              <ul className="space-y-2 text-sm text-primary-700">
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Meet in public places for initial discussions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Verify property ownership before payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Never transfer money without proper documentation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
