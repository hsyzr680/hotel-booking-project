'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar, Users } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { Card } from '../ui/Card'

export default function SearchBar() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (searchData.city) params.set('city', searchData.city)
    if (searchData.checkIn) params.set('checkIn', searchData.checkIn)
    if (searchData.checkOut) params.set('checkOut', searchData.checkOut)
    if (searchData.guests) params.set('guests', searchData.guests)

    router.push(`/search?${params.toString()}`)
  }

  // Set min date to today
  const today = new Date().toISOString().split('T')[0]

  return (
    <Card className="bg-white shadow-xl">
      <form onSubmit={handleSearch} className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          ابحث عن فندقك المثالي
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* City */}
          <div className="relative">
            <MapPin className="absolute right-3 top-11 text-gray-400 w-5 h-5" />
            <Input
              label="المدينة أو الوجهة"
              placeholder="أين تريد الذهاب؟"
              value={searchData.city}
              onChange={(e) => setSearchData({ ...searchData, city: e.target.value })}
              className="pr-10"
            />
          </div>

          {/* Check In */}
          <div className="relative">
            <Calendar className="absolute right-3 top-11 text-gray-400 w-5 h-5" />
            <Input
              label="تاريخ الدخول"
              type="date"
              min={today}
              value={searchData.checkIn}
              onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
              className="pr-10"
            />
          </div>

          {/* Check Out */}
          <div className="relative">
            <Calendar className="absolute right-3 top-11 text-gray-400 w-5 h-5" />
            <Input
              label="تاريخ الخروج"
              type="date"
              min={searchData.checkIn || today}
              value={searchData.checkOut}
              onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
              className="pr-10"
            />
          </div>

          {/* Guests */}
          <div className="relative">
            <Users className="absolute right-3 top-11 text-gray-400 w-5 h-5" />
            <Input
              label="عدد الضيوف"
              type="number"
              min="1"
              max="10"
              value={searchData.guests}
              onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
              className="pr-10"
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full">
          <Search className="w-5 h-5 ml-2" />
          ابحث الآن
        </Button>
      </form>
    </Card>
  )
}
