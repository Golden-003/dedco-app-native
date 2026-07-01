import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/products — liste des produits (avec filtres optionnels)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const artisanId = searchParams.get("artisanId");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (artisanId) where.artisanId = artisanId;

    const products = await prisma.product.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { artisan: { include: { user: true } } },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("[API /products] GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}

// POST /api/products — créer un produit (artisan seulement)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, category, images, artisanId } = body;

    if (!name || !price || !category || !artisanId) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price: parseInt(price),
        category,
        images: JSON.stringify(images || []),
        artisanId,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("[API /products] POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du produit" },
      { status: 500 }
    );
  }
}
