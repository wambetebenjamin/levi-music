import { NextResponse } from "next/server";
import { z } from "zod";
import { findArtist } from "@/lib/repository";

const schema = z.object({
  artistId: z.string().min(1),
  amount: z.number().int().min(10).max(150000),
  phone: z.string().min(9).max(15),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Provide an artist id, a phone number, and an amount of at least KES 10" },
        { status: 400 },
      );
    }

    const { artistId, amount, phone } = parsed.data;
    const artist = await findArtist(artistId);
    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    const reference = `LM${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 5)
      .toUpperCase()}`;

    // Simulated M-Pesa STK push. A real integration would call Daraja here and
    // confirm the tip through the callback before crediting the artist ledger.
    return NextResponse.json({
      ok: true,
      reference,
      artist: { id: artist.id, name: artist.name },
      amount,
      phone: phone.replace(/.(?=.{3})/g, "*"),
      status: "pending",
      message: `Tip of KES ${amount} started for ${artist.name}. Approve the M-Pesa prompt on your phone to complete it.`,
    });
  } catch {
    return NextResponse.json({ error: "Could not start the tip" }, { status: 500 });
  }
}
