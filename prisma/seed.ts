import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء إضافة البيانات التجريبية...')

  // إنشاء مستخدم تجريبي (Admin)
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hotel.com' },
    update: {},
    create: {
      email: 'admin@hotel.com',
      name: 'المدير',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ تم إنشاء حساب المدير:', admin.email)

  // إنشاء مستخدم عادي
  const userPassword = await bcrypt.hash('user123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      name: 'محمد أحمد',
      password: userPassword,
      role: 'USER',
    },
  })

  console.log('✅ تم إنشاء حساب المستخدم:', user.email)

  // إنشاء الفنادق
  const hotels = [
    {
      name: 'فندق برج العرب',
      description: 'فندق فخم من فئة 5 نجوم يوفر إطلالات خلابة على البحر، مع مرافق عالمية المستوى وخدمة استثنائية. يتميز بتصميم معماري رائع ومطاعم حائزة على جوائز.',
      address: 'شارع الجميرة',
      city: 'دبي',
      country: 'الإمارات',
      stars: 5,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      ]),
      amenities: JSON.stringify(['واي فاي مجاني', 'مسبح', 'سبا', 'صالة رياضية', 'مطعم', 'موقف سيارات', 'خدمة الغرف 24/7']),
      latitude: 25.0657,
      longitude: 55.1713,
    },
    {
      name: 'فندق النخيل الذهبي',
      description: 'فندق عصري يجمع بين الراحة والفخامة، مع موقع مثالي في قلب المدينة. يوفر غرف واسعة ومريحة مع وسائل راحة حديثة.',
      address: 'شارع الملك فيصل',
      city: 'الرياض',
      country: 'السعودية',
      stars: 4,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      ]),
      amenities: JSON.stringify(['واي فاي مجاني', 'مسبح', 'مطعم', 'موقف سيارات', 'خدمة الغرف']),
      latitude: 24.7136,
      longitude: 46.6753,
    },
    {
      name: 'فندق الأزهر التاريخي',
      description: 'فندق بوتيكي ساحر يقع في منطقة تاريخية، يجمع بين العمارة التقليدية والراحة الحديثة. مثالي لمحبي الثقافة والتاريخ.',
      address: 'حي الأزهر',
      city: 'القاهرة',
      country: 'مصر',
      stars: 3,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
        'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800',
      ]),
      amenities: JSON.stringify(['واي فاي مجاني', 'مطعم', 'إفطار مجاني', 'موقف سيارات']),
      latitude: 30.0444,
      longitude: 31.2357,
    },
    {
      name: 'منتجع الشاطئ الأزرق',
      description: 'منتجع شاطئي فاخر يوفر تجربة استرخاء لا مثيل لها. مع شاطئ خاص ومرافق رياضية مائية متنوعة، مثالي للعائلات والأزواج.',
      address: 'الساحل الشمالي',
      city: 'الإسكندرية',
      country: 'مصر',
      stars: 5,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
        'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800',
      ]),
      amenities: JSON.stringify(['شاطئ خاص', 'واي فاي مجاني', 'مسبح', 'سبا', 'صالة رياضية', 'رياضات مائية', 'نادي أطفال']),
      latitude: 31.2001,
      longitude: 29.9187,
    },
    {
      name: 'فندق المدينة للأعمال',
      description: 'فندق حديث مصمم لرجال الأعمال والمسافرين المحترفين. يوفر قاعات اجتماعات مجهزة ومساحات عمل مريحة مع إنترنت فائق السرعة.',
      address: 'منطقة الأعمال المركزية',
      city: 'عمّان',
      country: 'الأردن',
      stars: 4,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800',
        'https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?w=800',
      ]),
      amenities: JSON.stringify(['واي فاي فائق السرعة', 'قاعات اجتماعات', 'مركز أعمال', 'مطعم', 'موقف سيارات']),
      latitude: 31.9454,
      longitude: 35.9284,
    },
    {
      name: 'فندق الواحة الخضراء',
      description: 'فندق مريح وصديق للبيئة، محاط بالحدائق الخضراء. يوفر أجواء هادئة ومثالية للاسترخاء بعيداً عن صخب المدينة.',
      address: 'منطقة الزيتونة',
      city: 'تونس',
      country: 'تونس',
      stars: 3,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      ]),
      amenities: JSON.stringify(['واي فاي مجاني', 'حديقة', 'مطعم', 'موقف سيارات مجاني', 'إفطار مجاني']),
      latitude: 36.8065,
      longitude: 10.1815,
    },
  ]

  for (const hotelData of hotels) {
    const hotel = await prisma.hotel.create({
      data: hotelData,
    })

    console.log(`✅ تم إضافة فندق: ${hotel.name}`)

    // إضافة غرف لكل فندق
    const roomTypes = [
      {
        name: 'غرفة فردية',
        type: 'Single',
        capacity: 1,
        pricePerNight: 100,
        description: 'غرفة مريحة مثالية للمسافر الفردي، مع سرير مفرد وكل وسائل الراحة الأساسية.',
        images: JSON.stringify(['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600']),
        amenities: JSON.stringify(['تلفاز', 'واي فاي', 'مكتب عمل', 'ميني بار']),
      },
      {
        name: 'غرفة مزدوجة',
        type: 'Double',
        capacity: 2,
        pricePerNight: 150,
        description: 'غرفة واسعة مع سرير مزدوج كبير، مثالية للأزواج أو رجال الأعمال.',
        images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600']),
        amenities: JSON.stringify(['تلفاز', 'واي فاي', 'مكتب عمل', 'ميني بار', 'قهوة ومشروبات']),
      },
      {
        name: 'جناح عائلي',
        type: 'Suite',
        capacity: 4,
        pricePerNight: 300,
        description: 'جناح فسيح مكون من غرفتين وصالة معيشة، مثالي للعائلات. يوفر مساحة واسعة وراحة قصوى.',
        images: JSON.stringify(['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600']),
        amenities: JSON.stringify(['تلفازين', 'واي فاي', 'صالة معيشة', 'مطبخ صغير', 'ميني بار', 'شرفة']),
      },
    ]

    // ضبط الأسعار حسب تصنيف الفندق
    const priceMultiplier = hotel.stars >= 5 ? 2 : hotel.stars === 4 ? 1.5 : 1

    for (const roomData of roomTypes) {
      await prisma.room.create({
        data: {
          ...roomData,
          hotelId: hotel.id,
          pricePerNight: roomData.pricePerNight * priceMultiplier,
        },
      })
    }

    console.log(`  ➕ تم إضافة ${roomTypes.length} غرف للفندق`)
  }

  // إضافة بعض التقييمات
  const allHotels = await prisma.hotel.findMany()
  
  for (const hotel of allHotels.slice(0, 3)) {
    await prisma.review.create({
      data: {
        userId: user.id,
        hotelId: hotel.id,
        rating: 5,
        comment: 'تجربة رائعة! الفندق نظيف جداً والموظفون متعاونون. أنصح به بشدة.',
      },
    })
  }

  console.log('✅ تم إضافة التقييمات')

  console.log('\n🎉 تم إضافة البيانات التجريبية بنجاح!')
  console.log('\n📊 الإحصائيات:')
  console.log(`   - المستخدمين: 2`)
  console.log(`   - الفنادق: ${hotels.length}`)
  console.log(`   - الغرف: ${hotels.length * 3}`)
  console.log(`   - التقييمات: 3`)
  console.log('\n🔑 حسابات الدخول:')
  console.log('   Admin: admin@hotel.com / admin123')
  console.log('   User:  user@test.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إضافة البيانات:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
