const PensData = [
  // {
  //   id: 1,
  //   image: '/images/pens/montblanc/montblanc-main.png',
  //   angles: ['/images/pens/montblanc/montblanc-2.png', '/images/pens/montblanc/montblanc-3.png'],
  //   title: 'Montblanc',
  //   reference: '149 Masterpiece — 18K Solid Gold Nib',
  //   description: 'The pinnacle of the Montblanc range — the Writers Edition 149, fitted with a hand-finished 18K solid gold nib.',
  //   detailedDescription: 'The Montblanc 149 is the flagship of the Masterpiece collection and the gold standard of the writing instrument world. This example is fitted with a hand-finished 18-carat solid yellow gold nib, individually crafted and tested by Montblanc master craftsmen in Hamburg. The barrel is fashioned from precious resin with platinum-plated fittings. Rarely found in pristine, unworn condition.',
  //   badge: 'GRAND MASTER',
  //   currentBid: '$28K',
  //   currentBidNumber: 28000,
  //   reserveMet: true,
  //   bidIncrement: 500,
  //   activeBidders: 12,
  //   liveActivity: [
  //     { id: 1, member: 'MEMBER #4***7', timeAgo: '3 minutes ago', timestamp: Date.now() - 180000, amount: '$28,000', amountNumber: 28000 },
  //     { id: 2, member: 'MEMBER #9***1', timeAgo: '12 minutes ago', timestamp: Date.now() - 720000, amount: '$27,500', amountNumber: 27500 },
  //     { id: 3, member: 'MEMBER #2***6', timeAgo: '29 minutes ago', timestamp: Date.now() - 1740000, amount: '$27,000', amountNumber: 27000 },
  //   ],
  //   detailedpage: '/pen/1',
  //   details: [
  //     { label: 'BRAND', value: 'Montblanc' },
  //     { label: 'NIB', value: '18K Solid Gold' },
  //     { label: 'MATERIAL', value: 'Precious Resin' },
  //     { label: 'RARITY', value: 'Grand Master Edition' },
  //   ],
  //   initialTime: { days: 2, hours: 6, minutes: 14, seconds: 33 },
  //   ownershipHistory: {
  //     title: 'Single Private Collection',
  //     description: 'Acquired from Montblanc Hamburg flagship at launch. Stored in original presentation case in a climate-controlled environment. Unused — the nib has never touched paper.',
  //     timeline: [
  //       { period: 'Acquisition', detail: 'Purchased from Montblanc Hamburg Boutique' },
  //       { period: '2018–2024', detail: 'Private pen collection, Germany' },
  //       { period: '2024–PRESENT', detail: 'Opulenza Authenticated Vault' },
  //     ]
  //   },
  //   authentication: 'Authenticated by Montblanc Hamburg. Serial number confirmed from factory records. Nib hallmark and case documentation verified original. Accompanied by full box and papers.',
  //   conditionReport: {
  //     label: ['BARREL', 'NIB', 'FITTINGS', 'CASE'],
  //     value: ['Pristine — no marks or cloudiness', 'Unwritten — factory-fresh tip', 'Platinum-plate fully intact', 'Mint — original box and papers'],
  //   }
  // },

  // {
  //   id: 2,
  //   image: '/images/pens/cartier/cartier-main.png',
  //   angles: ['/images/pens/cartier/cartier-2.png'],
  //   title: 'Cartier',
  //   reference: 'Diabolo de Cartier — Sterling Silver & Lacquer',
  //   description: 'An iconic Cartier writing instrument crafted in sterling silver with deep lacquer accents.',
  //   detailedDescription: 'The Cartier Diabolo is one of the most sculpturally elegant writing instruments ever conceived. This example is crafted from sterling silver with a deep midnight-blue lacquer barrel. The 18-carat white gold nib is rhodium-plated for durability. The cap is adorned with a hand-set diamond cabochon. Produced in a limited edition of 200 pieces, this is numbered 047/200.',
  //   badge: 'LIMITED EDITION',
  //   currentBid: '$42K',
  //   currentBidNumber: 42000,
  //   reserveMet: true,
  //   bidIncrement: 750,
  //   activeBidders: 9,
  //   liveActivity: [
  //     { id: 1, member: 'MEMBER #6***3', timeAgo: '5 minutes ago', timestamp: Date.now() - 300000, amount: '$42,000', amountNumber: 42000 },
  //     { id: 2, member: 'MEMBER #1***8', timeAgo: '18 minutes ago', timestamp: Date.now() - 1080000, amount: '$41,250', amountNumber: 41250 },
  //     { id: 3, member: 'MEMBER #7***4', timeAgo: '41 minutes ago', timestamp: Date.now() - 2460000, amount: '$40,500', amountNumber: 40500 },
  //   ],
  //   detailedpage: '/pen/2',
  //   details: [
  //     { label: 'BRAND', value: 'Cartier' },
  //     { label: 'NIB', value: '18K White Gold' },
  //     { label: 'MATERIAL', value: 'Sterling Silver' },
  //     { label: 'EDITION', value: '047 of 200' },
  //   ],
  //   initialTime: { days: 0, hours: 19, minutes: 42, seconds: 18 },
  //   ownershipHistory: {
  //     title: 'No. 047 of 200 — Single Owner',
  //     description: 'This numbered piece was acquired directly from Cartier Paris at the collection launch. It has never been inked and remains in factory-new condition. Full Cartier certification accompanies the lot.',
  //     timeline: [
  //       { period: 'Launch', detail: 'Acquired from Cartier Paris — numbered 047/200' },
  //       { period: '2016–2024', detail: 'Private collection, Paris' },
  //       { period: '2024–PRESENT', detail: 'Opulenza Authenticated Vault' },
  //     ]
  //   },
  //   authentication: 'Authenticated by Cartier Paris. Piece number, hallmarks, and diamond certification verified. Accompanied by original Cartier box, pouch, and certificate of authenticity.',
  //   conditionReport: {
  //     label: ['BARREL', 'NIB', 'DIAMOND', 'BOX'],
  //     value: ['Pristine — polished, no wear', 'Rhodium intact, unworn', 'Original VVS cabochon, secure', 'Mint — Cartier red box and ribbon'],
  //   }
  // },

  // {
  //   id: 3,
  //   image: '/images/pens/visconti/visconti-main.png',
  //   angles: [],
  //   title: 'Visconti',
  //   reference: 'Homo Sapiens — Volcanic Lava & 23K Palladium Nib',
  //   description: 'Visconti\'s magnum opus — crafted from Etna volcanic lava with an extraordinary 23K palladium nib.',
  //   detailedDescription: 'The Visconti Homo Sapiens is arguably the most technically extraordinary pen in the world. The body is formed from basaltic lava sourced from Mount Etna, making each pen uniquely non-identical. The nib is a luxurious 23-carat palladium alloy — warmer and more flexible than gold. This limited edition example features the "Dark Age" lava treatment and palladium trim throughout.',
  //   badge: 'COLLECTORS PIECE',
  //   currentBid: '$18K',
  //   currentBidNumber: 18000,
  //   reserveMet: true,
  //   bidIncrement: 500,
  //   activeBidders: 7,
  //   liveActivity: [
  //     { id: 1, member: 'MEMBER #3***5', timeAgo: '8 minutes ago', timestamp: Date.now() - 480000, amount: '$18,000', amountNumber: 18000 },
  //     { id: 2, member: 'MEMBER #8***2', timeAgo: '22 minutes ago', timestamp: Date.now() - 1320000, amount: '$17,500', amountNumber: 17500 },
  //     { id: 3, member: 'MEMBER #5***9', timeAgo: '47 minutes ago', timestamp: Date.now() - 2820000, amount: '$17,000', amountNumber: 17000 },
  //   ],
  //   detailedpage: '/pen/3',
  //   details: [
  //     { label: 'BRAND', value: 'Visconti' },
  //     { label: 'NIB', value: '23K Palladium' },
  //     { label: 'MATERIAL', value: 'Etna Volcanic Lava' },
  //     { label: 'RARITY', value: 'Dark Age Edition' },
  //   ],
  //   initialTime: { days: 1, hours: 3, minutes: 28, seconds: 52 },
  //   ownershipHistory: {
  //     title: 'Earth-Forged — Single Owner from New',
  //     description: 'This pen was acquired from an authorised Visconti retailer in Florence. It has been stored in the original humidified Visconti travel case and has never been used.',
  //     timeline: [
  //       { period: 'Acquisition', detail: 'Purchased from Visconti retailer, Florence' },
  //       { period: '2020–2024', detail: 'Private collection, Italy' },
  //       { period: '2024–PRESENT', detail: 'Opulenza Authenticated Vault' },
  //     ]
  //   },
  //   authentication: 'Verified by Visconti Florence. Lava body origin certificate and nib assay certificate accompany the piece. Serial number confirmed from factory registry.',
  //   conditionReport: {
  //     label: ['LAVA BODY', 'NIB', 'PALLADIUM TRIM', 'CASE'],
  //     value: ['Pristine — no chips or surface marks', '23K alloy unwritten, sharp tipping', 'Full lustre, no wear or oxidation', 'Mint — original Visconti travel case'],
  //   }
  // },

  // {
  //   id: 4,
  //   image: '/images/pens/aurora/aurora-main.png',
  //   angles: [],
  //   title: 'Aurora',
  //   reference: '88 — 14K Gold Nib, Black Celluloid',
  //   description: 'Aurora\'s heritage flagship reissued in pristine classic black with a hand-tuned 14K gold nib.',
  //   detailedDescription: 'The Aurora 88 is the definitive Italian fountain pen — a design born in 1947 and still handcrafted in Turin today. This collector\'s edition features a classic ebonite-black celluloid barrel with rhodium-plated trim and a hand-tuned 14K bicolour gold nib. The Aurora 88 is renowned for its silky writing experience and exceptional build quality, and this example is in unused, collector-grade condition.',
  //   badge: 'HERITAGE EDITION',
  //   currentBid: '$12K',
  //   currentBidNumber: 12000,
  //   reserveMet: false,
  //   bidIncrement: 250,
  //   activeBidders: 6,
  //   liveActivity: [
  //     { id: 1, member: 'MEMBER #2***4', timeAgo: '11 minutes ago', timestamp: Date.now() - 660000, amount: '$12,000', amountNumber: 12000 },
  //     { id: 2, member: 'MEMBER #7***9', timeAgo: '33 minutes ago', timestamp: Date.now() - 1980000, amount: '$11,750', amountNumber: 11750 },
  //     { id: 3, member: 'MEMBER #1***3', timeAgo: '58 minutes ago', timestamp: Date.now() - 3480000, amount: '$11,500', amountNumber: 11500 },
  //   ],
  //   detailedpage: '/pen/4',
  //   details: [
  //     { label: 'BRAND', value: 'Aurora' },
  //     { label: 'NIB', value: '14K Bicolour Gold' },
  //     { label: 'MATERIAL', value: 'Black Celluloid' },
  //     { label: 'ORIGIN', value: 'Turin, Italy' },
  //   ],
  //   initialTime: { days: 0, hours: 14, minutes: 55, seconds: 40 },
  //   ownershipHistory: {
  //     title: 'Turin Craftsmanship — Direct Acquisition',
  //     description: 'Acquired from the Aurora factory boutique in Turin. This pen represents the culmination of nearly 80 years of continuous pen-making tradition at Aurora\'s Via Cassini manufactory.',
  //     timeline: [
  //       { period: 'Acquisition', detail: 'Purchased from Aurora Boutique, Turin' },
  //       { period: '2022–2024', detail: 'Private collection, Italy' },
  //       { period: '2024–PRESENT', detail: 'Opulenza Authenticated Vault' },
  //     ]
  //   },
  //   authentication: 'Verified by Aurora Turin. Factory serial number confirmed. Nib assay and barrel material certification accompany this lot. Original box and warranty card included.',
  //   conditionReport: {
  //     label: ['CELLULOID', 'NIB', 'TRIM', 'FILLING SYSTEM'],
  //     value: ['Pristine — deep black, no marks', '14K bicolour, unworn tipping', 'Rhodium fully intact', 'Piston mechanism — smooth and sealed'],
  //   }
  // },

  // {
  //   id: 5,
  //   image: '/images/pens/pelican/pelican-main.png',
  //   angles: ['/images/pens/pelikan/pelikan-2.png'],
  //   title: 'Pelikan',
  //   reference: 'Souverän M1000 — 18K Two-Tone Nib',
  //   description: 'Pelikan\'s grand flagship — the revered M1000, with its iconic striped green celluloid and 18K nib.',
  //   detailedDescription: 'The Pelikan Souverän M1000 is the crown jewel of the Souverän range — the largest and most prestigious pen Pelikan has ever produced. The classic green-black striped barrel is made from Pelikan\'s unique celluloid with a distinctive soft sheen. The 18K two-tone rhodium and gold nib is hand-tested and renowned for exceptional flexibility and smoothness. This collector\'s example has never been filled.',
  //   badge: 'ICONIC',
  //   currentBid: '$22K',
  //   currentBidNumber: 22000,
  //   reserveMet: true,
  //   bidIncrement: 500,
  //   activeBidders: 10,
  //   liveActivity: [
  //     { id: 1, member: 'MEMBER #5***7', timeAgo: '4 minutes ago', timestamp: Date.now() - 240000, amount: '$22,000', amountNumber: 22000 },
  //     { id: 2, member: 'MEMBER #3***2', timeAgo: '16 minutes ago', timestamp: Date.now() - 960000, amount: '$21,500', amountNumber: 21500 },
  //     { id: 3, member: 'MEMBER #8***6', timeAgo: '38 minutes ago', timestamp: Date.now() - 2280000, amount: '$21,000', amountNumber: 21000 },
  //   ],
  //   detailedpage: '/pen/5',
  //   details: [
  //     { label: 'BRAND', value: 'Pelikan' },
  //     { label: 'NIB', value: '18K Two-Tone' },
  //     { label: 'MATERIAL', value: 'Green-Black Celluloid' },
  //     { label: 'MODEL', value: 'Souverän M1000' },
  //   ],
  //   initialTime: { days: 1, hours: 10, minutes: 17, seconds: 5 },
  //   ownershipHistory: {
  //     title: 'Pelikan Hamburg — Flagship Edition',
  //     description: 'Sourced directly from Pelikan\'s Hamburg atelier through a specialist retailer. The pen has never been inked and remains in the original factory setting with all documentation intact.',
  //     timeline: [
  //       { period: 'Acquisition', detail: 'Sourced from authorised Pelikan retailer, Hamburg' },
  //       { period: '2019–2024', detail: 'Private pen collection, Germany' },
  //       { period: '2024–PRESENT', detail: 'Opulenza Authenticated Vault' },
  //     ]
  //   },
  //   authentication: 'Verified by Pelikan Hamburg. Serial number from factory records confirmed. Nib certification and barrel inspection report accompany this lot. Full box, papers and nib wrench included.',
  //   conditionReport: {
  //     label: ['CELLULOID', 'NIB', 'CLIP & TRIM', 'FILLING SYSTEM'],
  //     value: ['Pristine — full stripe lustre', '18K two-tone, factory-edge tip', 'Gold-plate fully intact', 'Piston — factory-sealed, never filled'],
  //   }
  // },

  // {
  //   id: 6,
  //   image: '/images/pens/omas/omas-main.png',
  //   angles: [],
  //   title: 'OMAS',
  //   reference: 'Extra Lucens — Limited Edition, 18K Flexible Nib',
  //   description: 'From the most celebrated Italian pen house — the OMAS Extra Lucens in rare celluloid.',
  //   detailedDescription: 'OMAS (Officine Meccaniche e Affini Sampietro) was the oldest and most historically significant Italian pen manufacturer before its closure in 2016. The Extra Lucens is the pinnacle of their production — featuring a stunning translucent demonstrator celluloid barrel with gold-plated furniture and an 18K flexible nib capable of extraordinary line variation. With OMAS no longer in production, examples in this condition have become extraordinarily sought after.',
  //   badge: 'DISCONTINUED HOUSE',
  //   currentBid: '$35K',
  //   currentBidNumber: 35000,
  //   reserveMet: true,
  //   bidIncrement: 500,
  //   activeBidders: 15,
  //   liveActivity: [
  //     { id: 1, member: 'MEMBER #9***1', timeAgo: '6 minutes ago', timestamp: Date.now() - 360000, amount: '$35,000', amountNumber: 35000 },
  //     { id: 2, member: 'MEMBER #4***8', timeAgo: '21 minutes ago', timestamp: Date.now() - 1260000, amount: '$34,500', amountNumber: 34500 },
  //     { id: 3, member: 'MEMBER #6***3', timeAgo: '49 minutes ago', timestamp: Date.now() - 2940000, amount: '$34,000', amountNumber: 34000 },
  //   ],
  //   detailedpage: '/pen/6',
  //   details: [
  //     { label: 'BRAND', value: 'OMAS' },
  //     { label: 'NIB', value: '18K Flexible' },
  //     { label: 'MATERIAL', value: 'Demonstrator Celluloid' },
  //     { label: 'STATUS', value: 'House Discontinued 2016' },
  //   ],
  //   initialTime: { days: 3, hours: 1, minutes: 44, seconds: 22 },
  //   ownershipHistory: {
  //     title: 'From Italy\'s Greatest Pen House',
  //     description: 'OMAS closed its Bologna factory in 2016 after 88 years of production. This Extra Lucens was acquired pre-closure from an authorised Italian retailer and has been preserved in a controlled environment since, making it one of the finest surviving examples of OMAS production.',
  //     timeline: [
  //       { period: 'Pre-2016', detail: 'Acquired pre-closure from OMAS authorised retailer, Bologna' },
  //       { period: '2016–2024', detail: 'Private collection, Northern Italy' },
  //       { period: '2024–PRESENT', detail: 'Opulenza Authenticated Vault' },
  //     ]
  //   },
  //   authentication: 'Authenticated by an independent OMAS specialist. Serial number and nib hallmark verified against known production records. Original OMAS box, papers and ink syringe included.',
  //   conditionReport: {
  //     label: ['CELLULOID', 'NIB', 'GOLD TRIM', 'DOCUMENTATION'],
  //     value: ['Pristine — clear demonstrator, no yellowing', '18K flexible — unused, no spread', 'Full gold-plate, no wear', 'Full OMAS box, papers and certificate'],
  //   }
  // },
]

export default PensData
