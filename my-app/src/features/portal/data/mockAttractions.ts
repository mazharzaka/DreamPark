import { Attraction, ticketsetType } from "../types";

export const MOCK_ATTRACTIONS: Attraction[] = [
  {
    id: "crimson-velocity",
    title: "CRIMSON VELOCITY",
    image: "/games/discovery.png",
    tags: [
      { label: "HIGH THRILL", variant: "white" },
      { label: "NEW ATTRACTION", variant: "green" },
    ],
    waitTime: "45 MIN",
    minHeight: "Min: 140cm",
    layout: {
      colSpan: 2,
      rowSpan: 2,
      customStyle: "crimson",
    },
  },
  {
    id: "TopSpin",
    title: "TopSpin",
    category: "FAMILY FRIENDLY",
    image: "/games/Top.jpg",
    waitTime: "15 MIN WAIT",
    bookPass: true,
    layout: {
      colSpan: 2,
      rowSpan: 1,
      customStyle: "sky",
    },
  },
  {
    id: "nebula",
    title: "Rocket",
    image: "/games/rocket.jpg",

    icon: "Rocket",
    waitTime: "WAIT: 20M",
    layout: {
      colSpan: 1,
      rowSpan: 1,
      customStyle: "nebula",
    },
  },
  {
    id: "amazon-plunge",
    title: "AMAZON PLUNGE",
    image: "/games/coster.jpg",
    icon: "Droplet",
    waitTime: "WAIT: 65M",
    layout: {
      colSpan: 1,
      rowSpan: 1,
      customStyle: "amazon",
    },
  },
  {
    id: "the-Rocket",
    title: "THE ROCKET",
    category: "EXTREME THRILL",
    image: "/games/rocket.jpg",
    waitTime: "90 MIN",
    layout: {
      colSpan: 2,
      rowSpan: 1,
      customStyle: "phoenix",
    },
  },
  {
    id: "midas-mountain",
    title: "MIDAS MOUNTAIN",
    subtitle: "Interactive Treasure Hunt Experience",
    image: "/games/home.webp",
    layout: {
      colSpan: 2,
      rowSpan: 1,
      customStyle: "midas",
    },
  },
];

export const MOCK_TICKETSETS: ticketsetType[] = [
  {
    id: "crimson-velocity",
    title: "CRIMSON VELOCITY",
    image: "/ticketsets/TicketSets1.jpg",
    layout: {
      colSpan: 2,
      rowSpan: 2,
    },
  },
  {
    id: "TopSpin",
    title: "TopSpin",
    image: "/ticketsets/TicketSets2.jpg",

    layout: {
      colSpan: 2,
      rowSpan: 1,
    },
  },
  {
    id: "TopSpin",
    title: "TopSpin",
    image: "/ticketsets/TicketSets3.jpg",
    layout: {
      colSpan: 2,
      rowSpan: 1,
    },
  },
];

export const MOCK_ANIMALS: Attraction[] = [
  {
    id: "lion",
    title: "Lion",
    image: "/animals/animal1.png",
    tags: [
      { label: "HIGH THRILL", variant: "white" },
      { label: "NEW ATTRACTION", variant: "green" },
    ],
    waitTime: "45 MIN",
    minHeight: "Min: 140cm",
    layout: {
      colSpan: 2,
      rowSpan: 2,
      customStyle: "crimson",
    },
  },
  {
    id: "TopSpin",
    title: "TopSpin",
    category: "FAMILY FRIENDLY",
    image: "/animals/animal2.png",
    waitTime: "15 MIN WAIT",
    bookPass: true,
    layout: {
      colSpan: 2,
      rowSpan: 1,
      customStyle: "sky",
    },
  },
  {
    id: "nebula",
    title: "Rocket",
    image: "/animals/animal3.png",

    icon: "Rocket",
    waitTime: "WAIT: 20M",
    layout: {
      colSpan: 1,
      rowSpan: 1,
      customStyle: "nebula",
    },
  },
  {
    id: "amazon-plunge",
    title: "AMAZON PLUNGE",
    image: "/animals/animal4.png",
    icon: "Droplet",
    waitTime: "WAIT: 65M",
    layout: {
      colSpan: 1,
      rowSpan: 1,
      customStyle: "amazon",
    },
  },
];
