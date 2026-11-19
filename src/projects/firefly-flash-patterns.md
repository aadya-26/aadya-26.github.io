---
title: "Jugnu: Firefly Flash Patterns"
summary: "A wall-mounted data sculpture that replays the real flash patterns of seven North American firefly species, with LED color showing each species' conservation status."
tags: "Data physicalization, E-textiles, Circuit Playground, Physical computing"
order: 4
theme: firefly
facts: "Role: Solo, from data to circuit to sculpture | Context: Data as Material, Parsons | When: Spring 2026 | Data: Seven North American firefly species | Built with: Circuit Playground Express, Arduino, LEDs, conductive thread on fabric, battery powered"
---

![The Firefly Flash Patterns sculpture on a wall, with three fireflies lit: one green and two amber](/images/firefly/firefly-hero.jpg)

Jugnu is the Hindi word for firefly, the name I grew up with. Fireflies flash in species-specific rhythms to find mates. This sculpture turns that data into light: seven programmable LEDs, each replaying the real flash pattern of one North American firefly species, with the LED color showing how endangered that species is. I made it for Data as Material (Parsons, Spring 2026) and presented it to the cohort for critique.

## Why fireflies

As a child I went on walks with my mother to spot jugnu, and I was endlessly excited by them. After I moved to a city I barely saw any, and when I moved to the United States and finally spotted some again, I wanted to know more. I started researching them, and this sculpture is the result: a way to make their data physical, and to help more people notice how much light we may be losing.

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

The circuit is built on fabric. A Circuit Playground Express sits on the cloth, and the wiring is conductive thread stitched across it, so the circuit is part of the object and not hidden. The code is Arduino, written with AI assistance: I specified each species' timing, then tested and tuned the result until the dimming looked like a real flash.

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

<div id="firefly-circuit"><img src="/images/firefly/firefly-diagram.jpg" alt="The circuit diagram, with one trace per species" /></div>

The fabric sits inside a shadow box behind a diffuser panel. Each species has a hand-drawn, cut-out firefly on the panel, placed over its LED so the light glows through the paper. The whole piece runs wirelessly on a battery.

![The frame, with the circuit fabric beside it](/images/firefly/firefly-assembled.jpg)

## What I did

This was a solo project. I chose the seven species and took each one's flash pattern from the published dataset, then designed and built everything else: the circuit diagram in Illustrator, the stitched conductive-thread circuit on a Circuit Playground Express, the firmware that encodes each pattern, and the arrangement of the firefly cut-outs so the seven lights read together. I tested one LED first against the real flash timing, then a single hand-drawn firefly under the diffuser, and went through several rounds to get the dimming right before assembling the full piece.

## What I learned

Turning timing data into light took more tuning than I expected, especially the dimming, which is what makes a flash read as a firefly and not a blinking LED. Fixed-color LEDs also limited me: I had to use clearly different colors to show conservation status because I could not mix tones. Next I would switch to NeoPixels so each light can be any color, slow the playback so each species is easier to observe, add a legend relating real flash length to the slowed one (a 3 second blink standing for 0.7 seconds, for example), and engrave each species name on the diffuser so viewers know which firefly they are watching.

## Sources

- Martin, O., Nguyen, C., Sarfati, R., et al. (2024). [Embracing firefly flash pattern variability with data-driven species classification](https://www.nature.com/articles/s41598-024-53671-3). *Scientific Reports*, 14, 3432. Data: [github.com/peleg-lab/FireflyClassification](https://github.com/peleg-lab/FireflyClassification).
- Fallon, C., et al. (2021). [Evaluating firefly extinction risk: Initial red list assessments for North America](https://pubmed.ncbi.nlm.nih.gov/34788329/). *PLOS ONE*, 16(11), e0259379.

<script src="/firefly-circuit.js" defer></script>
<script src="/loop-video.js" defer></script>
