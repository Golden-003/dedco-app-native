import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/auth/login — authentification (mock pour le prototype)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Pour le prototype : si l'utilisateur n'existe pas, on retourne une erreur
    // En production : vérifier le hash du mot de passe
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token: `mock-token-${user.id}`, // En production : JWT signé
    });
  } catch (error) {
    console.error("[API /auth/login] error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'authentification" },
      { status: 500 }
    );
  }
}

// POST /api/auth/register — inscription
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role = "client" } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, mot de passe et nom requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password, // En production : hasher avec bcrypt
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        token: `mock-token-${user.id}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API /auth/register] error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
