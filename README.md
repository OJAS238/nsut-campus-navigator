# Smart Campus Navigation and Resource Optimizer (NSUT)

A high-performance, responsive campus navigator and festival resource optimizer designed for students and visitors of Netaji Subhas University of Technology (NSUT), Delhi. Built with modern vanilla JavaScript and Vite, styled using the Google Stitch design system.

---

## 🚀 How to Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 How to Build and Deploy

1. **Build for production:**
   ```bash
   npm run build
   ```
   This compiles and bundles all assets into the static `dist/` directory.

2. **Deploy to Vercel or Netlify:**
   * **Vercel:** Connect your repository, set the build command to `npm run build`, and set the output directory to `dist`.
   * **Netlify:** Drag and drop the `dist/` directory directly into the Netlify dashboard, or connect your repository with build command `npm run build` and publish directory `dist`.
   * **GitHub Pages:** Add `base: './'` to your `vite.config.js`, run `npm run build`, and deploy the `dist/` folder.

---

## 🗺️ Where the Data Lives

All graph topology, business logic, campus data, and algorithms reside strictly in **`src/engine.js`**:

* **Campus Graph (`N`, `E`):** Coordinates, building metadata (`id`, `name`, `category`, `description`), and road edges with distances and accessibility flags.
* **Pathfinding (`ALG`, `compute()`):** Dijkstra's algorithm (using a binary `MinHeap`), Breadth-First Search (BFS), and Depth-First Search (DFS).
* **Minimum Spanning Tree (`mst()`):** Prim's and Kruskal's algorithms for calculating optimal campus paving and network connectivity.
* **Moksha Fest Planner (`VEN`, `EV`, `plan()`):** Venue capacities, festival events, crowd scaling, and greedy slot/staff scheduling.
* **Library Catalog (`BOOKS`, `lsearch()`):** Hash-indexed prefix lookup across book titles, authors, and topic tags.
* **Shared State (`S`):** Active tab, selected nodes, active route, algorithm choice, staff pool, and viewport bounding box.

The user interface in **`src/main.js`**, **`src/styles.css`**, and **`index.html`** dynamically consumes `engine.js` without hardcoded data.

---

## 🧭 Key Features

* **Navigate:** From & To landmark routing with Dijkstra, BFS, and DFS, step-free wheelchair accessibility filter, route metric cards, step-by-step directions, and searchable campus directory.
* **Network:** Prim's and Kruskal's Minimum Spanning Tree algorithms with full network benchmark, MST length, and live paving saved %.
* **Moksha Planner:** Multi-venue event allocation, hourly staff pool adjustments (Security, Volunteers, Tech crew, Medical), Day 1–3 timeline Gantt matrix (10:00–23:00), and custom event creation.
* **Library:** Prefix search across titles, authors, and keywords with instant Issue/Return loan tracking.
* **Compare:** Side-by-side benchmark comparing Dijkstra, BFS, and DFS for distance, stop counts, explored nodes, and microsecond execution time.
* **Map & HUD Controls:** Interactive SVG campus map with locate me, clear route, zoom in/out, view reset, and live road length/blocking editor.
* **Responsive Layout:** Fixed 410px docked sidebar on desktop, reflowing into an adaptive bottom sheet on mobile viewports (<780px).
* **Light & Dark Theme:** Full color-scheme support via CSS custom properties.
