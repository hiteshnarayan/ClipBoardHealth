// Compute top workplaces directly from the DB (no HTTP)
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Active workplaces only (status === 0)
  const activeWorkplaces = await prisma.workplace.findMany({
    where: { status: 0 },
    select: { id: true, name: true },
  });

  if (activeWorkplaces.length === 0) {
    console.log("[]");
    return;
  }

  // Count shifts per workplace (exclude cancelled), consider completed shifts
  const now = new Date();
  const grouped = await prisma.shift.groupBy({
    by: ["workplaceId"],
    where: {
      cancelledAt: null,
      endAt: { lte: now },
    },
    _count: { _all: true },
  });

  const countMap = new Map(grouped.map((g) => [g.workplaceId, g._count._all]));

  const results = activeWorkplaces
    .map((w) => ({ name: w.name, shifts: countMap.get(w.id) || 0 }))
    .sort((a, b) => (b.shifts - a.shifts) || a.name.localeCompare(b.name))
    .slice(0, 3);

  console.log(JSON.stringify(results));
}

main()
  .catch((e) => {
    console.error(e?.message || e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
