export const site = {
  name: "Boston Blore",
  tagline: "Personal Trainer & Nutrition Coach",
  location: "Lloydminster, AB",
  email: "coaching@bostonblore.com",
  phone: "(780) 000-0000",
  instagram: "https://www.instagram.com/bostonblore/",
  instagramHandle: "@bostonblore",
};

export const nav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Coaching" },
  { href: "/pricing", label: "Pricing" },
  { href: "/results", label: "Results" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

export const credentials = [
  "National Pro Qualifier",
  "Certified Personal Trainer",
  "Training Coach",
  "Nutrition Coach",
];

export const stats = [
  { value: "1:1", label: "Personal Coaching" },
  { value: "Online", label: "Coaching Worldwide" },
  { value: "Custom", label: "Plans for Every Goal" },
  { value: "Natural", label: "Athlete & Coach" },
];

export const services = [
  {
    slug: "online-coaching",
    title: "Online Coaching",
    blurb:
      "Wherever you are, we can work together. I'll put together a training program built around your schedule, equipment, and goals — and we'll adjust it every week as you grow. No generic plans, no guesswork.",
    points: [
      "Custom training split updated weekly",
      "Exercise video library for form guidance",
      "Weekly check-ins and progress tracking",
      "Direct messaging throughout the week",
    ],
    featured: true,
    image: "/images/preacher-curl.jpg",
  },
  {
    slug: "nutrition-coaching",
    title: "Nutrition Coaching",
    blurb:
      "Good nutrition doesn't have to be miserable. I'll help you find a way of eating that actually fits your life, supports your goals, and is something you can stick with long after the first few weeks.",
    points: [
      "Personalized macros & calorie targets",
      "Flexible meal plan with swap options",
      "Grocery lists and meal prep guidance",
      "Adjusted as your body and life change",
    ],
    featured: true,
    image: "/images/meal-prep.jpg",
  },
  {
    slug: "personal-training",
    title: "1-on-1 Personal Training",
    blurb:
      "For locals in Lloydminster, AB — we train together in person. I'll coach your technique, push you when you need it, and make sure every session is purposeful. Great for people who do best with a coach in the room.",
    points: [
      "Private in-person sessions",
      "Hands-on technique coaching",
      "Strength and physique programming",
      "Competition prep available",
    ],
    featured: false,
    image: "/images/coaching-client.jpg",
  },
];

export const packages = [
  {
    name: "Online Training",
    price: "$129",
    cadence: "/ month",
    description: "A training program built for you, adjusted every week.",
    features: [
      "Fully custom training program",
      "Weekly check-ins",
      "Exercise video library",
      "In-app messaging",
      "Progress tracking dashboard",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Full Coaching",
    price: "$199",
    cadence: "/ month",
    description: "Training and nutrition, coached together.",
    features: [
      "Everything in Online Training",
      "Custom nutrition & macro plan",
      "Weekly meal plan adjustments",
      "Priority messaging response",
      "Monthly progress photo reviews",
    ],
    cta: "Get started",
    highlighted: true,
  },
  {
    name: "In-Person 1:1",
    price: "Contact",
    cadence: "for rates",
    description: "Private sessions in Lloydminster, AB.",
    features: [
      "Private in-person sessions",
      "Hands-on technique coaching",
      "Posing & competition prep",
      "Flexible scheduling",
      "Local to Lloydminster",
    ],
    cta: "Enquire",
    highlighted: false,
  },
];

export const testimonials = [
  {
    name: "Jordan M.",
    result: "Lost 28 lbs in 16 weeks",
    quote:
      "Boston's plan was the first one I actually stuck to. The weekly check-ins kept me honest and the program kept getting better as I progressed.",
  },
  {
    name: "Alyssa R.",
    result: "First bikini show",
    quote:
      "He took me from gym-curious to stepping on stage. Everything was explained clearly and adjusted week by week — I never felt like I was just following a template.",
  },
  {
    name: "Devon K.",
    result: "Added 40 lbs to his squat",
    quote:
      "The nutrition coaching was a game-changer. I'm eating more than before, feeling better, and finally making progress I can actually see.",
  },
];

export const faqs = [
  {
    q: "Do you train people who are completely new to the gym?",
    a: "Absolutely — beginners are some of my favourite clients to work with. You haven't built any bad habits yet, and watching someone make their first real progress is genuinely one of the best parts of coaching. Your program starts where you are, not where you think you should be.",
  },
  {
    q: "Are you a natural athlete?",
    a: "Yes — I compete as a natural athlete and always have. That said, I coach anyone who wants to get stronger or reach a goal, regardless of where they're coming from. My focus is on helping you make real, consistent progress.",
  },
  {
    q: "Do I need a gym membership for online coaching?",
    a: "Ideally yes, but it's not always required. During onboarding you tell me what equipment you have and I build around it — whether that's a commercial gym, a home setup, or something in between.",
  },
  {
    q: "How does online coaching actually work?",
    a: "You sign up, fill out a short questionnaire about your goals and schedule, and I put your program together inside your client dashboard. Each week you log workouts, send a check-in, and I review it and adjust your plan. It's a real back-and-forth, not a PDF you download and never open.",
  },
  {
    q: "Where are you based for in-person training?",
    a: "Lloydminster, Alberta. If you're local, we can train together in person. Everyone else can work with me through online coaching.",
  },
  {
    q: "Can you help me prep for a competition?",
    a: "Yes. I've competed at the IFBB level and gone through the prep process myself, so I understand what it actually takes. Competition prep is available through both online and in-person coaching.",
  },
  {
    q: "What makes this different from a generic online program?",
    a: "Your plan is built for you and adjusted every week based on how you're actually responding. I'm not handing you a template — I'm coaching you. There's a real difference.",
  },
];
