# Google Stitch prompt

Paste this into Google Stitch (web, desktop layout first, then ask for a mobile version):

---
Design a clean, modern web app called "NSUT Campus Navigator" for students of Netaji Subhas University of Technology. Layout: a 410px left sidebar and a large map area on the right. On mobile, the map sits on top and the sidebar becomes a bottom sheet.

Sidebar has five tabs: Navigate, Network, Moksha Planner, Library, Compare.
- Navigate: From and To dropdowns, a segmented control for Dijkstra / BFS / DFS, a checkbox "Accessible routes only", a route summary card (distance, walk time, nodes explored, numbered directions), a search box, and a scrolling list of buildings with "Open" and "Route" buttons.
- Network: Prim and Kruskal buttons, a stats card (full network length, MST length, paving saved).
- Moksha Planner: four number inputs for the staff pool (Security, Volunteers, Tech crew, Medical), venue capacity inputs, Day 1/2/3 switcher, a venue-by-hour timeline, event cards (name, scale tag, venue, time slot, staff chips such as "Security 8/12" in green or red), and an "Add event" form.
- Library: search box and a list of books with Available/Issued tags and Issue/Return buttons.
- Compare: a table of Dijkstra, BFS and DFS with distance, stops, nodes explored and time.

Map area: a placeholder for a campus illustration with floating buttons for Locate Me, Clear Route, zoom in, zoom out and reset, plus a small popup card for a selected building (name, category tag, "Start here" and "Get Directions").

Style: friendly campus look, purple primary (#5b3fd9), teal secondary (#14a085), rounded corners, soft shadows, light and dark mode.
---

## After Stitch generates it
1. Export the HTML/CSS (or copy the code) from Stitch.
2. Keep the map as `<svg id="map" viewBox="0 0 655 771"></svg>`. The engine draws the campus into it.
3. Send me the exported code and I will wire it to `src/engine.js`, or wire it yourself using the API in README.md.
