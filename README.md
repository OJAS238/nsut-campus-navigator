# NSUT Campus Navigator

A smart campus navigation and resource planning web app for **Netaji Subhas University of Technology (NSUT), Dwarka**. It models the campus as a graph, finds routes between buildings with classic graph algorithms, plans the cheapest road network, and schedules venues and staff for the **Moksha** fest.

**Live demo:** https://nsut-campus-navigator.vercel.app
## Features

| Tab | What it does |
|---|---|
| **Navigate** | Pick a start and a destination (or click buildings on the map) and get the route, distance, walking time, step-by-step directions and the number of nodes explored. Choose Dijkstra, BFS or DFS. Search buildings, block roads, or edit road lengths and watch the route update. |
| **Network** | Computes the cheapest set of roads that still connects every building (minimum spanning tree) with Prim's or Kruskal's algorithm, and shows the total length and the paving saved. |
| **Moksha Planner** | Places each fest event in the smallest free venue that fits the crowd, then assigns Security, Volunteers, Tech crew and Medical staff hour by hour from an editable pool. Shows a day-wise venue timeline, venue fill, walking distance from the Main Gate, and flags understaffed or unplaced events. |
| **Library** | Hash-indexed catalogue with fast prefix search on title, author and topic, plus Issue and Return. |
| **Compare** | Runs Dijkstra, BFS and DFS on the same route and compares distance, stops, nodes explored and run time. |

The interface supports light and dark mode and works on desktop and mobile (the sidebar becomes a bottom sheet on small screens).

## Tech stack

- **JavaScript (ES modules)**, no framework
- **Vite** for the dev server and production build
- **SVG** for the interactive campus map
- **HTML and CSS** with CSS variables for theming
- **Inter** and **Material Symbols** for typography and icons
- UI designed in **Google Stitch** and connected to the code with the Stitch MCP in Antigravity

There are no runtime dependencies and no backend.

## Algorithms and data structures

| Area | Technique |
|---|---|
| Shortest route | Dijkstra with a binary min-heap |
| Fewest stops / any path | BFS (queue) and DFS (stack) |
| Road network planning | Prim's (min-heap) and Kruskal's (union-find) |
| Library search | Inverted hash index with prefix matching |
| Venue allocation | Greedy best-fit with time-overlap checks |
| Staff allocation | Hour-by-hour allocation from a pool, largest events first |

## Project structure

```
.
├── index.html          # Page shell
├── src/
│   ├── engine.js       # Campus data, graph algorithms, Moksha planner, library (no DOM code)
│   ├── main.js         # User interface: rendering, tabs and event handling
│   └── styles.css      # Theme and layout
├── package.json
└── README.md
```

`engine.js` has no DOM code, so any interface can be placed on top of it. `main.js` imports `compute()`, `mst()`, `plan()`, `lsearch()` and the shared state `S` from it.

## Getting started

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
git clone https://github.com/OJAS238/nsut-campus-navigator.git
cd nsut-campus-navigator
npm install
npm run dev
```

Open the address that Vite prints (usually `http://localhost:5173`).

### Build and deploy

```bash
npm run build      # creates the dist/ folder
npm run preview    # serves the production build locally
```

To deploy, import the repository on Vercel or Netlify with the build command `npm run build` and the output directory `dist`. No environment variables are needed.

## Customising the data

Everything campus-specific lives in `src/engine.js`:

- **Places:** the `N` list, one place per line as `id|name|category|x|y|description`. The x and y values are positions on the map.
- **Roads and links:** the `E` list. `a-b` is a road. `a~b` is a short dotted entrance link for a building with no drawn path. Roads get a length from their coordinates, and you can edit lengths live in the app.
- **Stairs:** set `acc:0` on a road to mark it as not step-free. The "Accessible routes only" option then avoids it.
- **Moksha venues and events:** the `VEN` and `EV` lists, and the staffing rules in `need()`.
- **Library books:** the `BOOKS` list.

## Limitations

- The map is a schematic redraw traced by eye from the NSUT campus illustration. Positions and distances (about 1 map pixel per metre) are approximate.
- Dotted links are assumed entrance paths, not roads.
- No road is marked as having stairs yet, so the accessible-only option has no effect until you add that data.
- Moksha events, venue capacities, staffing ratios and library books are sample data.
- There is no database. Issued books, added events and edited roads reset when the page reloads.

## Roadmap

- Save changes with a small Node backend and a database
- Real Moksha schedule and library catalogue
- Real-time crowd and open-hours data for buildings
- Mark step-free routes accurately

## Credits

- Campus layout based on the "NSUT The Map" illustration (credit: The Alliance)
- Built by [@OJAS238](https://github.com/OJAS238)
- Built by [@Tanmay-y](https://github.com/Tanmay-y)
- Built by [@AnjuSinha07](https://github.com/AnjuSinha07)
