---
title: "ReadIt NYC"
summary: "An interactive 3D map of how Reddit talks about New York neighborhoods: 438 r/nyc posts scored for sentiment, with color for sentiment, size for engagement and height for how strongly a post reads."
tags: "Data visualization, Sentiment analysis, deck.gl, Python"
order: 5
theme: readit
facts: "Context: Data as Material, Parsons | When: Spring 2026 | Data: 438 posts from r/nyc | Built with: React, deck.gl, Python, RoBERTa sentiment model"
---

![ReadIt NYC: a dark 3D map of New York with spheres on stems over neighborhoods, colored green, violet and red by sentiment](/images/readit/readit-overview.jpg)

ReadIt NYC is an interactive map of how people on Reddit talk about New York neighborhoods. Each sphere is one post from r/nyc. Its color is the post's sentiment, its size is how much engagement it got, and its height is how strongly the post reads. I made it for Data as Material (Parsons, Spring 2026).

<div id="readit-embed"></div>

## How to read it

- **Color** is sentiment: green for positive, violet for neutral, red for negative, in five steps from very positive to very negative.
- **Size** is engagement, upvotes plus comments.
- **Height** combines the sentiment model's score for the post with a smaller lift for engagement. I labeled it "emotional intensity" on the map, but the score is the model's confidence in its label, so I read height as a rough signal and not a measure of feeling.
- **Filters** show only positive, neutral or negative posts, or one borough. A time slider plays the posts forward in time, and selecting a sphere opens the post's excerpt and a link back to Reddit.

![The map filtered to negative posts: 77 posts visible, all red](/images/readit/readit-filter-neg.jpg)

![The map filtered to positive posts: 102 posts visible, all green](/images/readit/readit-filter-pos.jpg)

## The data

I collected posts from r/nyc by searching the subreddit for neighborhood names, one search per neighborhood, up to 100 posts each, until I had 1,000. Those 1,000 posts cover 13 neighborhood searches, from Harlem to Flatiron. I then kept only posts with a real body of text (at least 20 characters) that mention a neighborhood I could place on the map, which left 438 posts from 2019 to May 2026. Manhattan has 300 of them, Brooklyn 91, Queens 45 and the Bronx 2.

Each post is placed by keyword. If its text mentions one of my listed neighborhoods, it goes to that neighborhood's coordinates, with a small fixed offset so posts in the same place don't stack. Sentiment is scored with a RoBERTa model trained on social media text (cardiffnlp/twitter-roberta-base-sentiment-latest), on the title plus the first 300 characters of the post. The model labels 250 posts neutral, 108 positive and 80 negative.

## What the map shows

Sorting the neighborhoods that have at least 20 posts by average sentiment puts Harlem and Astoria at the top and the Upper East Side and Upper West Side at the bottom. The gaps are small and the samples are small, so I read this as a way to explore the data and not as a ranking of neighborhoods.

Negative posts also drew the most attention. Their median engagement is 102, against 84 for positive posts and 64 for neutral ones.

<div id="readit-places"></div>

## Limits

- **One subreddit, 438 posts.** This shows how r/nyc talks, not how New York feels. Manhattan is most of the sample, and the Bronx has two posts.
- **Keyword matching is blunt.** A post that mentions a neighborhood in passing still lands there, and a post is placed at the first listed neighborhood it mentions.
- **A model, not a reader.** The sentiment model was trained on tweets, and it labels a news headline about a shooting as negative because of the topic, not because anyone is expressing a feeling.
- **Height is not feeling.** It follows the model's confidence plus engagement, and I labeled it emotional intensity on the map. I would rename it.
- **Privacy.** The map shows a post's title and a short excerpt with a link back to Reddit. It never shows usernames. The dataset behind the live map has no usernames, and its post text is cut to 600 characters.

## What I did

[YOUR ROLE: Solo? Say what you built (scraper, cleaning, sentiment scoring, the map and its interactions) in two to four sentences, first person.]

## What I learned

[WRITE 2 TO 4 SENTENCES IN YOUR OWN WORDS: what building this taught you about what a map like this can and cannot claim.]

<script src="/readit-embed.js" defer></script>
<script src="/readit-charts.js" defer></script>
