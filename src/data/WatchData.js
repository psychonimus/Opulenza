const watchData = [
  {
    id: 1,
    image: '/images/pattek/pattek-phillipe.png',
    angles : ["/images/pattek/pattek-1.png", "/images/pattek/pattek-2.png", "/images/pattek/pattek-3.png" ],
    title: 'Patek Philippe',
    reference: 'Ref. 2499, First Series',
    description: 'From a Geneva estate. Single ownership since 1962.',
    detailedDescription: 'Widely regarded as one of the most significant horological masterpieces ever created, the Ref. 2499 First Series represents the pinnacle of mid-century watchmaking. Featuring a perpetual calendar, chronograph, and moon phase, it is encased in 18k yellow gold with crisp square pushers and a beautifully aged cream dial. Maintained in pristine condition with full box and papers.',
    badge: 'SEALED DOSSIER',
    currentBid: '$2,840,000',
    currentBidNumber: 2840000,
    reserveMet: true,
    bidIncrement: 50000,
    activeBidders: 14,
    liveActivity: [
      { id: 1, member: 'MEMBER #8***4', timeAgo: '2 minutes ago', timestamp: Date.now() - 120000, amount: '$2,840,000', amountNumber: 2840000 },
      { id: 2, member: 'MEMBER #1***2', timeAgo: '8 minutes ago', timestamp: Date.now() - 480000, amount: '$2,800,000', amountNumber: 2800000 },
      { id: 3, member: 'MEMBER #5***9', timeAgo: '15 minutes ago', timestamp: Date.now() - 900000, amount: '$2,750,000', amountNumber: 2750000 }
    ],
    detailedpage: '/watch/1',
    details: [
      { label: 'OWNERSHIP', value: 'European Collection' },
      { label: 'ACQUIRED', value: '1962' },
      { label: 'STATUS', value: 'Reserved' },
      // { label: 'VIEWING', value: '12 Members' },
      // { label: 'SCARCITY', value: '1 of 4 Known' },
      // { label: 'RETURN', value: '+287%', isGold: true }
    ],
    initialTime: { days : 3, hours: 2, minutes: 14, seconds: 33 },
    ownershipHistory: {
      title: 'Geneva Estate Single Ownership',
      description: 'Purchased new in 1962 from an authorized retailer in Geneva. This timepiece has been held by a single private family for over six decades, preserved in a bank vault with meticulous documentation.',
      timeline: [
        { period: '1962-2024', detail: 'Private Family Estate, Geneva' },
        { period: '2024-PRESENT', detail: 'Curated Asset Vaults, Zurich' }
      ]
    },
    authentication: 'Certified by Patek Philippe archives in 2025. Extract from the archives confirms manufacture date, movement number, and dial configuration as fully original.',
    conditionReport: 'Grade 1.5 Mint. The case shows full contours with original brush finishes. The dial is flawless with gentle warm patina. Movement is running within chronometer specifications.'
  },

  // {
  //   id: 2,
  //   image: '/images/rolex-dytona/rolex-dytona-main.png',
  //   angles : ["/images/rolex-dytona/rolex-dytona-1.png", "/images/rolex-dytona/rolex-dytona-2.png", "/images/rolex-dytona/rolex-dytona-3.png" ],
  //   title: 'Rolex Daytona',
  //   reference: 'Paul Newman Ref. 6263',
  //   description: 'Exceptional tropical dial preserved in untouched condition.',
  //   detailedDescription: "An exceptionally rare vintage Rolex Daytona Ref. 6263 featuring the iconic 'Paul Newman' exotic dial. Preserved in untouched, highly original condition, the dial displays an exquisite tropical chocolate fade on the sub-dials. Fitted with the reliable Caliber 727, this represents a holy grail for vintage sports watch collectors.",
  //   badge: 'PRIVATE CONSIGNMENT',
  //   currentBid: '$1,920,000',
  //   currentBidNumber: 1920000,
  //   reserveMet: true,
  //   bidIncrement: 25000,
  //   activeBidders: 19,
  //   liveActivity: [
  //     { id: 1, member: 'MEMBER #9***2', timeAgo: '1 minute ago', timestamp: Date.now() - 60000, amount: '$1,920,000', amountNumber: 1920000 },
  //     { id: 2, member: 'MEMBER #3***7', timeAgo: '5 minutes ago', timestamp: Date.now() - 300000, amount: '$1,900,000', amountNumber: 1900000 },
  //     { id: 3, member: 'MEMBER #4***1', timeAgo: '11 minutes ago', timestamp: Date.now() - 660000, amount: '$1,875,000', amountNumber: 1875000 }
  //   ],
  //   detailedpage: '/watch/2',
  //   details: [
  //     { label: 'OWNERSHIP', value: 'Private Collector' },
  //     { label: 'ACQUIRED', value: '1978' },
  //     { label: 'STATUS', value: 'Verified Provenance' },
      
  //   ],
  //   initialTime: { days : 3, hours: 4, minutes: 51, seconds: 12 },
  //   ownershipHistory: {
  //     title: 'The Italian Connection',
  //     description: 'Acquired by a prominent Italian collector in 1978. It remained in a private collection in Milan for decades, rarely worn and preserved in its original box.',
  //     timeline: [
  //       { period: '1978-2015', detail: 'The Rossi Collection, Milan' },
  //       { period: '2015-PRESENT', detail: 'Private Holding, London' }
  //     ]
  //   },
  //   authentication: 'Verified and authenticated by independent vintage Rolex specialists. Case number and case back markings fully consistent with 1978 production.',
  //   conditionReport: 'Grade 2 Excellent. Normal surface wear consistent with age. Lume plots are intact and have matching custard coloration.'
  // },

  {
    id: 3,
    image: '/images/audemars/audemars-main.png',
    angles : ["/images/audemars/audemars-1.png", "/images/audemars/audemars-2.png", "/images/audemars/audemars-3.png", ],
    title: 'Audemars Piguet',
    reference: 'Royal Oak A-Series',
    description: 'Early production example from the legendary first series.',
    detailedDescription: "The watch that redefined luxury sports watch design forever. This early A-Series Royal Oak Ref. 5402 represents the pure genius of Gérald Genta's design. Featuring the highly sought-after 'AP' logo at 6 o'clock on the Tapisserie dial and the legendary Caliber 2121. An outstanding piece of modern industrial art.",
    badge: 'FOUNDERS EDITION',
    currentBid: '$845,000',
    currentBidNumber: 845000,
    reserveMet: true,
    bidIncrement: 10000,
    activeBidders: 27,
    liveActivity: [
      { id: 1, member: 'MEMBER #2***1', timeAgo: '4 minutes ago', timestamp: Date.now() - 240000, amount: '$845,000', amountNumber: 845000 },
      { id: 2, member: 'MEMBER #7***5', timeAgo: '12 minutes ago', timestamp: Date.now() - 720000, amount: '$835,000', amountNumber: 835000 },
      { id: 3, member: 'MEMBER #3***8', timeAgo: '20 minutes ago', timestamp: Date.now() - 1200000, amount: '$825,000', amountNumber: 825000 }
    ],
    detailedpage: '/watch/3',
    details: [
      { label: 'OWNERSHIP', value: 'Swiss Family Trust' },
      { label: 'ACQUIRED', value: '1973' },
      { label: 'STATUS', value: 'Authenticated' },
      // { label: 'VIEWING', value: '27 Members' },
      // { label: 'SCARCITY', value: '1 of 50 Known' },
      // { label: 'RETURN', value: '+164%', isGold: true }
    ],
    initialTime: { days : 3, hours: 1, minutes: 32, seconds: 45 },
    ownershipHistory: {
      title: 'Origin of the Icon',
      description: 'Originally sold in Switzerland in 1973. It was acquired by a Swiss family trust who kept it in pristine condition, servicing it exclusively through Audemars Piguet heritage department.',
      timeline: [
        { period: '1973-2008', detail: 'Swiss Family Estate, Lausanne' },
        { period: '2008-PRESENT', detail: 'Private Collection, Tokyo' }
      ]
    },
    authentication: 'Accompanied by an Audemars Piguet Certificate of Authenticity and Heritage department registry entry. Original dial and hands verified.',
    conditionReport: 'Grade 1.8 Near Mint. Sharp bevels on the octagonal bezel. Tight bracelet links with minimal stretch. Dial shows uniform satin sheen.'
  },

  {
    id: 4,
    image: '/images/richard-mille/richard-mille-main.png',
    angles : ["/images/richard-mille/richard-mille-1.png", "/images/richard-mille/richard-mille-2.png", "/images/richard-mille/richard-mille-3.png", ],
    title: 'Richard Mille',
    reference: 'RM 027 Tourbillon',
    description: 'Ultra-lightweight icon associated with elite sporting heritage.',
    detailedDescription: 'The RM 027 Tourbillon represents a revolution in luxury sports watch engineering, designed specifically to withstand the extreme forces of professional tennis. Weighing under 20 grams including the strap, its carbon nanotube case and titanium baseplate showcase unparalleled technical innovation.',
    badge: 'INVITATION ONLY',
    currentBid: '$4,120,000',
    currentBidNumber: 4120000,
    reserveMet: true,
    bidIncrement: 50000,
    activeBidders: 8,
    liveActivity: [
      { id: 1, member: 'MEMBER #1***5', timeAgo: '30 seconds ago', timestamp: Date.now() - 30000, amount: '$4,120,000', amountNumber: 4120000 },
      { id: 2, member: 'MEMBER #8***0', timeAgo: '4 minutes ago', timestamp: Date.now() - 240000, amount: '$4,070,000', amountNumber: 4070000 },
      { id: 3, member: 'MEMBER #2***4', timeAgo: '10 minutes ago', timestamp: Date.now() - 600000, amount: '$4,020,000', amountNumber: 4020000 }
    ],
    detailedpage: '/watch/4',
    details: [
      { label: 'OWNERSHIP', value: 'Middle East Collection' },
      { label: 'ACQUIRED', value: '2011' },
      { label: 'STATUS', value: 'Vault Secured' },
      // { label: 'VIEWING', value: '35 Members' },
      // { label: 'SCARCITY', value: '1 of 30 Produced' },
      // { label: 'RETURN', value: '+338%', isGold: true }
    ],
    initialTime: { days : 3, hours: 6, minutes: 7, seconds: 20 },
    ownershipHistory: {
      title: 'Elite Sporting Provenance',
      description: 'Consigned from a prominent Middle Eastern collector. Originally delivered in 2011, this watch has been serviced regularly by Richard Mille in Les Breuleux.',
      timeline: [
        { period: '2011-2019', detail: 'Royal Family Collection, Abu Dhabi' },
        { period: '2019-PRESENT', detail: 'Sovereign Asset Vaults, Zurich' }
      ]
    },
    authentication: 'Certified by Richard Mille Headquarters. Complete with the original paper passport and warranty documentation matching the movement number.',
    conditionReport: 'Grade 1.2 Collector Grade. The composite case shows zero scratches. Crystal and dial are in flawless factory condition. Strap recently replaced during official service.'
  },

  {
    id: 5,
    image: '/images/vacheron/vacheron-main.png',
    angles : ["/images/vacheron/vacheron-1.png", "/images/vacheron/vacheron-2.png", "/images/vacheron/vacheron-3.png", ],
    title: 'Vacheron Constantin',
    reference: '222 Jumbo Steel',
    description: 'A landmark integrated-bracelet design preceding modern icons.',
    detailedDescription: "Designed by Jörg Hysek and released in 1977 to celebrate the brand's 222nd anniversary, this 'Jumbo' model in stainless steel is one of the rarest integrated bracelet designs of the era. With its distinctive scalloped bezel and Maltese Cross logo on the lower right of the case, it remains a design icon.",
    badge: 'ARCHIVE VERIFIED',
    currentBid: '$615,000',
    currentBidNumber: 615000,
    reserveMet: false,
    bidIncrement: 5000,
    activeBidders: 14,
    liveActivity: [
      { id: 1, member: 'MEMBER #6***4', timeAgo: '15 minutes ago', timestamp: Date.now() - 900000, amount: '$615,000', amountNumber: 615000 },
      { id: 2, member: 'MEMBER #1***9', timeAgo: '32 minutes ago', timestamp: Date.now() - 1920000, amount: '$610,000', amountNumber: 610000 },
      { id: 3, member: 'MEMBER #3***3', timeAgo: '50 minutes ago', timestamp: Date.now() - 3000000, amount: '$605,000', amountNumber: 605000 }
    ],
    detailedpage: '/watch/5',
    details: [
      { label: 'OWNERSHIP', value: 'Hong Kong Collection' },
      { label: 'ACQUIRED', value: '1977' },
      { label: 'STATUS', value: 'Archive Extract Included' },
      // { label: 'VIEWING', value: '14 Members' },
      // { label: 'SCARCITY', value: '1 of 100 Known' },
      // { label: 'RETURN', value: '+148%', isGold: true }
    ],
    initialTime: { days : 3, hours: 3, minutes: 44, seconds: 56 },
    ownershipHistory: {
      title: 'A Seventies Landmark',
      description: 'Acquired new in Hong Kong in 1977. It has changed hands twice, remaining within a small circle of sophisticated Asian collectors who recognized its historical significance early on.',
      timeline: [
        { period: '1977-1999', detail: 'Private Collector, Hong Kong' },
        { period: '1999-PRESENT', detail: 'The Heritage Vault, Singapore' }
      ]
    },
    authentication: 'Accompanied by Vacheron Constantin Archive Extract confirming production in steel in 1977, matching case and movement numbers.',
    conditionReport: 'Grade 2 Excellent. Hairline scratches on the polished surfaces. Scalloped bezel is sharp and unpolished. Dial is fully original with minor oxidation on the tritium plots.'
  },

  {
    id: 6,
    image: '/images/fp-journe/fp-journe-main.png',
    angles : ["/images/fp-journe/fp-journe-1.png", "/images/fp-journe/fp-journe-2.png", "/images/fp-journe/fp-journe-3.png", ],
    title: 'F.P. Journe',
    reference: 'Tourbillon Souverain',
    description: 'Independent horology masterpiece from an early production run.',
    detailedDescription: 'An early brass movement Tourbillon Souverain from the legendary independent horologist François-Paul Journe. Combining a tourbillon with a remontoir d\'égalite to ensure constant force, it represents a monumental achievement in modern watchmaking. Features a beautiful 18k rose gold case and gold-plated brass movements.',
    badge: 'MEMBER EXCLUSIVE',
    currentBid: '$1,340,000',
    currentBidNumber: 1340000,
    reserveMet: true,
    bidIncrement: 10000,
    activeBidders: 22,
    liveActivity: [
      { id: 1, member: 'MEMBER #5***1', timeAgo: '2 minutes ago', timestamp: Date.now() - 120000, amount: '$1,340,000', amountNumber: 1340000 },
      { id: 2, member: 'MEMBER #2***9', timeAgo: '8 minutes ago', timestamp: Date.now() - 480000, amount: '$1,330,000', amountNumber: 1330000 },
      { id: 3, member: 'MEMBER #4***2', timeAgo: '14 minutes ago', timestamp: Date.now() - 840000, amount: '$1,320,000', amountNumber: 1320000 }
    ],
    detailedpage: '/watch/6',
    details: [
      { label: 'OWNERSHIP', value: 'Private Museum' },
      { label: 'ACQUIRED', value: '2002' },
      { label: 'STATUS', value: 'Certified Original' },
      // { label: 'VIEWING', value: '22 Members' },
      // { label: 'SCARCITY', value: '1 of 20 Early Examples' },
      // { label: 'RETURN', value: '+191%', isGold: true }
    ],
    initialTime: { days : 3, hours: 5, minutes: 11, seconds: 8 },
    ownershipHistory: {
      title: 'Early Independent Horology',
      description: 'Purchased directly from FP Journe in Geneva in 2002. This early brass-movement piece has been kept in a climate-controlled safe and serviced exclusively at the Geneva atelier.',
      timeline: [
        { period: '2002-2018', detail: 'Private Collection, Geneva' },
        { period: '2018-PRESENT', detail: 'Independent Trust, Munich' }
      ]
    },
    authentication: 'Certified by FP Journe. Complete with hand-signed warranty card, original presentation box, and service history ledger.',
    conditionReport: 'Grade 1.1 Mint. Flawless 18k gold case. Dial shows no imperfections. Brass movement is exceptionally clean and running with strong amplitude.'
  }
];

export default watchData;