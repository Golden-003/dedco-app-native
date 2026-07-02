import { NextRequest, NextResponse } from "next/server";

// GET /api/products — liste des produits (mock pour prototype)
// Note: Prisma est configuré mais les routes API sont en mock pour le prototype.
// En production, remplacer par de vraies queries Prisma avec une DB PostgreSQL (Neon/Supabase).
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Import dynamique des données mock
    const { PRODUCTS } = await import("@/lib/dedco-data");
    let products = PRODUCTS;
    if (category) {
      products = products.filter((p) => p.category === category);
    }
    products = products.slice(0, limit);

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

    // Mock : retourner le produit comme s'il était créé
    const product = {
      id: `prod-${Date.now()}`,
      name,
      description: description || "",
      price: parseInt(price),
      category,
      images: images || [],
      artisanId,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("[API /products] POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du produit" },
      { status: 500 }
    );
  }
}
