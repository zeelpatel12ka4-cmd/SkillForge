import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({
        verified: false,
        error: "Missing required Razorpay parameters",
      }, { status: 400 });
    }

    // In demo/test fallback orders without razorpay_signature or when secret is unconfigured
    if (!razorpay_signature || !keySecret) {
      return NextResponse.json({
        verified: true,
        message: "Payment processed (Simulated)",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      return NextResponse.json({
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      return NextResponse.json({
        verified: false,
        error: "Invalid Razorpay payment signature",
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return NextResponse.json({
      verified: false,
      error: error.message || "Internal verification error",
    }, { status: 500 });
  }
}
