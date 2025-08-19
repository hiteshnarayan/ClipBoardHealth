let fetchFn = typeof fetch === "function" ? fetch : null;
try {
  if (!fetchFn) {
    const nf = require("node-fetch");
    fetchFn = nf && (nf.default || nf);
  }
} catch (_) {}

const API_BASE = process.env.API_BASE || "http://localhost:3000";

async function apiGet(path) {
  if (!fetchFn) throw new Error("need fetch");
  
  const response = await fetchFn(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" }
  });
  
  if (!response.ok) {
    throw new Error(`failed: ${response.status}`);
  }
  
  return response.json();
}

async function getAllPages(path) {
  let items = [];
  let nextPath = path;
  
  while (nextPath) {
    const data = await apiGet(nextPath);
    
    if (Array.isArray(data)) {
      items = items.concat(data);
      break;
    }
    
    if (data.data) {
      items = items.concat(data.data);
      nextPath = data.links?.next ? data.links.next.replace(API_BASE, '') : null;
    } else {
      break;
    }
  }
  
  return items;
}

async function main() {
  const workplaces = await getAllPages("/workplaces");
  const active = workplaces.filter(w => w.status === 0);
  
  if (!active.length) return;
  
  let shifts;
  try {
    shifts = await getAllPages("/shifts?status=completed");
  } catch {
    const all = await getAllPages("/shifts");
    shifts = all.filter(s => s && !s.cancelledAt && (s.completedAt || s.endedAt));
  }
  
  const counts = {};
  shifts.forEach(s => {
    if (active.find(w => w.id === s.workplaceId)) {
      counts[s.workplaceId] = (counts[s.workplaceId] || 0) + 1;
    }
  });
  
  const results = active.map(w => ({ name: w.name, shifts: counts[w.id] || 0 }));
  results.sort((a,b) => b.shifts - a.shifts || a.name.localeCompare(b.name));
  JSON.stringify(results.slice(0, 3));
}

main().catch(e => {
  console.error(e.message);
  process.exit(1);
});

