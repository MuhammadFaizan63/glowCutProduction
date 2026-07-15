import apiClient, { simulateDelay } from './apiClient';

const MOCK_MODE = true;

const MOCK_SALONS = [
  {
    id: 'salon-1',
    name: 'Neon Fade Studio',
    area: 'DHA Phase 6, Karachi',
    priceTier: '$$',
    rating: 4.9,
    distanceKm: 0.8,
    isOpenNow: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB9Pjmu8ukqmnTs01T6NgBuWPudQoM2dYCIOLRq19u180vypLIfY2QkXHrcYt3GYUv3QGVHD6ZCp-abJmUSv5cYgsv5Ei5bYCaZY34G8tkFs7Z623IZw7D3kX7LaEQVVpINN2wAiVVythtNXAw6Stf1VVq49j4NOg4VitYagdonn_J8CkrZI5VVQUo2IY4qCQAW4fg3e9L24Ktz-sjeLwsgWFplN-HAo4QnoFS8NwmgqnDOlS9ZAfe_kKffWE3CTZXEjk_mNQCIEdY',
  },
  {
    id: 'salon-2',
    name: 'Cyber Cut Lounge',
    area: 'Clifton Block 4, Karachi',
    priceTier: '$$$',
    rating: 4.8,
    distanceKm: 1.5,
    isOpenNow: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSrinOeKoIWECEjZC5zo2pcaOg3Xf24ymFihfnCqZWFLnCGUj9gtFiyEmLc0Mvimy5MoLM7uwoPyW8Sl8FB83hjvKEj1-2RYKEIq4vKMHivJMIB-EfWIX49HK1nthIgMXaEfNVUkLo6qVUR1tCIzGrC-Bu2l_2aUDxot90Pw6mevmsXgbbeVwsGd6mfVcz9jxeIj9wxZlzEW4h93IZr-zNWRnAgG_PuMxnq_kAp4DV9lOGYPvGEseXuMu6lPvFWBaEY0Z8PcSMJ9M',
  },
  {
    id: 'salon-3',
    name: 'Glow Horizon Salon',
    area: 'Gulshan-e-Iqbal, Karachi',
    priceTier: '$',
    rating: 4.7,
    distanceKm: 2.1,
    isOpenNow: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDqItt3srDfIJcfgrO8UQ6yqXdzlci7_zJdpwBg-aILFJimzoxQ3-YKNKOe-JyOblWu7ITiGEeHZCdu1jxtS0EG0CeXII7pvQebNpt9lAN1nWb_lGVB3N0RBR2zS-r_afxx5Oi5NJO7J5-7j8gzkzS9E8QH98HSSq9AcJkR0XD0sZF51E4_DRMlKigdUn0qrGlfiWb4G36PnYo5_CIEn3bUipZtVPt-CslPUIv4lWb8wdVSk-TosdMWKp2VEVcge6a91VlGkYEB1oU',
  },
  {
    id: 'salon-4',
    name: 'Modern Cuts PECHS',
    area: 'Block 2, PECHS, Near Tariq Road',
    priceTier: '$$',
    rating: 4.8,
    distanceKm: 1.2,
    isOpenNow: true,
    startingPrice: 1500,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCfQtDH62SfU5fFL0hYfRPDBzxg9KnDSy2BxcQ9ZDiKFUc_o-uziET4uIupvMqu3pvVArfgnb8L4gveW5kCWOtsLKjqsG66plGICvGU740z5wBl4dFxQioI7fIkYhjoQB5jtN3MfeVn7t1cjc05THA84rYjYlHLGXhHHLHaw8iZh32Nss7sTEMLFW0V_k4Jyt1gP-e6cVhDtH2fEtZ8WdSD2vtaTCAH3qR-LrqwYciR1zMYGTvjLzON_OVF1oj2RUXv2WA3_mK7bvU',
    stylists: [
      { id: 'stylist-usman', name: 'Usman', nextSlot: '3:00 PM, 4:30 PM' },
      { id: 'stylist-zara', name: 'Zara', nextSlot: 'Available Now' },
    ],
  },
  {
    id: 'salon-5',
    name: 'Elite Grooming Hub',
    area: 'Block 6, PECHS Society',
    priceTier: '$$$',
    rating: 4.6,
    distanceKm: 2.8,
    isOpenNow: true,
    startingPrice: 2200,
    isHighDemand: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4M_uY1eJscQbqgCG38KucHVbAAVEHbuYJEe-fYBgDrLSGCVzmNOWTwv_X4GKnSvoOyD3IDHOZbsLaGqNNzsLbJilcEru9QXa85f_tNDGYQ5mcsmtW-FDgqvdR2Mc-_wgVGquSULX-yz4AHXXfKrn9eZPfaCwTIGaaofWs1d0SKtuBX6JjkdgEr_XEiIamr-x5c3V2pkPnQaXygQuSZIFBESa7plczy5ScbRFj3SxF2TWf4mWsmhMIWiEi0YmifyGWW67XhOOXNH4',
    stylists: [{ id: 'stylist-ahmed', name: 'Ahmed', nextSlot: '5:15 PM Today' }],
  },
];

const MOCK_STYLISTS = [
  {
    id: 'stylist-alex',
    name: 'Alex Rivera',
    specialty: 'Precision Fades & Cyber Styles',
    isAvailable: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfEURGoBX6u2FxH0ViFpp6m9I4yUWWVROm4hxxd-RStmShbJSOc6i76hk9KXBCABbDfwUs83ITQ4t7ROIZA04CmXOPhMZe7VFGJwcK3nugKPqhF6tk5eDqactLzDxB-Iq1sjJjT1G6JoaT9T6GGEhNzWsvoEQ3XYml1xP1vWgrUGpufegj2M2X6dCyypK3aNWJC3Nuh980FvoSZ4ihtQywUP0H2atbZT4ncFoIdEpsoZBSY6HB6sqNRYG_qSpHfqDe9cOgmzJsWUU',
  },
  {
    id: 'stylist-sarah',
    name: 'Sarah Chen',
    specialty: 'Advanced Neon Colorist',
    isAvailable: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBOJYEj97tGGfjcBQ56_yp6CPxzV5CoddV_bju2C7fsrDwE9EolRUzGDYXVZyz8sdqQQsIdrv9gDCUbB8uURy8QOy-G-Vucukm2hEMQOjXtXKSTQcm5DuSuK1MyIBp2WuVrikB_ptlHau2108hufpJsMSBvkIO8La-5nb2PtoKBy7-IONEWyHtrYr_VlPQghigs0mGLcQghJCphXKQzdmuVPbrUXD7XCfOWLa_Nhbubooq7uKc7owc2UhKpM341H70pDkimC1ATycs',
  },
  {
    id: 'stylist-marco',
    name: 'Marco Polo',
    specialty: 'Grooming Master',
    isAvailable: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDRFTUXd8BHJ_8elWg88mSD1nBLauSSxe9FHBn9WSCffaoMpUuotdBeMVQuo2Al-_sBKFs__M-pysQgfQYWeWIuAi2oRA1RkCBR4GusgeL3Yu9MsUdYuVlo272BNaTNucZQBVuws9zJqfdiQ4EKE8j5Jiw00dPiIUhWBOKrNWepjBD1yjGih6sTXvdxNCtX_x4LJ73EJeUC2NDlIvfgf9wYA5qfrg2TJ32R8vqXg80d-c13fwFTmyS2Iu_eWz7uYwJ-J5KHSfK7gGk',
  },
  {
    id: 'stylist-elena',
    name: 'Elena Vance',
    specialty: 'Avant-Garde Braider',
    isAvailable: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDveMX6Dm_8X0xz1P7clVK9YgPcVBbgUd24egKI1FcA8p_3sXht3oBWkj2GdQEjocF_DDRXyt17fmX6dhkUprO9CwSCDGwa1__v-Yp4ILO3XNvBP7iStzRjXBQ-upXkOKd9yE-yrxlJPrvcJVE-k89AG2mQH019pLpLZvbBwFnaL5u4S8dNLsFgoemss4Gfg-SWtiqvz9rl7FrDc6FCoyV-2F3teiArPRRVAW3xJwNCP8_H1868PDz2_rCaNh5NqAmwy3gi0yN13ZA',
  },
];

const MOCK_SERVICES = [
  { id: 'svc-1', name: "Men's Haircut", price: 1500, duration: 30, category: 'Hair' },
  { id: 'svc-2', name: 'Beard Trim & Shape', price: 800, duration: 20, category: 'Grooming' },
  { id: 'svc-3', name: 'Hair Color (Full)', price: 4500, duration: 90, category: 'Color' },
  { id: 'svc-4', name: 'Hot Towel Shave', price: 1200, duration: 25, category: 'Grooming' },
  { id: 'svc-5', name: 'Scalp Treatment', price: 2000, duration: 40, category: 'Treatment' },
];

export async function getSalons() {
  if (MOCK_MODE) {
    await simulateDelay(700);
    return MOCK_SALONS;
  }
  const { data } = await apiClient.get('/salons');
  return data;
}

export async function getSalonById(id) {
  if (MOCK_MODE) {
    await simulateDelay(600);
    return MOCK_SALONS.find((s) => s.id === id) || MOCK_SALONS[3];
  }
  const { data } = await apiClient.get(`/salons/${id}`);
  return data;
}

export async function getStylists() {
  if (MOCK_MODE) {
    await simulateDelay(500);
    return MOCK_STYLISTS;
  }
  const { data } = await apiClient.get('/stylists');
  return data;
}

export async function getServiceCatalog() {
  if (MOCK_MODE) {
    await simulateDelay(400);
    return MOCK_SERVICES;
  }
  const { data } = await apiClient.get('/services');
  return data;
}

export async function searchSalons(query) {
  if (MOCK_MODE) {
    await simulateDelay(500);
    if (!query) return MOCK_SALONS;
    return MOCK_SALONS.filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.area.toLowerCase().includes(query.toLowerCase())
    );
  }
  const { data } = await apiClient.get('/salons/search', { params: { q: query } });
  return data;
}
