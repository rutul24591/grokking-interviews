# What this example shows

This check compares queued delivery under a limited number of HTTP/1.1 connections with a multiplexed HTTP/2 model. It isolates the core win: fewer artificial waterfalls when many small assets are requested together.
