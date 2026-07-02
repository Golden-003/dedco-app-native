import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/login — authentification (mock pour prototype)
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

    // Mock : retourner un utilisateur fictif
    // En production : vérifier dans la DB avec Prisma + bcrypt
    const user = {
      id: `user-${Date.now()}`,
      email,
      name: email.split("@")[0],
      role: "client",
      avatar: null,
    };

    return NextResponse.json({
      user,
      token: `mock-token-${user.id}`,
    });
  } catch (error) {
    console.error("[API /auth/login] error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'authentification" },
      { status: 500 }
    );
  }
}

// PUT /api/auth/register — inscription
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

    // Mock : retourner un utilisateur créé
    const user = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      avatar: null,
    };

    return NextResponse.json(
      {
        user,
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
