import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/orders — liste des commandes d'un client
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { error: "customerId requis" },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: true } },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("[API /orders] GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes" },
      { status: 500 }
    );
  }
}

// POST /api/orders — créer une commande
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, items, shippingFee } = body;

    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Calculer le total
    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    // Générer un numéro de commande
    const orderNumber = `CMD-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        status: "pending",
        totalAmount,
        shippingFee: shippingFee || 0,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("[API /orders] POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}
