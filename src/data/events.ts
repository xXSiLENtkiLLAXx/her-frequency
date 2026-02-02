import eventImage from "@/assets/event-wellness.jpg";
import coachingImage from "@/assets/coaching-session.jpg";
import retreatImage from "@/assets/retreat-setting.jpg";

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  spots: number;
  spotsLeft: number;
  image: string;
  category: string;
  description: string;
  paymentLink: string;
}

export const events: Event[] = [
  {
    id: 1,
    title: "LoveHer: Galentine's Brunch",
    date: "February 28, 2026",
    time: "12:00PM - 16:00PM",
    location: "The Venue at 21 Bill Peters Drive, Greenpoint, Cape Town",
    price: "R350.00",
    spots: 50,
    spotsLeft: 50,
    image: eventImage,
    category: "Networking/Creative Workshop",
    description: "LoveHer is a welcoming space designed to help women reconnect with themselves. This experience encourages self-awareness, confidence, and compassion through guided reflection, meaningful conversation, and intentional connection. Come as you are, bring your girls, and leave feeling empowered, appreciated, supported and inspired as you begin your journey with Her Frequency.",
    paymentLink: "https://pos.snapscan.io/qr/Ak-wyctD",
  },
  {
    id: 2,
    title: "HealHer: Transform & Thrive Workshop",
    date: "March 28, 2026",
    time: "9:00 AM - 4:00 PM",
    location: "Cape Town",
    price: "Coming Soon",
    spots: 50,
    spotsLeft: 50,
    image: coachingImage,
    category: "Workshop",
    description: "A full-day intensive workshop focused on personal transformation, goal setting, and creating actionable plans for the life you desire.",
    paymentLink: "https://pos.snapscan.io/qr/Ak-wyctD",
  },
  {
    id: 3,
    title: "AwakenHer: Journey To Self Discovery",
    date: "April 25, 2026",
    time: "Full Day",
    location: "Drakensberg",
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
