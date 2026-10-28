import {W,H,N,NM,P,COL,LAWNS,E,EM,S,MinHeap,graph,build,ALG,NAMES,pcost,compute,mst,VEN,EV,ROLES,scale,need,gd,plan,BOOKS,IDX,lsearch} from './engine.js';

const $ = s => document.querySelector(s);

/* ---------- Moksha fest planner (Tab 'res') ---------- */
function fest(){
  const pl = plan();
  const day = S.day;
  const un = pl.filter(p => !p.v);
  const short = pl.filter(p => p.v && Object.keys(p.n).some(r => p.got[r] < p.n[r]));

  const ROLE_ICONS = { sec: 'shield', vol: 'group', tech: 'engineering', med: 'medical_services' };

  // Hourly timeline from 10:00 to 23:00 (13 hours) with compact scroll
  const tl = VEN.map(v => {
    const dayEvents = pl.filter(p => p.v === v && p.e.d === day);
    const bars = dayEvents.map(p => {
      const left = ((p.e.s - 10) / 13) * 100;
      const width = (p.e.h / 13) * 100;
      const isShort = Object.keys(p.n).some(r => p.got[r] < p.n[r]);
      const bg = isShort ? 'var(--tertiary-container)' : 'var(--primary-container)';
      return `
        <div title="${p.e.n} (${p.e.s}:00–${p.e.s + p.e.h}:00, ${p.e.a} crowd)"
             style="position:absolute;top:2px;bottom:2px;left:${left}%;width:${width}%;background:${bg};color:#ffffff;border-radius:5px;font-size:10px;font-weight:600;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:2px 4px;box-shadow:var(--shadow-xs);cursor:default">
          ${p.e.n}
        </div>
      `;
    }).join('');

    return `
      <div style="display:flex;align-items:center;gap:8px;padding:2px 0">
        <span style="width:86px;flex:none;font-size:11px;font-weight:600;color:var(--on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${v.n}">
          ${v.n}
        </span>
        <div style="position:relative;flex:1;height:24px;background:var(--surface-low);border:1px solid var(--border);border-radius:6px;overflow:hidden">
          ${bars}
        </div>
      </div>
    `;
  }).join('');

  // Event cards with scale, venue, distance, capacity fill % and staff chips
  const cards = pl.map(p => {
    const e = p.e;
    const i = EV.indexOf(e);
    const d = p.v ? gd(p.v.node) : null;
    const isShort = p.v && Object.keys(p.n).some(r => p.got[r] < p.n[r]);

    const chips = p.v ? Object.keys(ROLES).filter(r => p.n[r]).map(r => {
      const ok = p.got[r] >= p.n[r];
      const tagClass = ok ? 'tag-academic' : 'tag-library';
      const icon = ok ? 'check' : 'warning';
      return `
        <span class="tag ${tagClass}" style="display:inline-flex;align-items:center;gap:3px;font-size:11px">
          <span class="material-symbols-outlined" style="font-size:12px">${icon}</span>
          <span>${ROLES[r]} ${p.got[r]}/${p.n[r]}</span>
        </span>
      `;
    }).join(' ') : '';

    return `
      <div class="card" style="display:flex;flex-direction:column;gap:8px;${isShort ? 'border-color:var(--tertiary-brand)' : ''}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
          <div>
            <b style="font-size:13.5px;color:var(--on-surface)">${e.n}</b>
            <div style="font-size:11.5px;color:var(--on-surface-variant);margin-top:2px">
              ${p.v ? `📍 <b>${p.v.n}</b> ${d != null ? `(${d} m from gate)` : ''}` : '<span style="color:var(--tertiary-brand);font-weight:600">No venue allocated</span>'}
            </div>
          </div>
          <span class="tag tag-administration" style="flex-shrink:0">${scale(e.a)} · ${e.a}</span>
        </div>

        ${p.v ? `
          <div style="display:flex;align-items:center;justify-content:space-between;font-size:11.5px;color:var(--on-surface-variant)">
            <span>Day ${e.d}, ${e.s}:00–${e.s + e.h}:00</span>
            <span style="font-weight:600;color:${Math.round(e.a / p.v.cap * 100) > 90 ? 'var(--tertiary-brand)' : 'var(--secondary-brand)'}">
              fills ${Math.round(e.a / p.v.cap * 100)}% cap (${p.v.cap})
            </span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;padding-top:4px;border-top:1px solid var(--border)">
            ${chips}
          </div>
        ` : `
          <div class="card warning-card" style="padding:8px 10px;margin:2px 0">
            <small style="color:var(--tertiary-brand)">No free venue fits this crowd and slot. Add capacity or change time slot.</small>
          </div>
        `}

        <div style="display:flex;justify-content:flex-end;margin-top:2px">
          <button class="b" style="padding:4px 10px;font-size:11.5px;color:var(--tertiary-brand);border-color:var(--border)" data-a="evdel" data-v="${i}" title="Remove event">
            <span class="material-symbols-outlined" style="font-size:14px">delete</span>
            <span>Remove</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="card info-card" style="border-left: 3px solid var(--primary-container)">
      <div class="flex-row gap-2" style="justify-content:space-between;margin-bottom:4px">
        <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--primary-container)">Moksha Fest Planner</span>
        <span class="material-symbols-outlined text-primary" style="font-size:18px">festival</span>
      </div>
      <p style="font-size:12.5px;color:var(--on-surface);line-height:1.4;margin:0">
        Smallest free venue fitting each crowd size, with hourly staff assigned from the shared pool.
      </p>
    </div>

    <!-- Staff Pool Inputs -->
    <div class="card" style="padding:12px">
      <label class="field-label" style="margin-bottom:8px">Staff Pool (Available per hour)</label>
      <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:8px">
        ${Object.keys(ROLES).map(r => `
          <div style="background:var(--surface-low);padding:8px 10px;border-radius:9px;border:1px solid var(--border)">
            <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--on-surface-variant);margin-bottom:4px">
              <span class="material-symbols-outlined" style="font-size:14px">${ROLE_ICONS[r]}</span>
              <span style="font-weight:600">${ROLES[r]}</span>
            </div>
            <input type="number" min="0" id="pl-${r}" value="${S.pool[r]}" style="padding:6px 8px;font-weight:700;font-size:14px">
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Venue Capacities -->
    <div class="card" style="padding:12px">
      <label class="field-label" style="margin-bottom:8px">Venue Capacities</label>
      <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:8px;max-height:180px;overflow-y:auto;padding-right:2px">
        ${VEN.map((v, i) => `
          <div style="background:var(--surface-low);padding:6px 8px;border-radius:8px;border:1px solid var(--border)">
            <small style="display:block;font-size:11px;font-weight:600;color:var(--on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px" title="${v.n}">
              ${v.n}
            </small>
            <input type="number" min="1" id="vc-${i}" value="${v.cap}" style="padding:5px 8px;font-size:13px;font-weight:700">
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Timeline Header & Day Switcher -->
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <label class="field-label" style="margin:0">Festival Schedule</label>
        <span style="font-size:11.5px;color:var(--on-surface-variant);font-weight:600">Day ${day} Active</span>
      </div>
      <div class="seg" style="margin-bottom:10px">
        ${[1, 2, 3].map(d => `<button class="b ${day === d ? 'on' : ''}" data-a="day" data-v="${d}">Day ${d}</button>`).join('')}
      </div>

      <!-- Gantt Timeline Card -->
      <div class="card" style="padding:12px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:12px;font-weight:700;color:var(--on-surface)">Venue Gantt Timeline</span>
          <span style="font-size:11px;color:var(--outline);font-family:monospace">10:00 – 23:00</span>
        </div>

        <!-- Timeline hours ruler -->
        <div style="display:flex;margin-left:94px;margin-bottom:4px;font-size:9.5px;color:var(--outline);justify-content:space-between">
          <span>10h</span><span>14h</span><span>18h</span><span>22h</span>
        </div>

        <div style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;padding-right:2px">
          ${tl}
        </div>
      </div>
    </div>

    <!-- Summary Metrics Card -->
    <div class="card route-summary-card">
      <div class="route-header">
        <div class="flex-row gap-2">
          <span class="status-dot ${un.length ? 'dot-tertiary' : 'dot-secondary'}" style="${un.length ? 'background:var(--tertiary-brand)' : ''}"></span>
          <b style="font-size:13.5px;color:var(--on-surface)">Allocation Summary</b>
        </div>
        <span class="pill ${un.length || short.length ? 'pill-danger' : 'pill-secondary'}" style="${un.length || short.length ? 'background:#fdf0ee;color:#a82b13;border:1px solid #f7c2b8' : ''}">
          ${un.length ? `${un.length} Unplaced` : short.length ? `${short.length} Understaffed` : 'All Optimal'}
        </span>
      </div>

      <div class="stat">
        <div class="stat-box">
          <span class="stat-label">Events Placed</span>
          <b class="stat-val text-primary">${pl.length - un.length}/${pl.length}</b>
        </div>
        <div class="stat-box">
          <span class="stat-label">Understaffed</span>
          <b class="stat-val ${short.length ? 'text-tertiary' : 'text-secondary'}">${short.length}</b>
        </div>
        <div class="stat-box">
          <span class="stat-label">Unplaced</span>
          <b class="stat-val ${un.length ? 'text-tertiary' : 'text-on-surface'}">${un.length}</b>
        </div>
      </div>

      ${un.length ? `
        <div style="font-size:11.5px;color:var(--tertiary-brand);padding-top:4px">
          ⚠️ <b>Unplaced:</b> ${un.map(p => p.e.n).join(', ')}
        </div>
      ` : ''}
    </div>

    <!-- Active Event Cards -->
    <div style="display:flex;flex-direction:column;gap:8px">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <label class="field-label" style="margin:0">Events (${pl.length})</label>
        <span style="font-size:11px;color:var(--outline)">Sorted by crowd size</span>
      </div>
      ${cards}
    </div>

    <!-- Add Event Card Form -->
    <div class="card" style="padding:14px;background:var(--surface-low)">
      <div class="flex-row gap-2" style="margin-bottom:8px">
        <span class="material-symbols-outlined text-primary" style="font-size:18px">add_circle</span>
        <b style="font-size:13px;color:var(--on-surface)">Add Festival Event</b>
      </div>
      <input type="text" id="en" placeholder="Event name (e.g. Laser Light Show)" style="margin-bottom:8px">
      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:6px">
        <div>
          <small style="display:block;font-size:10px;color:var(--on-surface-variant);margin-bottom:2px">Crowd</small>
          <input type="number" id="ea" placeholder="600" min="1">
        </div>
        <div>
          <small style="display:block;font-size:10px;color:var(--on-surface-variant);margin-bottom:2px">Day</small>
          <input type="number" id="ed" min="1" max="3" placeholder="1">
        </div>
        <div>
          <small style="display:block;font-size:10px;color:var(--on-surface-variant);margin-bottom:2px">Start</small>
          <input type="number" id="es" min="10" max="21" placeholder="14">
        </div>
        <div>
          <small style="display:block;font-size:10px;color:var(--on-surface-variant);margin-bottom:2px">Hours</small>
          <input type="number" id="eh" min="1" max="6" placeholder="2">
        </div>
      </div>
      <button class="b p" style="width:100%;margin-top:10px;padding:9px" data-a="evadd">
        <span class="material-symbols-outlined" style="font-size:16px">add</span>
        <span>Add &amp; Re-plan</span>
      </button>
    </div>
  `;
}

/* ---------- Rendering Canvas (Requirement 1: Exact classes preserved) ---------- */
function draw(){
  const r=S.route,pn=new Set(r&&r.path||[]),vis=new Set(r?r.vis:[]),pe=new Set();
  if(r&&r.path)for(let i=0;i<r.path.length-1;i++)pe.add(EM[r.path[i]+'|'+r.path[i+1]].i);
  let h=`<rect width="${W}" height="${H}" class="sand"/><ellipse cx="560" cy="150" rx="95" ry="85" class="lake"/><rect x="92" y="38" width="395" height="725" rx="18" class="grass"/><rect x="480" y="505" width="165" height="160" rx="18" class="grass"/>`;
  LAWNS.forEach(([x,y,a,b])=>h+=`<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" class="lawn"/>`);
  E.forEach(e=>{if(e.link)return;const a=P(e.a),b=P(e.b);h+=`<line class="roadb" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`});
  E.forEach(e=>{if(e.link)return;const a=P(e.a),b=P(e.b);h+=`<line class="road" data-e="${e.i}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`});
  E.forEach(e=>{
    const a=P(e.a),b=P(e.b),m=S.mst&&S.mst.has(e.i),c=e.blk?'ebl':pe.has(e.i)?'erte':m?'emst':e.link?'elink':!e.acc?'estr':'ethin';
    h+=`<line class="${c}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
    if(pe.has(e.i)||m||S.ed===e.i||e.blk)h+=`<text class="wl" x="${(a.x+b.x)/2}" y="${(a.y+b.y)/2-5}" text-anchor="middle">${e.w}m${e.blk?' ✕':''}</text>`;
  });
  N.forEach(n=>{
    const j=n.c==='J';
    if(vis.has(n.id))h+=`<circle class="vis" cx="${n.x}" cy="${n.y}" r="15"/>`;
    h+=`<circle class="nd" data-n="${n.id}" cx="${n.x}" cy="${n.y}" r="${j?3.5:8}" fill="${COL[n.c]}" ${pn.has(n.id)&&!j?'stroke="#5b3fd9" stroke-width="3"':''}/>`;
    if(!j)h+=`<text class="nl" x="${n.x}" y="${n.y+19}">${n.n}</text>`;
    if(n.id===S.from)h+=`<text x="${n.x}" y="${n.y-11}" text-anchor="middle" font-size="14">🟢</text>`;
    if(n.id===S.to)h+=`<text x="${n.x}" y="${n.y-11}" text-anchor="middle" font-size="16">📍</text>`;
  });
  const m=$('#map');
  m.innerHTML=h;
  m.setAttribute('viewBox',S.vb.join(' '));
}

const opts=sel=>N.filter(n=>n.c!=='J').map(n=>`<option value="${n.id}" ${n.id===sel?'selected':''}>${n.n}</option>`).join('');

const TABS = [
  ['nav', 'Navigate', 'explore'],
  ['net', 'Network', 'hub'],
  ['res', 'Moksha Planner', 'festival'],
  ['lib', 'Library', 'local_library'],
  ['cmp', 'Compare', 'compare_arrows']
];

function tabs(){
  $('#tabs').innerHTML = TABS.map(([k, l, icon]) =>
    `<button class="tab-btn ${S.tab===k?'on':''}" data-a="tab" data-v="${k}">
      <span class="material-symbols-outlined">${icon}</span>
      <span>${l}</span>
    </button>`
  ).join('');
}

/* Building directory list (#lst) */
function blist(){
  const q = S.q.toLowerCase();
  const matched = N.filter(n => n.c !== 'J' && (n.n + n.c + (n.d || '')).toLowerCase().includes(q));
  if (!matched.length) {
    return `<div class="card info-card" style="padding:10px 12px"><small>No campus landmarks found matching "${S.q}".</small></div>`;
  }
  return matched.map(n => {
    const isSel = S.sel === n.id;
    const isTo = S.to === n.id;
    return `
      <div class="bi ${isSel ? 'sel' : ''}">
        <div class="bi-info">
          <div class="bi-title-row">
            <span class="bi-name">${n.n}</span>
            <span class="tag tag-${n.c.toLowerCase()}">${n.c}</span>
          </div>
          <small class="bi-desc">${n.d || (n.c + ' building')}</small>
        </div>
        <div class="bi-actions">
          <button class="b ${isSel ? 'p' : ''}" data-a="open" data-v="${n.id}">Open</button>
          <button class="b ${isTo ? 'p' : ''}" data-a="route" data-v="${n.id}">Route</button>
        </div>
      </div>
    `;
  }).join('');
}

/* Route summary metric card (#rc) */
function routeCard(){
  const r = S.route;
  if (!S.to) {
    return `
      <div class="card info-card">
        <div class="flex-row gap-2">
          <span class="material-symbols-outlined text-secondary" style="font-size:20px;flex-shrink:0">info</span>
          <small style="color:var(--on-surface-variant);line-height:1.4">
            Click any building on the map or press <b>Route</b> in the directory below to compute directions. Click roads to edit length or block access.
          </small>
        </div>
      </div>
    `;
  }

  if (!r || !r.path) {
    return `
      <div class="card warning-card">
        <div class="flex-row gap-2">
          <span class="material-symbols-outlined text-tertiary" style="font-size:22px;flex-shrink:0">warning</span>
          <div>
            <b style="color:var(--tertiary-brand)">No route found.</b><br>
            <small style="color:var(--on-surface-variant)">Blocked roads or the step-free accessible setting may disconnect these locations.</small>
          </div>
        </div>
      </div>
    `;
  }

  const st = r.path.map((id, i) =>
    i ? `<li>${P(r.path[i-1]).n} <span style="color:var(--outline)">→</span> <b>${P(id).n}</b> <small>(${EM[r.path[i-1]+'|'+id].w} m)</small></li>` : ''
  ).join('');

  return `
    <div class="card route-summary-card">
      <div class="route-header">
        <div class="flex-row gap-2">
          <span class="status-dot dot-secondary"></span>
          <b style="font-size:13.5px;color:var(--on-surface)">${NAMES[S.algo]}</b>
        </div>
        <span class="pill pill-secondary">${S.acc ? '♿ Step-Free' : 'Standard'}</span>
      </div>
      ${S.algo === 'dfs' ? '<small class="algo-warning">⚠️ DFS does not guarantee the shortest path.</small>' : ''}
      <div class="stat">
        <div class="stat-box">
          <span class="stat-label">Distance</span>
          <b class="stat-val text-primary">${r.cost} m</b>
        </div>
        <div class="stat-box">
          <span class="stat-label">Walk time</span>
          <b class="stat-val text-on-surface">${Math.max(1, Math.round(r.cost / 75))} min</b>
        </div>
        <div class="stat-box">
          <span class="stat-label">Nodes</span>
          <b class="stat-val text-secondary">${r.vis.length}</b>
        </div>
      </div>
      <div class="steps-section">
        <div class="steps-title">Turn-by-turn directions</div>
        <ol class="steps-list">${st}</ol>
      </div>
    </div>
  `;
}

/* Main panel (#pn) */
function panel(){
  tabs();
  let h = '';

  if (S.tab === 'nav') {
    const totalLandmarks = N.filter(n => n.c !== 'J').length;
    h = `
      <div class="card waypoint-card">
        <div>
          <label class="field-label" for="from">From Origin</label>
          <div class="input-icon-wrap">
            <span class="material-symbols-outlined input-icon icon-origin">trip_origin</span>
            <select id="from">${opts(S.from)}</select>
            <span class="material-symbols-outlined select-arrow">expand_more</span>
          </div>
        </div>

        <div>
          <label class="field-label" for="to">To Destination</label>
          <div class="input-icon-wrap">
            <span class="material-symbols-outlined input-icon icon-dest">location_on</span>
            <select id="to">
              <option value="">Choose destination</option>
              ${opts(S.to)}
            </select>
            <span class="material-symbols-outlined select-arrow">expand_more</span>
          </div>
        </div>

        <div class="algo-row">
          <div class="algo-header">
            <span class="field-label">Graph Algorithm</span>
            <span class="algo-sub">${S.algo === 'dijkstra' ? 'Shortest Path' : S.algo === 'bfs' ? 'Fewest Stops' : 'First Path'}</span>
          </div>
          <div class="seg">
            ${Object.keys(ALG).map(a => `<button class="b ${S.algo===a?'on':''}" data-a="algo" data-v="${a}">${a==='dijkstra'?'Dijkstra':a.toUpperCase()}</button>`).join('')}
          </div>
        </div>

        <label class="checkbox-label">
          <input type="checkbox" id="acc" ${S.acc ? 'checked' : ''}>
          <span>♿ Accessible routes only (avoid stairs)</span>
        </label>
      </div>

      <div id="rc">${routeCard()}</div>

      <div class="directory-section">
        <div class="directory-header">
          <h2 class="directory-title">Campus Directory</h2>
          <span class="directory-count">${totalLandmarks} Landmarks</span>
        </div>
        <div class="search-wrap">
          <span class="material-symbols-outlined search-icon">search</span>
          <input type="text" id="q" placeholder="Search (e.g. Library, GJ Block)" value="${S.q}">
        </div>
        <div id="lst">${blist()}</div>
      </div>
    `;
  }

  if (S.tab === 'net') {
    const unblocked = E.filter(e => !e.blk);
    const tot = unblocked.reduce((s, e) => s + e.w, 0);
    const m = S.mst ? [...S.mst].reduce((s, i) => s + E[i].w, 0) : 0;
    const pct = S.mst && tot > 0 ? Math.round((1 - m / tot) * 100) : 0;
    const mstCount = S.mst ? S.mst.size : 0;

    h = `
      <div class="card info-card" style="border-left: 3px solid var(--primary-container)">
        <div class="flex-row gap-2" style="justify-content:space-between;margin-bottom:4px">
          <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--primary-container)">Topological Optimizer</span>
          <span class="material-symbols-outlined text-primary" style="font-size:18px">account_tree</span>
        </div>
        <p style="font-size:12.5px;color:var(--on-surface);line-height:1.4;margin:0">
          Plan the cheapest set of paths that still connects every building (minimum spanning tree).
        </p>
      </div>

      <div>
        <label class="field-label">Select Algorithm</label>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
          <button class="b ${S.mk==='prim'?'p':''}" data-a="mst" data-v="prim" title="Prim's Algorithm">
            <span class="material-symbols-outlined" style="font-size:16px">polyline</span>
            <span>Prim's</span>
          </button>
          <button class="b ${S.mk==='kruskal'?'t':''}" data-a="mst" data-v="kruskal" title="Kruskal's Algorithm">
            <span class="material-symbols-outlined" style="font-size:16px">device_hub</span>
            <span>Kruskal's</span>
          </button>
          <button class="b" data-a="mst" data-v="" title="Clear Spanning Tree">
            <span class="material-symbols-outlined" style="font-size:16px">restart_alt</span>
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div class="card route-summary-card">
        <div class="route-header">
          <div class="flex-row gap-2">
            <span class="status-dot ${S.mst ? 'dot-secondary' : ''}" style="${!S.mst ? 'background:var(--outline)' : ''}"></span>
            <b style="font-size:13.5px;color:var(--on-surface)">Network Benchmark</b>
          </div>
          <span class="pill ${S.mst ? 'pill-secondary' : ''}" style="${!S.mst ? 'background:var(--surface-high);color:var(--on-surface-variant);border:1px solid var(--border)' : ''}">
            ${S.mst ? (S.mk === 'prim' ? "Prim's MST" : "Kruskal's MST") : 'No MST Calculated'}
          </span>
        </div>

        <div class="stat">
          <div class="stat-box">
            <span class="stat-label">Full network</span>
            <b class="stat-val text-on-surface">${tot} m</b>
          </div>
          <div class="stat-box">
            <span class="stat-label">MST length</span>
            <b class="stat-val text-primary">${S.mst ? m + ' m' : '—'}</b>
          </div>
          <div class="stat-box">
            <span class="stat-label">Paving saved</span>
            <b class="stat-val text-secondary">${S.mst ? pct + '%' : '—'}</b>
          </div>
        </div>
      </div>

      <div class="card" style="padding:0;overflow:hidden;border-radius:12px">
        <div style="padding:10px 14px;background:var(--surface-container);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
          <div class="flex-row gap-2">
            <span class="material-symbols-outlined" style="font-size:16px;color:var(--on-surface-variant)">list_alt</span>
            <b style="font-size:12.5px;color:var(--on-surface)">Campus Connections &amp; Edges</b>
          </div>
          <span style="font-size:11px;font-family:monospace;color:var(--on-surface-variant)">
            ${S.mst ? `${mstCount} of ${E.length} edges` : `${E.length} edges total`}
          </span>
        </div>
        <div style="max-height:220px;overflow-y:auto">
          <table>
            <thead>
              <tr>
                <th style="padding-left:14px">Connection Pair</th>
                <th style="text-align:right">Distance</th>
                <th style="text-align:right;padding-right:14px">Status</th>
              </tr>
            </thead>
            <tbody>
              ${E.map(e => {
                const inMst = S.mst && S.mst.has(e.i);
                const isBlk = e.blk;
                const isLink = e.link;
                const statusTag = isBlk
                  ? '<span class="tag tag-library">Blocked</span>'
                  : inMst
                  ? '<span class="tag tag-academic">In MST</span>'
                  : isLink
                  ? '<span class="tag tag-gate">Link</span>'
                  : '<span class="tag tag-gate">Spare</span>';
                return `
                  <tr style="${inMst ? 'background:rgba(20,160,133,0.08)' : ''}">
                    <td style="padding-left:14px">
                      <b>${P(e.a).n}</b> <span style="color:var(--outline)">↔</span> <b>${P(e.b).n}</b>
                    </td>
                    <td style="text-align:right;font-family:monospace">${e.w} m</td>
                    <td style="text-align:right;padding-right:14px">${statusTag}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card info-card">
        <div class="flex-row gap-2">
          <span class="material-symbols-outlined text-secondary" style="font-size:18px;flex-shrink:0">lightbulb</span>
          <small style="color:var(--on-surface-variant);line-height:1.4">
            Green roads (<code style="font-weight:600">.emst</code>) are kept in the MST. Click any road on the map to modify its length or block it to see the spanning tree recalculate live.
          </small>
        </div>
      </div>
    `;
  }

  if (S.tab === 'res') h = fest();

  if (S.tab === 'lib') {
    h = `
      <div class="card info-card" style="border-left: 3px solid var(--primary-container)">
        <div class="flex-row gap-2" style="justify-content:space-between;margin-bottom:4px">
          <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--primary-container)">Library Catalog</span>
          <span class="material-symbols-outlined text-primary" style="font-size:18px">local_library</span>
        </div>
        <p style="font-size:12.5px;color:var(--on-surface);line-height:1.4;margin:0">
          Prefix-indexed search across textbook inventory, stacks and active student loans.
        </p>
      </div>

      <div class="search-wrap">
        <span class="material-symbols-outlined search-icon">search</span>
        <input type="text" id="lq" placeholder="Search title, author or topic (e.g. Cormen, DP, OS)" value="${S.lq}">
      </div>

      <div id="lsum">${lsummary()}</div>

      <div id="ll" style="display:flex;flex-direction:column;gap:8px">${llist()}</div>
    `;
  }

  if (S.tab === 'cmp') {
    if (!S.to) {
      h = `
        <div class="card info-card" style="border-left: 3px solid var(--primary-container)">
          <div class="flex-row gap-2" style="justify-content:space-between;margin-bottom:4px">
            <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--primary-container)">Algorithm Comparison</span>
            <span class="material-symbols-outlined text-primary" style="font-size:18px">compare_arrows</span>
          </div>
          <p style="font-size:12.5px;color:var(--on-surface);line-height:1.4;margin:0">
            Compare pathfinding performance across Dijkstra, BFS, and DFS.
          </p>
        </div>

        <div class="card info-card" style="padding:22px 16px;text-align:center">
          <span class="material-symbols-outlined text-secondary" style="font-size:36px;margin-bottom:8px">location_searching</span>
          <b style="display:block;font-size:14px;color:var(--on-surface)">No Destination Selected</b>
          <p style="font-size:12px;color:var(--on-surface-variant);margin:4px 0 14px;line-height:1.4">
            Pick a destination in the <b>Navigate</b> tab first to benchmark routing algorithms between campus landmarks.
          </p>
          <button class="b p" data-a="tab" data-v="nav" style="padding:8px 16px">
            <span class="material-symbols-outlined" style="font-size:16px">explore</span>
            <span>Go to Navigate</span>
          </button>
        </div>
      `;
    } else {
      const results = Object.keys(ALG).map(a => ({ algo: a, r: compute(a, 200) }));
      const validCosts = results.filter(x => x.r.path).map(x => x.r.cost);
      const minCost = validCosts.length ? Math.min(...validCosts) : null;
      const fromNode = P(S.from);
      const toNode = P(S.to);

      const rows = results.map(({ algo, r }) => {
        const hasPath = !!r.path;
        const isShortest = hasPath && minCost !== null && r.cost === minCost;
        const colorDot = algo === 'dijkstra'
          ? 'var(--primary-container)'
          : algo === 'bfs'
          ? 'var(--secondary-brand)'
          : 'var(--tertiary-brand)';

        const distHtml = hasPath
          ? `<b class="${isShortest ? 'text-secondary' : 'text-on-surface'}">${r.cost} m</b>${isShortest ? ' <span class="tag tag-academic" style="font-size:9.5px;padding:1px 5px;margin-left:4px">Shortest</span>' : ''}`
          : '<span class="tag tag-library">No path</span>';

        const stopsHtml = hasPath ? `${r.path.length}` : '—';

        return `
          <tr style="${isShortest ? 'background:rgba(20,160,133,0.06)' : ''}">
            <td style="padding:10px 12px">
              <div style="display:flex;align-items:center;gap:6px">
                <span style="width:8px;height:8px;border-radius:50%;background:${colorDot};flex-shrink:0"></span>
                <b>${algo === 'dijkstra' ? 'Dijkstra' : algo.toUpperCase()}</b>
              </div>
            </td>
            <td style="padding:10px 8px;font-family:monospace">${distHtml}</td>
            <td style="padding:10px 8px">${stopsHtml}</td>
            <td style="padding:10px 8px;font-family:monospace;color:var(--on-surface-variant)">${r.vis.length} nodes</td>
            <td style="padding:10px 12px;text-align:right;font-family:monospace">${r.ms.toFixed(3)} ms</td>
          </tr>
        `;
      }).join('');

      h = `
        <div class="card info-card" style="border-left: 3px solid var(--primary-container)">
          <div class="flex-row gap-2" style="justify-content:space-between;margin-bottom:4px">
            <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--primary-container)">Algorithm Comparison</span>
            <span class="material-symbols-outlined text-primary" style="font-size:18px">compare_arrows</span>
          </div>
          <p style="font-size:12.5px;color:var(--on-surface);line-height:1.4;margin:0">
            Topological search benchmark and execution metrics across 200 repetitions.
          </p>
        </div>

        <!-- Route Banner (From → To) -->
        <div class="card" style="padding:12px 14px;background:var(--surface-low);display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:8px">
            <div class="flex-row gap-2" style="font-size:13px;font-weight:600;color:var(--on-surface);flex-wrap:wrap">
              <span class="tag tag-gate" style="font-size:11px">${fromNode.n}</span>
              <span class="material-symbols-outlined text-outline" style="font-size:16px">arrow_forward</span>
              <span class="tag tag-academic" style="font-size:11px">${toNode.n}</span>
            </div>
          </div>
          <button class="b" data-a="tab" data-v="nav" style="padding:4px 10px;font-size:11.5px">Change</button>
        </div>

        <!-- Comparison Table -->
        <div class="card" style="padding:0;overflow:hidden;border-radius:12px">
          <div style="overflow-x:auto">
            <table>
              <thead>
                <tr>
                  <th style="padding:10px 12px">Algorithm</th>
                  <th style="padding:10px 8px">Distance</th>
                  <th style="padding:10px 8px">Stops</th>
                  <th style="padding:10px 8px">Explored</th>
                  <th style="padding:10px 12px;text-align:right">Time</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Short Explanation Card -->
        <div class="card info-card" style="background:var(--surface-low)">
          <div style="display:flex;align-items:flex-start;gap:8px">
            <span class="material-symbols-outlined text-primary" style="font-size:20px;flex-shrink:0;margin-top:1px">lightbulb</span>
            <div style="font-size:12px;line-height:1.5;color:var(--on-surface)">
              <b style="color:var(--primary-container)">Dijkstra</b> always gives the shortest distance (it uses a binary min-heap).<br>
              <b style="color:var(--secondary-brand)">BFS</b> gives the fewest stops, not necessarily the fewest metres.<br>
              <b style="color:var(--tertiary-brand)">DFS</b> gives the first path it finds through the graph.
            </div>
          </div>
        </div>
      `;
    }
  }

  $('#pn').innerHTML = h;
}

function lsummary(){
  const av = BOOKS.filter(b => b.av).length;
  const is = BOOKS.length - av;
  const matched = lsearch(S.lq);
  return `
    <div class="card" style="padding:10px 14px;background:var(--surface-low);display:flex;align-items:center;justify-content:space-between;font-size:12px">
      <div class="flex-row gap-2">
        <span class="status-dot dot-secondary" style="width:8px;height:8px"></span>
        <span><b>${av}</b> Available</span>
        <span style="color:var(--outline)">·</span>
        <span class="status-dot" style="width:8px;height:8px;background:var(--tertiary-brand)"></span>
        <span><b>${is}</b> Issued</span>
      </div>
      <span style="font-size:11px;color:var(--on-surface-variant);font-weight:600">
        ${matched.length === BOOKS.length ? `${BOOKS.length} total` : `${matched.length} of ${BOOKS.length} matched`}
      </span>
    </div>
  `;
}

function renderLibrary(){
  if ($('#lsum')) $('#lsum').innerHTML = lsummary();
  if ($('#ll')) $('#ll').innerHTML = llist();
}

function llist(){
  const matched = lsearch(S.lq);
  if (!matched.length) {
    return `
      <div class="card info-card" style="padding:18px;text-align:center">
        <div class="material-symbols-outlined text-secondary" style="font-size:32px;margin-bottom:6px">menu_book</div>
        <b style="display:block;font-size:13.5px;color:var(--on-surface)">No books found</b>
        <small style="color:var(--on-surface-variant);display:block;margin-top:3px">
          No matches found for "<b>${S.lq.replace(/[&<>"]/g, c => '&#' + c.charCodeAt(0) + ';')}</b>". Try searching by topic like <em>algorithms</em>, <em>database</em>, or <em>networks</em>.
        </small>
      </div>
    `;
  }

  return matched.map(b => {
    const isAv = b.av;
    return `
      <div class="card" style="padding:12px 14px;display:flex;flex-direction:column;gap:8px;transition:border-color 0.15s ease">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:3px">
              <span class="tag ${isAv ? 'tag-academic' : 'tag-library'}">
                ● ${isAv ? 'Available' : 'Issued'}
              </span>
              <span style="font-family:monospace;font-size:11px;color:var(--outline);font-weight:600">
                ${b.id}
              </span>
            </div>
            <h3 style="font-size:13.5px;font-weight:700;color:var(--on-surface);line-height:1.3;margin:0">
              ${b.t}
            </h3>
            <small style="color:var(--on-surface-variant);display:block;margin-top:2px">
              ${b.a}
            </small>
          </div>
          <button class="b ${isAv ? 'p' : ''}" style="flex-shrink:0;padding:6px 12px;font-size:12px;${!isAv ? 'color:var(--tertiary-brand);border-color:var(--border)' : ''}" data-a="issue" data-v="${b.id}" title="${isAv ? 'Issue this book' : 'Return this book'}">
            <span class="material-symbols-outlined" style="font-size:15px">${isAv ? 'check_circle' : 'assignment_return'}</span>
            <span>${isAv ? 'Issue' : 'Return'}</span>
          </button>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;padding-top:6px;border-top:1px solid var(--border);font-size:11px;color:var(--on-surface-variant)">
          <span style="display:flex;align-items:center;gap:4px">
            <span class="material-symbols-outlined text-secondary" style="font-size:14px">pin_drop</span>
            <span>Central Library Stacks</span>
          </span>
          <span style="color:var(--outline);font-family:monospace">
            ${b.k.split(' ').slice(0, 2).map(tag => '#' + tag).join(' ')}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

/* Selected building popup (#pop) */
function pop(){
  const n = P(S.sel), el = $('#pop');
  if (!n) {
    el.style.display = 'none';
    return;
  }
  el.style.display = 'block';
  el.innerHTML = `
    <div class="pop-header">
      <div class="pop-icon-title">
        <div class="pop-icon">
          <span class="material-symbols-outlined">place</span>
        </div>
        <div>
          <div class="pop-title-row">
            <h3 class="pop-title">${n.n}</h3>
            <span class="tag tag-${n.c.toLowerCase()}">${n.c}</span>
          </div>
          <small class="pop-sub">📍 Campus Landmark</small>
        </div>
      </div>
      <button class="pop-close" data-a="clr" title="Close"><span class="material-symbols-outlined">close</span></button>
    </div>
    ${n.d ? `<p class="pop-desc">${n.d}</p>` : ''}
    <div class="pop-actions">
      <button class="b" data-a="start" data-v="${n.id}">Start here</button>
      <button class="b p" data-a="route" data-v="${n.id}">
        <span class="material-symbols-outlined">navigation</span>
        Get Directions
      </button>
    </div>
  `;
}

/* Road editor (#ed) */
function editor(){
  const e = E[S.ed], el = $('#ed');
  if (!e) {
    el.style.display = 'none';
    return;
  }
  el.style.display = 'block';
  el.innerHTML = `
    <div class="pop-header">
      <b>${P(e.a).n} ↔ ${P(e.b).n}</b>
      <button class="pop-close" data-a="edx" title="Close"><span class="material-symbols-outlined">close</span></button>
    </div>
    <label class="field-label" for="ew">Length (meters)</label>
    <input type="number" id="ew" min="1" value="${e.w}">
    <div class="row" style="margin-top:10px;gap:8px">
      <button class="b ${e.blk ? 'p' : ''}" data-a="blk">${e.blk ? 'Unblock road' : 'Block road'}</button>
      <button class="b" data-a="edx">Close</button>
    </div>
  `;
}

function go(){
  S.route = S.to && S.from ? compute() : null;
  draw();
  if ($('#rc')) $('#rc').innerHTML = routeCard();
  else if (S.tab === 'cmp') panel();
}

function zoom(f){
  const [x, y, w, h] = S.vb;
  const nw = Math.min(W, Math.max(220, w * f));
  const nh = nw * H / W;
  S.vb = [
    Math.max(0, Math.min(W - nw, x + (w - nw) / 2)),
    Math.max(0, Math.min(H - nh, y + (h - nh) / 2)),
    nw,
    nh
  ];
  draw();
}

/* Theme toggle (in-memory document attribute toggle) */
function initTheme(){
  const btn = $('#theme-btn');
  const icon = $('#theme-icon');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      if (icon) icon.textContent = next === 'dark' ? 'light_mode' : 'dark_mode';
    });
  }
}

/* ---------- Events ---------- */
function act(a, v){
  switch(a){
    case 'tab': S.tab = v; panel(); break;
    case 'algo': S.algo = v; panel(); go(); break;
    case 'open': S.sel = v; pop(); break;
    case 'route': S.to = v; S.sel = v; pop(); if (S.tab !== 'nav') S.tab = 'nav'; panel(); go(); break;
    case 'start': S.from = v; panel(); go(); break;
    case 'locate': S.from = 'gate'; panel(); go(); break;
    case 'clr': S.to = null; S.route = null; S.mst = null; S.mk = ''; S.sel = null; pop(); panel(); draw(); break;
    case 'mst': S.mk = v; S.mst = v ? new Set(mst(v).map(e => e.i)) : null; panel(); draw(); break;
    case 'blk': E[S.ed].blk ^= 1; editor(); go(); if (S.mk) act('mst', S.mk); break;
    case 'edx': S.ed = null; editor(); break;
    case 'issue': {
      const b = BOOKS.find(x => x.id === v);
      if (b) {
        b.av = !b.av;
        renderLibrary();
      }
      break;
    }
    case 'day': S.day = +v; panel(); break;
    case 'evdel': EV.splice(+v, 1); panel(); break;
    case 'evadd': {
      const g = i => $('#' + i).value;
      const a = +g('ea');
      const d = Math.min(3, Math.max(1, +g('ed') || 1));
      const s = Math.min(21, Math.max(10, +g('es') || 10));
      const h = Math.min(22 - s, Math.max(1, +g('eh') || 1));
      const n = g('en').trim().replace(/[&<>"]/g, c => '&#' + c.charCodeAt(0) + ';');
      if (!n || !(a > 0)) break;
      EV.push({ n, a, d, s, h });
      S.day = d;
      panel();
      break;
    }
    case 'zi': zoom(0.75); break;
    case 'zo': zoom(1.33); break;
    case 'zr': S.vb = [0, 0, W, H]; draw(); break;
  }
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-a]');
  if (t) return act(t.dataset.a, t.dataset.v);
  const n = e.target.closest('[data-n]');
  if (n && NM[n.dataset.n].c !== 'J') {
    S.sel = n.dataset.n;
    S.to = n.dataset.n;
    pop();
    if (S.tab === 'nav') panel();
    go();
    return;
  }
  const r = e.target.closest('[data-e]');
  if (r) {
    S.ed = +r.dataset.e;
    editor();
  }
});

document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'from') { S.from = t.value; go(); }
  if (t.id === 'to') { S.to = t.value || null; S.sel = S.to; pop(); go(); }
  if (t.id === 'acc') { S.acc = t.checked; go(); }
  if (t.id === 'q') { S.q = t.value; $('#lst').innerHTML = blist(); }
  if (t.id === 'lq') { S.lq = t.value; renderLibrary(); }
  if (t.id === 'ew') { E[S.ed].w = Math.max(1, +t.value || 1); go(); if (S.mk) act('mst', S.mk); }
});

document.addEventListener('change', e => {
  const t = e.target, m = (t.id || '').split('-');
  if (m[0] === 'pl' && m[1]) { S.pool[m[1]] = Math.max(0, +t.value || 0); panel(); }
  if (m[0] === 'vc' && m[1]) { VEN[+m[1]].cap = Math.max(1, +t.value || 1); panel(); }
});

initTheme();
panel();
draw();
