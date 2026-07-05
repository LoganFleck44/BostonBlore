type EmailPayload = {
  from?: string;
  html: string;
  replyTo?: string;
  subject: string;
  text: string;
  to: string[];
};

type SignupInquiryInput = {
  dietPrefs?: string | null;
  email: string;
  equipment?: string | null;
  experience?: string | null;
  goal?: string | null;
  injuries?: string | null;
  name: string;
  daysPerWeek?: number | null;
  planInterest: string;
};

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "bostonblore@icloud.com";
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ||
  "Boston Blore <hello@bostonblore.com>";
const REPLY_TO_EMAIL = process.env.CONTACT_REPLY_TO_EMAIL || TO_EMAIL;
const RESEND_TEST_SENDER = "onboarding@resend.dev";

function esc(value: string) {
  return value.replace(/[&<>"]/g, (char) => {
    return (
      {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
      }[char] || char
    );
  });
}

function getBaseUrl() {
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}

async function sendEmail(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("Email not configured. Would have sent:", payload);
    return { ok: true, mode: "logged" as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: payload.from || FROM_EMAIL,
      to: payload.to,
      reply_to: payload.replyTo,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Resend send failed", {
      status: response.status,
      detail,
      from: payload.from || FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
    });
    throw new Error(`Resend send failed (${response.status}): ${detail}`);
  }

  if ((payload.from || FROM_EMAIL).includes(RESEND_TEST_SENDER)) {
    console.warn(
      "Emails are using Resend's test sender. Delivery is limited until a real sender domain is verified.",
    );
  }

  return { ok: true, mode: "sent" as const };
}

export async function sendSignupThankYouEmail({
  email,
  name,
  planInterest,
}: {
  email: string;
  name: string;
  planInterest: string;
}) {
  return sendEmail({
    to: [email],
    replyTo: REPLY_TO_EMAIL,
    subject: "Thanks for applying for coaching with Boston Blore",
    text: `Hi ${name},

Thanks for signing up for ${planInterest}.

Your application is in and Boston has been notified. You'll get a follow-up once your payment is confirmed and your client access is activated.

If you have questions in the meantime, just reply to this email.

Boston Blore`,
    html: `
      <h2>Thanks for applying, ${esc(name)}.</h2>
      <p>Your application for <strong>${esc(planInterest)}</strong> is in and Boston has been notified.</p>
      <p>You can sign in at any time, but your client dashboard will unlock once your payment is confirmed.</p>
      <p>If you have questions in the meantime, just reply to this email.</p>
      <p><strong>Boston Blore</strong></p>
    `,
  });
}

export async function sendSignupInquiryEmail(input: SignupInquiryInput) {
  const goal = input.goal || "Not provided";
  const experience = input.experience || "Not provided";
  const equipment = input.equipment || "Not provided";
  const injuries = input.injuries || "None noted";
  const dietPrefs = input.dietPrefs || "None noted";
  const daysPerWeek = input.daysPerWeek ? `${input.daysPerWeek} days` : "Not provided";

  return sendEmail({
    to: [TO_EMAIL],
    replyTo: input.email,
    subject: `New coaching application: ${input.name}`,
    text: `New coaching application

Name: ${input.name}
Email: ${input.email}
Plan: ${input.planInterest}
Goal: ${goal}
Experience: ${experience}
Equipment: ${equipment}
Days per week: ${daysPerWeek}
Dietary preferences: ${dietPrefs}
Injuries/limitations: ${injuries}`,
    html: `
      <h2>New coaching application</h2>
      <p><strong>Name:</strong> ${esc(input.name)}</p>
      <p><strong>Email:</strong> ${esc(input.email)}</p>
      <p><strong>Plan:</strong> ${esc(input.planInterest)}</p>
      <p><strong>Goal:</strong> ${esc(goal)}</p>
      <p><strong>Experience:</strong> ${esc(experience)}</p>
      <p><strong>Equipment:</strong> ${esc(equipment)}</p>
      <p><strong>Days per week:</strong> ${esc(daysPerWeek)}</p>
      <p><strong>Dietary preferences:</strong> ${esc(dietPrefs)}</p>
      <p><strong>Injuries / limitations:</strong> ${esc(injuries)}</p>
    `,
  });
}

export async function sendPasswordResetEmail({
  email,
  name,
  token,
}: {
  email: string;
  name: string;
  token: string;
}) {
  const resetUrl = `${getBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to: [email],
    replyTo: REPLY_TO_EMAIL,
    subject: "Reset your Boston Blore password",
    text: `Hi ${name},

Use the link below to reset your password:
${resetUrl}

This link expires in 1 hour.

If you did not request this, you can ignore this email.`,
    html: `
      <h2>Reset your password</h2>
      <p>Hi ${esc(name)},</p>
      <p>Use the link below to reset your Boston Blore password. This link expires in 1 hour.</p>
      <p><a href="${esc(resetUrl)}">${esc(resetUrl)}</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
}
