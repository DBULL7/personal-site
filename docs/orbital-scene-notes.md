# Culture Orbital scene notes

Read this before changing `/orbital` or the Orbital portions of
`components/space/space-scene.tsx`. These notes record the decisions reached
through visual iteration with Devon, including the distinction between book
lore and choices made for this website.

## Creative goal

The scene should evoke awe: a settled artificial world of impossible scale,
not a conventional space station or an empty Halo-like ring. It should feel
calm, inhabited, enormously old, and competently managed.

The preferred Overview composition is a three-quarter view of the whole ring:
imagine the ring lying nearly flat, with the edge nearest the viewer raised
slightly. Do not approach along the ring's axis or let it flatten into an `O`.

## Arrival sequence

- The arrival is a fin-mounted or exterior-camera view from a Culture ship.
- Keep the Energy Grid / hyperspace portion short: currently 4 seconds.
- On entering realspace, retain the exact Overview sightline for the entire
  approach. The ring should only grow in apparent size; it must not rotate from
  face-on into the Overview angle.
- The realspace approach is currently 20 seconds. Its motion is front-loaded so
  the Orbital visibly grows immediately, then eases into the final framing.
- The flight ends by handing directly to Overview. It does not fly past the rim,
  enter the atmosphere, or dock.
- No hard camera shake at realspace translation. The transition should feel
  extremely controlled.
- The sequence auto-plays once per browser session and can be replayed with the
  Arrival control. If its behavior changes materially, bump the session-storage
  version so the revised sequence is easy to review.

## Orbital lore and structure

Primary reference: Iain M. Banks, [A Few Notes on the Culture](https://theculture.adactio.com/),
especially the Habitat and Travel sections.

Canon or directly supported by Banks's notes:

- A typical Orbital is a rotating ring about three million kilometres across,
  tilted slightly off its system's ecliptic. Its spin supplies apparent gravity
  and a roughly Culture-day day/night cycle.
- The inhabited surface is assembled from Plates. A normal minimum width is
  roughly 1,000 km, or roughly 2,000 km including the sloped transparent
  retaining walls.
- The usual land-to-sea ratio is approximately 1:3. Landscapes include islands,
  seas, rivers, lakes, mountains, deserts, settlements, and active weather.
- Almost every Orbital has a central Hub. The Hub normally is not physically
  joined to the ring. It houses the controlling Mind and coordinates transport,
  manufacturing, maintenance, communications, and nearby ship traffic.
- The Hub is not described as the main docking structure.
- Manufacturing and maintenance volumes, access shafts, airlocks, and rapid
  vacuum transport exist below or on the exterior of the Plates.

Website design inferences, not explicit canon:

- This scene uses 32 evenly spaced docking/transfer ports around the ring layer,
  with guidance beacons. This is a readable expression of the Plate underside
  infrastructure; Banks does not specify the number or regular spacing.
- Small vessels can visit those ports. Liners and Systems Vehicles hold at
  progressively larger clearances over an assigned ring port rather than
  physically touching the habitat.
- The visible central Hub remains as the Mind and traffic-control structure,
  but no ship route should use it as a dock.

## Ship traffic rules

Every ambient ship must follow the same spatial grammar:

1. Translate into realspace only at a distant jump perimeter.
2. Travel continuously from that perimeter toward an assigned ring-layer port.
3. Hold briefly at the port or its size-appropriate clearance.
4. Depart continuously back to a distant perimeter.
5. Translate away there, with any loop reset occurring while the ship is hidden.

Never spawn, despawn, or teleport a ship beside the Orbital. Never route a ship
through the Hub. Traffic can be numerous and varied, but it should read as
ordered rather than random.

Culture ships should suggest fields, slabs, ellipsoids, modules, and enormous
size variation rather than familiar rockets, starfighters, or naval hulls.
Larger vessels need proportionally wider traffic clearances.

## Surface and atmosphere

- The inner ring must read as a living world even from Overview: visible seas,
  landmasses, deserts, mountain systems, lakes, and rivers are essential.
- Mountains should be irregular geological systems, not repeated triangular
  spikes or a rough sawtooth ridge.
- Clouds need multiple scales and densities, slow independent movement, and
  occasional subtle storms or lightning.
- Keep weather, ring rotation, and traffic slow enough to convey scale. Motion
  should be discoverable without making the Orbital look toy-sized.

## Things to preserve

- The sun, distant planet, stars, bloom, populated traffic, and atmospheric
  weather collectively create the sense of majesty.
- Arrival, Overview, and Rim flyby remain manually selectable viewpoints, even
  though the cinematic arrival automatically hands off to Overview.
- The Orbital work is intentionally separate from the Career and Systems pages;
  avoid coupling their scene behavior while refining this experience.
