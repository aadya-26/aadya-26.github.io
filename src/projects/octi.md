---
title: Octi
summary: Soft, repositionable press-down keys that let the affected hand take part in desktop work.
tags: E-textiles, accessibility, physical computing, research-through-design
order: 1
---

<!-- ![Four soft fabric keys placed beside a half-QWERTY keyboard on a desk](/images/octi/octi-hero.jpg) -->

Octi is a modular soft-circuit input system for a computer user with hemiplegic cerebral palsy. It gives the affected hand a role in desktop work through movements it already does well: pressing down with the fist, forearm, or elbow.

My MFA thesis at Parsons. An earlier version of this system, a tabletop pad with fist-pressable keys and a squeeze gripper for modifiers, was accepted to the ACM DIS 2026 Work-in-Progress track: Pad-and-Gripper Input for Asymmetric Bimanual Interaction (https://dl.acm.org/doi/10.1145/3802974.3809474).
## The problem

Desktop accessibility setups usually move all the work onto the unaffected hand, through one-handed typing, remapping, and voice. My participant, P1, had used a left-handed half-QWERTY keyboard and trackpad for about ten years. It worked, but every task was sequential, with constant switching between keyboard and trackpad. His right hand had never been used for computer input.

## The question

Instead of recreating a keyboard for a hand that can't use one, could that hand take on a different job? I designed around what P1's right arm could already do reliably: whole-hand pressing, forearm sweeps, and elbow movement.

## My role

Researcher, designer, and maker, from observation through fabrication and evaluation. Advised by Harpreet Sareen.

## Process

<!--![P1's existing desktop setup](/images/octi/octi-setup.jpg) -->

**Observe.** P1 recorded his everyday computer use and isolated movements, and I analysed them remotely. Fine finger control was limited, but squeezing, forearm sweeps, and elbow motion were repeatable.

**Prototype 1.1 to 1.3.** I started with a squeeze gripper for modifier keys and a tabletop pad of large fist-pressable keys. I tested target sizes with paper studies and made an alginate and plaster cast of P1's closed fist to estimate contact area. Prototype 1.3 was the first fully working version, with layered fabric keys and a gripper, and it ran through a Circuit Playground Express acting as a USB keyboard.

<!-- ![Early prototypes: squeeze gripper, hand cast, tabletop mockup](/images/octi/octi-early.jpg) -->

**What broke.** In testing, squeezing while typing caused accidental key presses. Reaching for the pad caused fatigue. Mapping Space to the gripper clashed with the remapped layer on his half-QWERTY keyboard.

**Consult.** An occupational therapist helped me interpret what I had seen. Squeeze is more likely to trigger movement in the other hand as force rises, while pressing down uses larger movements, and the quality of movement drops as targets move away from the arm's resting position.

**Redesign.** I removed the gripper and split the fixed pad into four independent soft keys that P1 can place anywhere beside his keyboard. Everything is now a direct press, and the layout is his to rearrange.

## What I built

<!-- ![Prototype 1.4 system diagram](/images/octi/octi-system.jpg) -->

Four keys, each about 2.5 by 2 inches and a quarter inch thick. Each is a layered stack: faux leather top, copper and Velostat pressure sensing, a felt spacer, foam padding, and a Dycem base so it stays put. Conductive thread runs through paracord sleeves to a Circuit Playground Express, which shows up to the computer as an ordinary keyboard with no software to install.

Two modes use the same layout. The default mode gives Ctrl/Cmd, Shift, Alt/Option, and Enter. The second mode gives the four arrow keys. Each key has its own color on the board's LEDs and its own press and release sound, so P1 gets confirmation without looking at the device.

<!-- ![P1 presses two adjacent keys with one fist](/images/octi/octi-in-use.jpg) -->

<!-- VIDEO EMBED GOES HERE -->

## What I found

These are observations from one participant, not general claims.

- **Short presses worked better than holding.** Shortcuts like copy, paste, and Alt+Tab became manageable after brief practice. Holding a modifier while typing kept producing errors.
- **Distance mattered.** Movement was better when the keys stayed near the arm's resting position.
- **The existing setup shaped the design.** I replaced Space with Enter because Space conflicted with his keyboard remapping. Enter then worked well for list formatting, and P1 kept adding items past what the task asked for.
- **P1 redesigned the layout in use.** He moved two modifier keys together so one fist press could hit both.
- **It was not faster.** A short poem took about 1 minute 10 seconds with his one-handed workflow and about 3 minutes 40 seconds with the prototype. That wasn't the goal. The keys took over capitalization, line breaks, shortcuts, and navigation that his left hand had always done alone. In his words, he would "rather have the option and not use it than not have the option."

## Limits

One participant and three evaluation sessions across two prototypes. Switching modes still needs the small buttons on the board, so it uses his left hand. There's no hold-to-repeat for navigation, and longer navigation tasks were mildly tiring.

## What I learned

Letting go of the squeeze gripper was the turning point. It looked promising because the movement was easy to do, but real use showed accidental presses and fatigue that I couldn't see from watching. I started the project wanting to add more functions, and I ended it convinced that simpler layouts, closer placement, and fewer simultaneous demands made participation more manageable. Success shifted from "faster than his current setup" to participation and choice. Soft materials made that iteration possible, because keys could be resized, padded, and moved between sessions.