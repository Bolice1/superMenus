import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env.confing';

// Strong typing for env
const transporter: Transporter = nodemailer.createTransport({
  host: env.EMAIL_SERVICE,
  port: Number(env.EMAIL_PORT),
  secure: Number(env.EMAIL_PORT) === 465, // modern best practice
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

// Generic reusable sender
const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    return await transporter.sendMail({
      from: `"superMenus" <${env.EMAIL_USER}>`,
      ...options,
    });
  } catch (error) {
    console.error('Email Error:', error);
    throw error;
  }
};

export const sendPaymentReminderNotifications = async (
    to: string,
    name: string,
    deadline: Date,
    amount: number,
    bankInfo: string
  ) => {
    return sendEmail({
      to,
      subject: 'Payment Reminder - superMenus',
      html: `
        <div style="font-family: Arial, sans-serif; color: #000;">
          <h2>Hello ${name},</h2>
          <p>
            This is a reminder that your payment of 
            <strong>${amount}</strong> is due.
          </p>
          <p>
            Please transfer to:<br/>
            <strong>${bankInfo}</strong><br/>
            before <strong>${deadline.toDateString()}</strong>.
          </p>
          <hr/>
          <p style="color: green;"><strong>superMenus</strong></p>
        </div>
      `,
    });
  };

  export const sendWelcomeMail = async (
    to: string,
    restaurantName: string,
    restaurantAdmin: string
  ) => {
    return sendEmail({
      to,
      subject: `Welcome to superMenus, ${restaurantName}!`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Hello ${restaurantAdmin},</h2>
          <p>
            Your restaurant <strong>${restaurantName}</strong> is now registered on 
            <strong>superMenus</strong>.
          </p>
  
          <h3>What you can do:</h3>
          <ul>
            <li>Receive orders online</li>
            <li>Improve service efficiency</li>
            <li>Track analytics in real-time</li>
            <li>Manage your restaurant easily</li>
          </ul>
  
          <p>We’re excited to have you onboard </p>
        </div>
      `,
    });
  };

  export const sendNewOrderNotification = async (
    to: string,
    restaurantName: string,
    orderInfo: string
  ) => {
    return sendEmail({
      to,
      subject: 'New Order Received 🍞',
      html: `
        <div style="font-family: Arial;">
          <h2>Dear ${restaurantName},</h2>
          <p>You have received a new order:</p>
          <pre>${orderInfo}</pre>
        </div>
      `,
    });
  };


  export const sendWeeklyAnalytics = async (
    to: string,
    analytics: string,
    restaurantName: string,
    restaurantAdmin: string
  ) => {
    return sendEmail({
      to,
      subject: `Weekly Analytics - ${restaurantName}`,
      html: `
        <div style="font-family: Arial;">
          <p>Dear ${restaurantAdmin},</p>
          <h2>Weekly Analytics Report</h2>
          <p>Here is your performance summary for <strong>${restaurantName}</strong>:</p>
          <pre>${analytics}</pre>
        </div>
      `,
    });
  };


