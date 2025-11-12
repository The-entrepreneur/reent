'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, Bed, Bath, Square, Heart, Filter, Star } from 'lucide-react'

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
  type: 'apartment' | 'house' | 'commercial'
}

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 3-Bedroom Apartment in Lekki',
    description: 'Beautiful modern apartment with stunning views, fully furnished and ready to move in.',
    price: 450000,
    location: 'Lekki Phase 1, Lagos',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images: ['/property-1.jpg'],
    isVerified: true,
    rating: 4.8,
    type: 'apartment'
  },
  {
    id: '2',
    title: 'Spacious 4-Bedroom Duplex',
    description: 'Elegant duplex with ample space, perfect for families. Close to schools and shopping centers.',
    price: 850000,
    location: 'Victoria Island, Lagos',
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
    images: ['/property-2.jpg'],
    isVerified: true,
    rating: 4.9,
    type: 'house'
  },
  {
    id: '3',
    title: 'Cozy 2-Bedroom Flat',
    description: 'Affordable and well-maintained flat in a secure estate. Ideal for young professionals.',
    price: 280000,
    location: 'Ikeja GRA, Lagos',
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    images: ['/property-3.jpg'],
    isVerified: true,
    rating: 4.5,
    type: 'apartment'
  },
  {
    id: '4',
    title: 'Luxury Penthouse with Pool',
    description: 'Exclusive penthouse with private pool and panoramic city views. Premium amenities included.',
    price: 1200000,
    location: 'Banana Island, Lagos',
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    images: ['/property-4.jpg'],
    isVerified: true,
    rating: 5.0,
    type: 'house'
  },
  {
    id: '5',
    title: 'Commercial Space for Office',
    description: 'Prime commercial space suitable for offices, retail, or professional services.',
    price: 650000,
    location: 'Ikoyi, Lagos',
    bedrooms: 0,
    bathrooms: 2,
    area: 180,
    images: ['/property-5.jpg'],
    isVerified: true,
    rating: 4.7,
    type: 'commercial'
  },
  {
    id: '6',
    title: 'Studio Apartment in Yaba',
    description: 'Compact and efficient studio apartment, perfect for students or single professionals.',
    price: 180000,
    location: 'Yaba, Lagos',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    images: ['/property-6.jpg'],
    isVerified: true,
    rating: 4.3,
    type: 'apartment'
  }
]

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000])
  const [showFilters, setShowFilters] = useState(false)

  const propertyTypes = ['all', 'apartment', 'house', 'commercial']
  const locations = ['All Locations', 'Lekki', 'Victoria Island', 'Ikeja', 'Surulere', 'Yaba', 'Ikoyi']

  useEffect(() => {
    let filtered = properties

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by property type
    if (selectedType !== 'all') {
      filtered = filtered.filter(property => property.type === selectedType)
    }

    // Filter by price range
    filtered = filtered.filter(property =>
      property.price >= priceRange[0] && property.price <= priceRange[1]
    )

    setFilteredProperties(filtered)
  }, [searchQuery, selectedType, priceRange, properties])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Browse Properties</h1>
              <p className="text-gray-600 mt-1">
                Discover {filteredProperties.length} properties matching your criteria
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search properties, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline flex items-center gap-2 whitespace-nowrap"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {propertyTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-3 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                          selectedType === type
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="2000000"
                      step="50000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatPrice(0)}</span>
                      <span>{formatPrice(2000000)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Location Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Popular Locations
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {locations.slice(0, 4).map(location => (
                      <button
                        key={location}
                        onClick={() => setSearchQuery(location === 'All Locations' ? '' : location)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          searchQuery === location
                            ? 'bg-primary-100 text-primary-800 border-primary-300'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to see more results.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedType('all')
                setPriceRange([0, 2000000])
              }}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <div key={property.id} className="card group hover:shadow-large transition-all duration-300">
                {/* Property Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-t-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* Favorite Button */}
                  <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                  </button>

                  {/* Verified Badge */}
                  {property.isVerified && (
                    <div className="absolute top-3 left-3 badge-success flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Verified
                    </div>
                  )}

                  {/* Property Type */}
                  <div className="absolute bottom-3 left-3">
                    <span className="badge-primary capitalize">
                      {property.type}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                      {property.title}
                    </h3>
                    <div className="text-lg font-bold text-primary-600 ml-2 whitespace-nowrap">
                      {formatPrice(property.price)}
                      <span className="text-sm font-normal text-gray-500 block">per year</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>

                  {/* Property Features */}
                  <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>{property.area} m²</span>
                    </div>
                  </div>

                  {/* Rating and Action */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{property.rating}</span>
                    </div>
                    <Link
                      href={`/properties/${property.id}`}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
