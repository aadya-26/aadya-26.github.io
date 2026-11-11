---
title: "Firefly Flash Patterns"
summary: "A wall-mounted data sculpture that replays the real flash patterns of seven North American firefly species, with LED color showing each species' conservation status."
tags: "Data physicalization, E-textiles, Circuit Playground, Physical computing"
order: 4
---

![The Firefly Flash Patterns sculpture on a wall, with three fireflies lit: one green and two amber](/images/firefly/firefly-hero.jpg)

Fireflies flash in species-specific rhythms to find mates. This sculpture turns that data into light: seven programmable LEDs, each replaying the real flash pattern of one North American firefly species, with the LED color showing how endangered that species is. I made it for Data as Material (Parsons, Spring 2026).

<div class="loop-wrap">
  <video class="loop" autoplay muted loop playsinline preload="metadata" poster="/images/firefly/firefly-video-poster.jpg" aria-label="The whole sculpture, with each firefly flashing its species' real pattern">
    <source src="/videos/firefly-1.mp4" type="video/mp4" />
  </video>
</div>

*The whole sculpture, each firefly flashing its own species' pattern.*

## The data, replayed

The flash patterns come from an open dataset of firefly flashes recorded with stereoscopic cameras across the United States between 2020 and 2022 (Martin et al., 2024). For each of seven species I used three numbers: how many flashes in a burst, the gap between flashes, and how long each flash lasts. Conservation status comes from IUCN Red List assessments of North American fireflies (Fallon et al., 2021).

On the sculpture, each LED is one species. The rhythm is the species' own, and the color is its conservation status. Below is the same data playing in real time.

<div id="firefly-viz"></div>
<script src="/firefly-viz.js" defer></script>

## Making it

The circuit is built on fabric. A Circuit Playground Express sits on the cloth, and the wiring is stitched thread traces across it, so the circuit is part of the object and not hidden. [CHECK: is the thread conductive? how the code is written, CircuitPython or Arduino? how the seven patterns run, together or one at a time?]

I started with a single firefly. This is the first working piece: the board, one LED, a resistor, and the thread traces connecting them, with no top layer and no cut-outs yet.

<div class="loop-wrap">
  <video class="loop" autoplay muted loop playsinline preload="metadata" poster="/images/firefly/firefly-fabric-poster.jpg" aria-label="One LED glowing on the fabric base, connected to the board by stitched traces and a resistor">
    <source src="/videos/firefly-fabric.mp4" type="video/mp4" />
  </video>
</div>

Then a quick prototype of the look: one firefly cut-out held under a sheet of paper, laid over the working fabric base, to see how the light would read through a diffusing layer.

<div class="loop-wrap portrait">
  <video class="loop" autoplay muted loop playsinline preload="metadata" poster="/images/firefly/firefly-prototype-poster.jpg" aria-label="A single firefly cut-out blinking under paper, in the dark">
    <source src="/videos/firefly-prototype.mp4" type="video/mp4" />
  </video>
</div>

From there I scaled up to seven LEDs.

![The fabric before stitching, with LEDs placed around the microcontroller](/images/firefly/firefly-layout.jpg)

![Traces running from the board to each LED](/images/firefly/firefly-circuit-stitch.jpg)

![A close view of the board and connections](/images/firefly/firefly-board-close.jpg)

![The circuit diagram, with one trace per species](/images/firefly/firefly-diagram.jpg)

The fabric then goes into a shallow white frame with a small firefly cut-out for each species. [ADD: why the frame, how the light diffuses.]

![The frame, with the circuit fabric beside it](/images/firefly/firefly-assembled.jpg)

## What I did

[YOUR ROLE: Was this solo? Say what you chose (which species, which numbers), what you built (circuit, code, frame), and what you tested. Two to four sentences, first person.]

## What I learned

[WRITE 2 TO 4 SENTENCES IN YOUR OWN WORDS: what it took to turn numbers into something people feel.]

## Sources

- Martin, O., Nguyen, C., Sarfati, R., et al. (2024). [Embracing firefly flash pattern variability with data-driven species classification](https://www.nature.com/articles/s41598-024-53671-3). *Scientific Reports*, 14, 3432. Data: [github.com/peleg-lab/FireflyClassification](https://github.com/peleg-lab/FireflyClassification).
- Fallon, C. E., et al. (2021). IUCN Red List assessments of 132 North American firefly species. *PLOS ONE*.

<script src="/loop-video.js" defer></script>
