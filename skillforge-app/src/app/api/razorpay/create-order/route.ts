import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planType, userId, companyName } = body;

    const amountInr = planType === "annual" ? 5000 : 500;
    const amountInPaise = amountInr * 100;

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Tb3iq49BSDiao9";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "QLl6vKOzLONRdvUQxjDQ5oFA";

    const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Call Razorpay REST API
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt,
        notes: {
          planType: planType || "monthly",
          userId: userId || "anonymous",
          companyName: companyName || "SkillForge Recruiter",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn("Razorpay API order error:", data);
      // Return helpful response or mock fallback
      return NextResponse.json({
        success: false,
        error: data.error?.description || "Failed to create Razorpay order",
        fallbackOrder: {
          id: `order_mock_${Date.now()}`,
          amount: amountInPaise,
          currency: "INR",
          key: keyId,
        },
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      order: data,
      keyId,
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Tb3iq49BSDiao9";
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error",
      fallbackOrder: {
        id: `order_local_${Date.now()}`,
        amount: 50000,
        currency: "INR",
        key: keyId,
      },
    }, { status: 500 });
  }
}
