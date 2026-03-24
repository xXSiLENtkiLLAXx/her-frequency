import eventImage from "@/assets/Loveher.jpeg";
import coachingImage from "@/assets/HealHer-Logo.jpeg";
import retreatImage from "@/assets/Launching-Soon.jpeg";

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  mapsLink?: string;
  price: string;
  spots: number;
  spotsLeft: number;
  image: string;
  category: string;
  description: string;
  paymentLink: string;
  whatToExpect?: string[];
}

export const events: Event[] = [
  {
    id: 1,
    title: "LoveHer: Galentine's Brunch",
    date: "February 28, 2026",
    time: "12:00PM - 16:00PM",
    location: "Arctt -Table Tennis Centre, Woodstock, Cape Town",
    mapsLink: "https://maps.app.goo.gl/9B7fCeB6WAUevRr39",
    price: "R350.00",
    spots: 50,
    spotsLeft: 50,
    image: eventImage,
    category: "Networking/Creative Workshop",
    description: "LoveHer is a welcoming space designed to help women reconnect with themselves. This experience encourages self-awareness, confidence, and compassion through guided reflection, meaningful conversation, and intentional connection. Come as you are, pretty in PINK, bring your girls, and leave feeling empowered, appreciated, supported and inspired as you begin your journey with Her Frequency.",
    paymentLink: "https://pos.snapscan.io/qr/Ak-wyctD",
    whatToExpect: [
      "A LoveHer experience in guided reflection, self-awareness, and self-affirmation.",
      "Meaningful conversations with like-minded women",
      "Intentional connection and networking opportunities",
      "Delicious brunch and refreshments",
    ],
  },
  {
    id: 2,
    title: "HealHer: Transformative Healing",
    date: "March 28, 2026",
    time: "9:00 AM - 4:00 PM",
    location: "Cape Town",
    mapsLink: "",
    price: "Coming",
    spots: 50,
    spotsLeft: 50,
    image: coachingImage,
    category: "Workshop",
    description: "HealHer: A Journey of Transformative Healing is a nurturing space for women to pause, give themselves permission to breathe, and gently reconnect with their emotional well-being. This experience provides a safe and supportive space where you can reflect, reconnect with yourself, and gently embrace the process of transformative healing, emerging with practical tools, renewed clarity, and a deeper sense of balance. Come as you are, adorned in calming Shades of BLUE and leave feeling supported, grounded, and empowered to carry this sense of balance and strength into your everyday life.",
    paymentLink: "https://pos.snapscan.io/qr/Ak-wyctD",
    whatToExpect: [
      A HealHer Experience in Reflection, Reconnection, and Emotional Well-Being where we’ll explore:
      "How to regulate emotions during stressful everyday situations",
      "Overcoming burnout and reclaiming your strength as a woman",
      "Healing through emotional transitions and life shifts",
      "Intentional connection and supportive engagement with like-minded women",
      "Curated light lunch and refreshments in a calm, nurturing environment",
    ],
  },
  {
    id: 3,
    title: "AwakenHer: Journey To Self Discovery",
    date: "April 25, 2026",
    time: "Full Day",
    location: "Drakensberg",
    mapsLink: "",
    price: "Coming Soon",
    spots: 50,
    spotsLeft: 50,
    image: retreatImage,
    category: "Networking/Creative Workshop",
    description: "Escape to the mountains for a transformative experience of yoga, meditation, journaling, and deep connection with fellow women on a journey of self-discovery.",
    paymentLink: "https://pos.snapscan.io/qr/Ak-wyctD",
  },
];

export const getEventById = (id: number): Event | undefined => {
  return events.find(event => event.id === id);
};
