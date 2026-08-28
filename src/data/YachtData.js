const YachtData = [
  // {
  //   id: 1,
  //   image: '/images/yachts/solandge/solandge-main.png',
  //   angles: ['/images/yachts/solandge/solandge-2.png', '/images/yachts/solandge/solandge-3.png'],
  //   title: 'Lürssen',
  //   reference: 'Solandge — 85m Superyacht',
  //   description: 'An iconic 85-meter custom motor yacht built by Lürssen, featuring award-winning interiors.',
  //   detailedDescription: 'Solandge is a masterpiece of custom yacht design. Built by Lürssen in 2013 and meticulously refitted in 2019, she spans five decks and boasts an extraordinary volume of 2,899 GT. With an exterior by Espen Øino and interior styling by Rodriguez Interiors, she offers accommodation for up to 16 guests in 8 staterooms, plus a crew of 29. Her state-of-the-art spa, helipad, and zero-speed stabilizers represent the pinnacle of ocean-going luxury.',
  //   badge: 'EXCLUSIVE LISTING',
  //   currentBid: '$74.5M',
  //   currentBidNumber: 74500000,
  //   reserveMet: true,
  //   bidIncrement: 500000,
  //   activeBidders: 6,
  //   liveActivity: [
  //     { id: 1, member: 'MEMBER #3***2', timeAgo: '4 minutes ago', timestamp: Date.now() - 240000, amount: '$74,500,000', amountNumber: 74500000 },
  //     { id: 2, member: 'MEMBER #7***8', timeAgo: '15 minutes ago', timestamp: Date.now() - 900000, amount: '$74,000,000', amountNumber: 74000000 },
  //     { id: 3, member: 'MEMBER #1***9', timeAgo: '32 minutes ago', timestamp: Date.now() - 1920000, amount: '$73,500,000', amountNumber: 73500000 }
  //   ],
  //   detailedpage: '/yacht/1',
  //   details: [
  //     { label: 'BUILDER', value: 'Lürssen' },
  //     { label: 'LENGTH', value: '85.1m (279.2ft)' },
  //     { label: 'YEAR', value: '2013 / 2019 Refit' },
  //     { label: 'GROSS TONNAGE', value: '2,899 GT' }
  //   ],
  //   initialTime: { days: 4, hours: 8, minutes: 22, seconds: 15 },
  //   ownershipHistory: {
  //     title: 'Solandge Ownership Record',
  //     description: 'Built for an experienced yachtsman and kept strictly under private registry. Maintained under full Lloyd\'s Register classification with no expense spared. Never chartered until her recent refit.',
  //     timeline: [
  //       { period: '2013-2019', detail: 'Private Owner, Middle East' },
  //       { period: '2019-2024', detail: 'Private Collection, Monaco' },
  //       { period: '2024-PRESENT', detail: 'Opulenza Custodial Anchorage' }
  //     ]
  //   },
  //   authentication: 'Fully certified by Lloyd\'s Register and flag state inspectors in 2025. Hull and machinery certificates are active and fully verified. Safe manning and international safety management certificates are in complete order.',
  //   conditionReport: {
  //     label: ['HULL', 'ENGINES', 'INTERIOR', 'ELECTRONICS'],
  //     value: ['Grade A Steel/Aluminium, flawless paint', 'Twin MTU 16V 4000 M63L, full service history', 'Rodriguez custom leather and gold-leaf, mint', 'State-of-the-art navigation suite, fully updated']
  //   }
  // },

  // {
  //   id: 2,
  //   image: '/images/yachts/syzygy/syzygy-main.png',
  //   angles: ['/images/yachts/syzygy/syzygy-2.png'],
  //   title: 'Feadship',
  //   reference: 'Syzygy — 81.5m Yacht',
  //   description: 'An exceptional Feadship custom build featuring modern design and carbon fibre elements.',
  //   detailedDescription: 'Syzygy is a highly advanced 81.5-meter Feadship motor yacht. Delivered in 2015, she exhibits a striking exterior by Tim Heywood and a minimalist interior by Andrew Winch. Driven by twin MTU engines, she cruises comfortably at 15 knots and achieves a range of 5,000 nautical miles. Her stand-out features include a 6-meter glass-bottom swimming pool, fully equipped gymnasium, and glass elevator connecting all guest decks.',
  //   badge: 'FEATURED VESSEL',
  //   currentBid: '$92.0M',
  //   currentBidNumber: 92000000,
  //   reserveMet: true,
  //   bidIncrement: 1000000,
  //   activeBidders: 8,
  //   liveActivity: [
  //     { id: 1, member: 'MEMBER #9***5', timeAgo: '8 minutes ago', timestamp: Date.now() - 480000, amount: '$92,000,000', amountNumber: 92000000 },
  //     { id: 2, member: 'MEMBER #4***1', timeAgo: '22 minutes ago', timestamp: Date.now() - 1320000, amount: '$91,000,000', amountNumber: 91000000 },
  //     { id: 3, member: 'MEMBER #6***8', timeAgo: '47 minutes ago', timestamp: Date.now() - 2820000, amount: '$90,000,000', amountNumber: 90000000 }
  //   ],
  //   detailedpage: '/yacht/2',
  //   details: [
  //     { label: 'BUILDER', value: 'Feadship' },
  //     { label: 'LENGTH', value: '81.5m (267.4ft)' },
  //     { label: 'YEAR', value: '2015' },
  //     { label: 'GROSS TONNAGE', value: '2,047 GT' }
  //   ],
  //   initialTime: { days: 1, hours: 14, minutes: 48, seconds: 50 },
  //   ownershipHistory: {
  //     title: 'Syzygy Architectural Origin',
  //     description: 'Delivered in Amsterdam as a bespoke project. Underwent an extensive warranty shipyard period at Feadship. Kept in private European ownership, cruising the West Mediterranean and Caribbean.',
  //     timeline: [
  //       { period: '2015-2022', detail: 'Private Owner, Northern Europe' },
  //       { period: '2022-2024', detail: 'Private Collection, Geneva' },
  //       { period: '2024-PRESENT', detail: 'Opulenza Custodial Anchorage' }
  //     ]
  //   },
  //   authentication: 'Certified by Bureau Veritas. Hull and machinery surveys successfully completed in 2025. Certificates of compliance for zero-speed stabilization and dynamic positioning systems are active.',
  //   conditionReport: {
  //     label: ['HULL', 'ENGINES', 'POOL & DECKS', 'GUEST AREAS'],
  //     value: ['Grade A Steel, pristine teak decks', 'Twin MTU 16V 4000, low hours', '6m glass-bottom pool, fully operational', 'Winch custom design, flawless marble and oak']
  //   }
  // },

  // {
  //   id: 3,
  //   image: '/images/yachts/lana/lana-main.png',
  //   angles: [],
  //   title: 'Benetti',
  //   reference: 'Lana — 107m Mega Yacht',
  //   description: 'An extraordinary 107-meter custom cruiser, among the largest built by Benetti.',
  //   detailedDescription: 'Lana is a striking 107-meter mega yacht delivered in 2020 by Italian builder Benetti. She features a grand interior and exterior layout designed by Benetti\'s in-house team. Accommodating up to 16 guests in 8 luxurious staterooms (including a master suite with private balconies), her amenities include a massive beach club, a hammam spa, a fully equipped gym, and a large touch-and-go helipad.',
  //   badge: 'PRESTIGE CLASS',
  //   currentBid: '$139.0M',
  //   currentBidNumber: 139000000,
  //   reserveMet: true,
  //   bidIncrement: 2000000,
  //   activeBidders: 4,
  //   liveActivity: [
  //     { id: 1, member: 'MEMBER #1***1', timeAgo: '12 minutes ago', timestamp: Date.now() - 720000, amount: '$139,000,000', amountNumber: 139000000 },
  //     { id: 2, member: 'MEMBER #5***5', timeAgo: '41 minutes ago', timestamp: Date.now() - 2460000, amount: '$137,000,000', amountNumber: 137000000 }
  //   ],
  //   detailedpage: '/yacht/3',
  //   details: [
  //     { label: 'BUILDER', value: 'Benetti' },
  //     { label: 'LENGTH', value: '107.0m (351.1ft)' },
  //     { label: 'YEAR', value: '2020' },
  //     { label: 'GROSS TONNAGE', value: '3,892 GT' }
  //   ],
  //   initialTime: { days: 6, hours: 2, minutes: 10, seconds: 55 },
  //   ownershipHistory: {
  //     title: 'Lana Charter and Ownership History',
  //     description: 'Delivered as the flagship of Benetti\'s gigayacht fleet. Maintained to the highest commercial standards. She has cruised globally, from the Mediterranean to the Indian Ocean, and remains in impeccable operational condition.',
  //     timeline: [
  //       { period: '2020-2023', detail: 'Private Owner, European Registry' },
  //       { period: '2023-PRESENT', detail: 'Opulenza Custodial Anchorage' }
  //     ]
  //   },
  //   authentication: 'Classed by RINA. Commercial survey certificates valid through 2028. All structural and safety audits confirmed compliant with maritime law.',
  //   conditionReport: {
  //     label: ['SUPERSTRUCTURE', 'PROPULSION', 'HELIPAD', 'SPA SUITE'],
  //     value: ['Aluminum superstructure, flawless paint', 'Diesel-electric propulsion, eco-compliant', 'Touch-and-go helipad, certified', 'Hammam and massage rooms, mint condition']
  //   }
  // },

  // {
  //   id: 4,
  //   image: '/images/yachts/oceanco/oceanco-main.png',
  //   angles: [],
  //   title: 'Oceanco',
  //   reference: 'Dar — 90m Custom Yacht',
  //   description: 'An iconic 90-meter Oceanco masterpiece with an ultra-modern glass superstructure.',
  //   detailedDescription: 'Dar is a revolutionary 90-meter motor yacht delivered by Oceanco in 2018. Designed by Luiz De Basto, her exterior features almost 400 square meters of dark glass panels glued directly to the superstructure, giving her the appearance of a sleek marine predator. With an interior by Nuvolari Lenard, she accommodates 12 guests in 6 cabins, including a private owner\'s deck with a jacuzzi.',
  //   badge: 'AWARD WINNING',
  //   currentBid: '$115.0M',
  //   currentBidNumber: 115000000,
  //   reserveMet: false,
  //   bidIncrement: 1000000,
  //   activeBidders: 5,
  //   liveActivity: [
  //     { id: 1, member: 'MEMBER #8***4', timeAgo: '18 minutes ago', timestamp: Date.now() - 1080000, amount: '$115,000,000', amountNumber: 115000000 },
  //     { id: 2, member: 'MEMBER #2***9', timeAgo: '55 minutes ago', timestamp: Date.now() - 3300000, amount: '$114,000,000', amountNumber: 114000000 }
  //   ],
  //   detailedpage: '/yacht/4',
  //   details: [
  //     { label: 'BUILDER', value: 'Oceanco' },
  //     { label: 'LENGTH', value: '90.1m (295.6ft)' },
  //     { label: 'YEAR', value: '2018' },
  //     { label: 'GROSS TONNAGE', value: '2,926 GT' }
  //   ],
  //   initialTime: { days: 2, hours: 19, minutes: 30, seconds: 12 },
  //   ownershipHistory: {
  //     title: 'Dar Design and Pedigree',
  //     description: 'Named Yacht of the Year at the World Yacht Trophies. Built under project name Y717. Extensively maintained in Northern European shipyards. Used exclusively for private cruising.',
  //     timeline: [
  //       { period: '2018-2024', detail: 'Private Owner, Monaco' },
  //       { period: '2024-PRESENT', detail: 'Opulenza Custodial Anchorage' }
  //     ]
  //   },
  //   authentication: 'Classed by Lloyd\'s Register. Underwent five-year special survey in 2023. Hull thickness, machinery shaft alignments, and safety features are fully certified.',
  //   conditionReport: {
  //     label: ['GLASS WRAP', 'ENGINES', 'OWNER DECK', 'TENDERS'],
  //     value: ['Pristine reflective glass, no seals wear', 'Twin MTU 20V 4000, serviced by MTU specialists', 'Private jacuzzi deck, fully functional', 'Custom yacht tenders, matching condition']
  //   }
  // },

  // {
  //   id: 5,
  //   image: '/images/yachts/galactica/galactica-main.png',
  //   angles: ['/images/yachts/galactica/galactica-2.png'],
  //   title: 'Heesen',
  //   reference: 'Galactica Super Nova — 70m Fast Cruiser',
  //   description: 'An all-aluminum fast displacement yacht built by Heesen, reaching speeds of 30 knots.',
  //   detailedDescription: 'Galactica Super Nova is a highly engineered 70-meter all-aluminum motor yacht built by Heesen in 2016. Thanks to a revolutionary fast displacement hull shape designed by Van Oossanen, she achieves a top speed of 30 knots. Her exterior is designed by Espen Øino and interior by Sinot Yacht Architecture. She features a glass-bottom swimming pool, outdoor cinema, waterfall, and helipad.',
  //   badge: 'FAST DISPLACEMENT',
  //   currentBid: '$58.0M',
  //   currentBidNumber: 58000000,
  //   reserveMet: true,
  //   bidIncrement: 500000,
  //   activeBidders: 9,
  //   liveActivity: [
  //     { id: 1, member: 'MEMBER #5***2', timeAgo: '3 minutes ago', timestamp: Date.now() - 180000, amount: '$58,000,000', amountNumber: 58000000 },
  //     { id: 2, member: 'MEMBER #9***9', timeAgo: '11 minutes ago', timestamp: Date.now() - 660000, amount: '$57,500,000', amountNumber: 57500000 },
  //     { id: 3, member: 'MEMBER #1***4', timeAgo: '28 minutes ago', timestamp: Date.now() - 1680000, amount: '$57,000,000', amountNumber: 57000000 }
  //   ],
  //   detailedpage: '/yacht/5',
  //   details: [
  //     { label: 'BUILDER', value: 'Heesen Yachts' },
  //     { label: 'LENGTH', value: '70.07m (229.9ft)' },
  //     { label: 'YEAR', value: '2016' },
  //     { label: 'GROSS TONNAGE', value: '1,200 GT' }
  //   ],
  //   initialTime: { days: 3, hours: 5, minutes: 12, seconds: 40 },
  //   ownershipHistory: {
  //     title: 'Galactica Super Nova Cruise Record',
  //     description: 'Delivered in Oss, Netherlands. Kept under full commercial class. Cruised the Caribbean and Mediterranean under meticulous management. Refitted with new interior highlights in 2021.',
  //     timeline: [
  //       { period: '2016-2021', detail: 'European Registry, Private Owner' },
  //       { period: '2021-2024', detail: 'Private Owner, Monaco' },
  //       { period: '2024-PRESENT', detail: 'Opulenza Custodial Anchorage' }
  //     ]
  //   },
  //   authentication: 'Classed by ABS. Fully commercial certified. Fire and safety systems overhauled in 2025. Fuel efficiency audits verified compliance with Fast Displacement standards.',
  //   conditionReport: {
  //     label: ['ALUMINUM HULL', 'PROPULSION', 'OUTDOOR CINEMA', 'INTERIOR'],
  //     value: ['Grade A Aluminum, fully scanned, sound', 'Triple waterjets/propeller propulsion, checked', 'Outdoor screen and sound system, functional', 'Sinot bespoke styling, minor leather wear']
  //   }
  // },

  // {
  //   id: 6,
  //   image: '/images/yachts/sun/sun-main.png',
  //   angles: [],
  //   title: 'Amels',
  //   reference: 'Here Comes The Sun — 89m Custom',
  //   description: 'The absolute flagship of the Amels shipyard, extensively customized and extended.',
  //   detailedDescription: 'Here Comes The Sun is an 89-meter custom motor yacht delivered by Dutch shipyard Amels in 2017 and extended in 2021. With a striking exterior design by Tim Heywood and a warm, inviting interior by Andrew Winch, she is the ultimate family superyacht. Features include a large beach club with fold-down wellness wings, a glass-sided pool, a dedicated cinema, and a master deck with 180-degree forward views.',
  //   badge: 'FLAGSHIP VESSEL',
  //   currentBid: '$124.0M',
  //   currentBidNumber: 124000000,
  //   reserveMet: true,
  //   bidIncrement: 1000000,
  //   activeBidders: 7,
  //   liveActivity: [
  //     { id: 1, member: 'MEMBER #2***8', timeAgo: '9 minutes ago', timestamp: Date.now() - 540000, amount: '$124,000,000', amountNumber: 124000000 },
  //     { id: 2, member: 'MEMBER #7***1', timeAgo: '31 minutes ago', timestamp: Date.now() - 1860000, amount: '$123,000,000', amountNumber: 123000000 }
  //   ],
  //   detailedpage: '/yacht/6',
  //   details: [
  //     { label: 'BUILDER', value: 'Amels' },
  //     { label: 'LENGTH', value: '89.0m (292ft)' },
  //     { label: 'YEAR', value: '2017 / 2021 Extension' },
  //     { label: 'GROSS TONNAGE', value: '2,977 GT' }
  //   ],
  //   initialTime: { days: 0, hours: 23, minutes: 15, seconds: 40 },
  //   ownershipHistory: {
  //     title: 'Amels Flagship Heritage',
  //     description: 'Acquired as Amels Limited Editions hull. Extended from 83m to 89m at Damen Yachting. Kept in absolute pristine condition under continuous management and professional crew.',
  //     timeline: [
  //       { period: '2017-2021', detail: 'Private Owner, Northern Europe' },
  //       { period: '2021-2024', detail: 'Bespoke Owner, London/Monaco' },
  //       { period: '2024-PRESENT', detail: 'Opulenza Custodial Anchorage' }
  //     ]
  //   },
  //   authentication: 'Classed by Lloyd\'s Register. Full 10-year special survey requirements fulfilled ahead of schedule in 2024. Active international certification in complete compliance.',
  //   conditionReport: {
  //     label: ['EXTENDED STELL HULL', 'ENGINES', 'BEACH CLUB', 'CINEMA ROOM'],
  //     value: ['Extended to 89m, Damen certified welds', 'Twin Caterpillar 3516, full overhaul done', 'Fold-down wings and pool, operational', 'Custom soundproof theater, 1080p, mint']
  //   }
  // }
]

export default YachtData
