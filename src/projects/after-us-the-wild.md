---
title: After Us, the Wild
summary: A speculative digital fashion collection in four looks, built in CLO 3D and generative code, where nature reclaims an industrial ruin.
tags: Digital speculative fashion, CLO 3D, generative art, Python
order: 2
---

![A digital model on a glowing runway inside an overgrown industrial ruin](/images/wild/wild-hero.jpg)

After Us, the Wild is a speculative collection set in a post-industrial world where nature has reclaimed human-made spaces after a collapse driven by overproduction, overconsumption, and the exploitation of resources. Four digital looks follow the story from decay to regrowth to bioluminescent renewal.

This was my final project for Major Studio 2. I made the generative prints in my Python class and the garments in my CLO 3D class, then brought both together here.

The mirrored textures start from Adobe Stock images, which I edited lightly and mirrored.

<div class="video">
  <iframe src="https://www.youtube-nocookie.com/embed/XAKdUtga59U" title="Turntable of the four After Us, the Wild looks" loading="lazy" allowfullscreen></iframe>
</div>

*Turntable of all four looks.*

## Why digital

Fast fashion runs on cycles of overproduction and planned obsolescence, and the waste is enormous. I built the whole collection in CLO 3D, Illustrator, and Python, so no physical samples were made.

## The four looks

![The four looks, from industrial decay to bioluminescent renewal](/images/wild/wild-looks.jpg)

1. **Look 1.** A reflection on the harsh, geometric brutality of industrial decay.
2. **Look 2.** A subtle resistance, with nature asserting itself through delicate but persistent growth over human ruins.
3. **Look 3.** Renewal accelerates. The wild no longer just survives, it threads new life into every crack.
4. **Look 4.** Nature's resurgence, illuminated, in a world remade by regenerative forces.

![Close details of the metallic, vine, and bioluminescent garments](/images/wild/wild-details.jpg)

> Digital design does not replace nature. It remembers it.

## Manifesto

The collection comes with a written manifesto in five parts: Rust of Excess, Roots in the Wreckage, Bioluminescent Bloom, Regrowth Protocol, and Final Call. It treats designing without fabric, dye, or physical samples as a form of protest. [Read the manifesto](https://aadyasingh.my.canva.site/manifesto).

## Process

[2 TO 4 SENTENCES: how you went from moodboard to garments in CLO 3D, which parts you modeled, and how the runway scene was built.]

## From code to cloth

The prints are generative. I wrote Python Turtle sketches for three motif systems, exported each as an `.eps`, refined and tiled it in Illustrator, and applied it as a surface print on the garment in CLO 3D. Each system carries one stage of the story.

### Industrial collapse

Debris-like rectangles in muted earth tones, drawn with imperfect, broken lines. Each rectangle gets a random size, angle, and "decay" level, so edges skip, jag, and thin out like cracks and rust. Scattered strokes add dust and rubble.

![From Turtle sketch to tiled print to CLO 3D pattern to Look 1](/images/wild/wild-code-industrial.jpg)

### Nature creeps in

A vine grown one pixel at a time. It sways on a sine wave, thins as it climbs, shifts through greens, and branches by chance, so every run comes out differently.

![From Turtle sketch to print on texture to CLO 3D pattern to Look 2](/images/wild/wild-code-nature.jpg)

### Bioluminescent bloom

Two mirrored arcs, rotated and repeated 180 times, each in a random neon color. The result is a layered, glowing flower, tiled into the final print.

![From Turtle sketch to Illustrator tiling to CLO 3D pattern to Look 4](/images/wild/wild-code-bloom.jpg)

```python
for i in range(180):
    pencolor(random.choice(neon_colors))
    circle(190 - i, 90)
    left(60)
    circle(190 - i, 90)
    left(18)
```

![The finished generative prints](/images/wild/wild-generative.jpg)

## Precedents

I looked at Iris van Herpen's Syntopia collection, which draws on coral reefs and mycelium networks through 3D printing and biomimicry, and at Balenciaga's Afterworld, a game-based fashion experience with a post-apocalyptic setting. [ADD LINKS.]

## What I learned

Generative systems can be used creatively for fashion, and Turtle’s simplicity allowed fast experimentation, but scaling patterns for textile use needed vector editing in Illustrator.