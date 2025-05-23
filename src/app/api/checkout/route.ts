import { Checkout } from '@polar-sh/nextjs';
import { NextResponse, type NextRequest } from 'next/server';

// The Polar documentation (https://docs.polar.sh/introduction) shows
// the Checkout utility directly assigned to export const GET.
// export const GET = Checkout({
//   accessToken: process.env.POLAR_ACCESS_TOKEN,
//   successUrl: process.env.SUCCESS_URL,
// });

// However, to include environment variable checks and provide a more robust handler,
// we'll wrap it in a standard Next.js GET function.
export async function GET(request: NextRequest) {
  const polarAccessToken = process.env.POLAR_ACCESS_TOKEN;
  const successUrl = process.env.SUCCESS_URL;

  if (!polarAccessToken) {
    console.error('Polar access token is not configured.');
    return NextResponse.json(
      { error: 'Payment provider access token is not configured.' },
      { status: 500 }
    );
  }

  if (!successUrl) {
    console.error('Success URL is not configured for Polar checkout.');
    return NextResponse.json(
      { error: 'Success URL is not configured.' },
      { status: 500 }
    );
  }

  // The Checkout function from Polar SDK is designed to be a GET handler itself.
  // It will handle the redirect to Polar's checkout page.
  const polarCheckoutHandler = Checkout({
    accessToken: polarAccessToken,
    successUrl: successUrl,
    // You can add other options here as needed, e.g., customerId, items, etc.
    // Refer to Polar documentation for more options: https://docs.polar.sh/
  });

  // The Checkout utility from Polar returns a Next.js request handler.
  // We call it with the incoming request.
  return polarCheckoutHandler(request);
} 